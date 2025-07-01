import { Button } from "../ui/button";

import { PRODUCTS } from "@/data/mock";
import { toRupiah } from "@/utils/toRupiah";
import { CheckCircle2, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { PaymentQRCode } from "./PaymentQrCode";
import { useCartStore } from "@/store/cart";
import { api } from "@/utils/api";
import { toast } from "sonner";

type OrderItemProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

const OrderItem = ({ id, name, price, quantity, imageUrl }: OrderItemProps) => {
  return (
    <div className="flex gap-3" key={id}>
      <div className="relative aspect-square h-20 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="flex w-full flex-col justify-between">
        <div className="flex flex-col">
          <p>{name}</p>
          <p className="text-muted-foreground text-sm">
            {toRupiah(price)} x {quantity}
          </p>
        </div>

        <div className="flex w-full justify-between">
          <p className="font-medium">{toRupiah(quantity * price)}</p>

          <div className="flex items-center gap-3">
            <button className="bg-secondary hover:bg-secondary/80 cursor-pointer rounded-full p-1">
              <Minus className="h-4 w-4" />
            </button>

            <span className="text-sm">{quantity}</span>

            <button className="bg-secondary hover:bg-secondary/80 cursor-pointer rounded-full p-1">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type CreateOrderSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateOrderSheet = ({
  open,
  onOpenChange,
}: CreateOrderSheetProps) => {
  // Global variable cart.ts
  const cartStore = useCartStore();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentInfoLoading, setPaymentInfoLoading] = useState(false);
  // const [paymentSuccess, setPaymentSuccess] = useState(false);

  // const subtotal = 100000; 
  // a = akumulator (sesuai iterasi, awal biasa = 0), b = currentValue
  const subtotal = cartStore.items.reduce((a, b) => { 
    return a + b.price * b.quantity; 
  }, 0);
  // useMemo() = me-recalculate saat subtotal berubah, tdk render ulang tiap perubahan
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax, [subtotal, tax]);

  const { mutate: createOrder, data: createOrderResponse } = api.order.createOrder.useMutation({
    onSuccess: () => {
      toast("Created order");

      setPaymentDialogOpen(true);
    }
  });

  // mutation simulate payment
  const { mutate: simulatePayment } = api.order.simulatePayment.useMutation({
    onSuccess: () => {
      toast("Simulated payment");
    },
  });

  // mutation payment status
  const { 
    mutate: checkOrderPaymentStatus, 
    data: orderPaid, 
    // mutation lagi loading
    isPending: checkOrderPaymentStatusIsPending, 
    // reset mutate biar data bisa ke reset ke 0
    reset: resetCheckOrderPaymentStatus,
  } = api.order.checkOrderPaymentStatus.useMutation({
    // saat status payment sukses/dibayar, maka cartstore akan kosong.
    onSuccess: (orderPaidResponse) => {
      if (orderPaidResponse) {
        cartStore.clearCart();
        return;
      }
    },
  });

  const handleCreateOrder = () => {
    if (grandTotal <= 10000000) {
      createOrder({
        orderItems: cartStore.items.map(item => {
          return {
            productId: item.productId,
            quantity: item.quantity,
          }
        })
      });
    } else {
      // QRIS hanya support transaksi dibawah 10 juta
      toast("Transaksi harus kurang Rp10.000.000");
    }
    // setPaymentDialogOpen(true);
    // setPaymentInfoLoading(true);

    // setTimeout(() => {
    //   setPaymentInfoLoading(false);
    // }, 3000);
  };

  // Check payment status
  const handleRefresh = () => {
    if (!createOrderResponse) return;

    checkOrderPaymentStatus({
      orderId: createOrderResponse?.order.id,
    });
  };

  // Simulate payment button
  const handelSimulatePayment = () => {
    if (!createOrderResponse) return;

    simulatePayment({
      orderId: createOrderResponse?.order.id,
    })
  };

  // Reset orderpaid status
  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    onOpenChange(false);
    resetCheckOrderPaymentStatus();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle className="text-2xl">Create New Order</SheetTitle>
            <SheetDescription>
              Add products to your cart and create a new order.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 overflow-y-scroll p-4">
            <h1 className="text-xl font-medium">Order Items</h1>
            <div className="flex flex-col gap-6">
              {/* Map order items here */}
              {
                cartStore.items.map(item => {
                  return (
                    <OrderItem 
                      key={item.productId} 
                      id={item.productId} 
                      name={item.name} 
                      price={item.price} 
                      imageUrl={item.imageUrl} 
                      quantity={item.quantity}
                    />
                  )
                })
              }
            </div>
          </div>

          <SheetFooter>
            <h3 className="text-lg font-medium">Payment Details</h3>

            <div className="grid grid-cols-2 gap-2">
              <p>Subtotal</p>
              <p className="place-self-end">{toRupiah(subtotal)}</p>

              <p>Tax</p>
              <p className="place-self-end">{toRupiah(tax)}</p>

              <Separator className="col-span-2" />

              <p>Total</p>

              <p className="place-self-end">{toRupiah(grandTotal)}</p>
            </div>

            <Button
              size="lg"
              className="mt-8 w-full"
              onClick={handleCreateOrder}
            >
              Create Order
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <AlertDialogContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-lg font-medium">Finish Payment</p>

            {paymentInfoLoading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="border-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-l-2" />

                <p>Loading...</p>
              </div>
            ) : (
              <>

                {!orderPaid && (
                  <Button 
                    variant="link" 
                    onClick={handleRefresh} 
                    disabled={checkOrderPaymentStatusIsPending}
                  >
                    { checkOrderPaymentStatusIsPending 
                      ? "Refreshing..." 
                      : "Refresh" 
                    }
                  </Button>
                )}

                {!orderPaid ? (
                  // qr-string
                  <PaymentQRCode qrString={createOrderResponse?.qrString ?? ""} />
                ) : (
                  <CheckCircle2 className="size-80 text-green-500" />
                )}

                {/* price */}
                <p className="text-3xl font-medium">{toRupiah(createOrderResponse?.order.grandTotal ?? 0)}</p>

                <p className="text-muted-foreground text-sm">
                  {/* id transaksi */}
                  Transaction ID: {createOrderResponse?.order.id}
                </p>

                { !orderPaid && (
                  <Button onClick={handelSimulatePayment} variant="link" >Simulate Payment</Button>
                )}

              </>
            )}
          </div>

          <AlertDialogFooter>
            <Button
              disabled={paymentInfoLoading}
              variant="outline"
              className="w-full"
              onClick={handleClosePaymentDialog}
            >
              Done
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
