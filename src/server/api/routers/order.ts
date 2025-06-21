import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createQRIS } from "@/server/xendit";
import { addMinutes } from "date-fns";

export const orderRouter = createTRPCRouter({
  createOrder: protectedProcedure
  // Input berupa orderItems (productId & quantity)
  .input(
    // kirim object
    z.object({
      // field objectnya orderItems yang berupa array
      orderItems: z.array(
        // isi item array adalah object dgn field productId dan quantity
        z.object({
          productId: z.string(),
          quantity: z.number().min(1),
      }))
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { db } = ctx;
    // Ambil orderItems (productId & quantity) dari input
    const { orderItems } = input;

    // Ambil semua data produk dari database berdasarkan productId yang ada di orderItems
    const products = await db.product.findMany({
      where: {
        id:{
          // Mengambil semua productId dari orderItems untuk dijadikan filter
          in: orderItems.map((item) => item.productId)
        },
      },
    });

    let subtotal = 0

    // Calculate subtotal price
    // nge-map/loop products dengan mencari productQuantity
    products.forEach(product => {

      // Quantity diambil dari input (orderItems) dgn kondisi id produk (klo dapat akan diambil quantity-nya)
      // Operator Non-Null Assertion (!) = memberi tahu TypeScript bahwa suatu nilai, yang mungkin null atau undefined, sebenarnya tidak null atau undefined pada saat itu. 
      const productQuantity = orderItems.find(item => item.productId === product.id)!.quantity;

      const totalPrice = product.price * productQuantity;

      subtotal += totalPrice;
    })

    // Calculate tax/pajak
    const tax = subtotal * 0.1;

    // Calculate total akhir
    const grandTotal = subtotal + tax;

    // Bikin transaksi/order dgn grandTotal, subtotal, tax
    const order = await db.order.create({
      data: {
        grandTotal,
        subtotal,
        tax,
      },
    });
    
    // Bikin orderitems/daftar produk transaksi
    const newOrderItems = await db.orderItem.createMany({
      data: products.map(product => {
        const productQuantity = orderItems.find(item => item.productId === product.id,)!.quantity;

        return {
          orderId: order.id,
          price: product.price,
          productId: product.id,
          quantity: productQuantity,
        };
      }),
    });

    const paymentRequest = await createQRIS({
      amount: grandTotal,
      orderId: order.id,
      // expiresAt: addMinutes(new Date(), 1), // default value 15 menit di xendit.ts
    })

    await db.order.update({
      where :{
        id: order.id,
      },
      data: {
        // tracking pembayaran
        externalTransactionId: paymentRequest.id,
        // simulasikan pembayaran
        paymentMethodId: paymentRequest.paymentMethod.id,
      },
    });

    return {
      order,
      newOrderItems,
      qrString: paymentRequest.paymentMethod.qrCode?.channelProperties?.qrString,
    };

  }),
});