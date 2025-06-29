import { Button } from "@/components/ui/button";
import { toRupiah } from "@/utils/toRupiah";
import { OrderStatus } from "@prisma/client";

// export interface Order {
//   id: string;
//   totalAmount: number;
//   totalItems: number;
//   status: "Processing" | "Finished";
// }

interface OrderCardProps {
  // order: Order;
  id: string;
  totalAmount: number;
  totalItems: number;

  // ambil type dri prisma
  status: OrderStatus;

  onFinishOrder?: (orderId: string) => void;
  isFinishingOrder?: boolean;
}

export const OrderCard = ({ id, totalAmount, totalItems, status, isFinishingOrder, onFinishOrder }: OrderCardProps) => {
  const handleFinishOrder = () => {
    if (onFinishOrder) {
      onFinishOrder(id);
    }
  };

  // Untuk 3 kondisi OrderStatus
  const getBadgeColor = () => {
    switch (status) {
      case OrderStatus.AWAITING_PAYMENT:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.DONE:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="rounded-lg border p-4 shadow-sm bg-card">
      <div className="flex flex-col mb-3 gap-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Order ID</h4>
          <p className="font-mono text-sm">{id}</p>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getBadgeColor()}`}
        >
          {status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Total Amount</h4>
          <p className="text-lg font-bold">{toRupiah(totalAmount)}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm text-muted-foreground">Total Items</h4>
          <p className="text-lg font-bold">{totalItems}</p>
        </div>
      </div>

      {status === OrderStatus.PROCESSING && (
        <Button 
          onClick={handleFinishOrder}
          className="w-full"
          size="sm"
          disabled={isFinishingOrder}
        >
          {isFinishingOrder ? "Processing..." : "Finish Order"}
        </Button>
      )}
    </div>
  );
}; 