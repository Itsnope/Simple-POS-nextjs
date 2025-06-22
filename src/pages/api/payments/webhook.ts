import { db } from "@/server/db";
import type { NextApiHandler } from "next";

type XenditWebhookBody = {
  event: "payment.succeeded";
  data: {
    id: string;
    amount: number;
    payment_request_id: string;
    reference_id: string;
    status: "SUCCEEDED" | "FAILED";
  };
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") return;

  // Verify webhook berasal dari Xendit
  const headers = req.headers;
  const webhookToken = headers["x-callback-token"];

  // console.log(webhookToken);
  
  if (webhookToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return res.status(401);
  };

  const body = req.body as XenditWebhookBody;

  // Process order
  // 1. Find order dgn reference id
  // 2. if success update order to success
  const order = await db.order.findUnique({
    where: {
      // id transaksi
      id: body.data.reference_id,
    },
  });

  // Order tidak ada maka error
  if (!order) {
    return res.status(404).send("Order not found");
  }
  
  if (body.data.status !== "SUCCEEDED") {
    // update order menjadi failed
    return res.status(422);
  }

  // sdh dibayar, tapi belum selesai prosesnya
  await db.order.update({
    where: {
      id: order.id,
    },
    data: {
      paidAt: new Date(),
      status: "PROCESSING",
    },
  });

  // endpoint untuk nerima webhook
  res.status(200); // tes endpoint bisa di hit sama xendit
};

export default handler;