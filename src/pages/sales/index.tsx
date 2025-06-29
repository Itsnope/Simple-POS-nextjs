import {
  DashboardDescription,
  DashboardHeader,
  DashboardLayout,
  DashboardTitle,
} from "@/components/layouts/DashboardLayout";
import { OrderCard } from "@/components/OrderCard";
import type { NextPageWithLayout } from "../_app";
import type { ReactElement } from "react";
import { useState } from "react";
import { api } from "@/utils/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus } from "@prisma/client";

const SalesPage: NextPageWithLayout = () => {

  const [filterOrder, setFilterOrder] = useState<OrderStatus | "ALL">("ALL");
  
  const { data: orders } = api.order.getOrders.useQuery({
    status: filterOrder, // saat state berubah, auto refetch dengan value terbaru
  });

  // const [orders, setOrders] = useState<Order[]>([
  //   {
  //     id: "ORD-001",
  //     totalAmount: 45.99,
  //     totalItems: 3,
  //     status: "Processing"
  //   },
  //   {
  //     id: "ORD-002",
  //     totalAmount: 23.50,
  //     totalItems: 2,
  //     status: "Finished"
  //   },
  //   {
  //     id: "ORD-003",
  //     totalAmount: 67.25,
  //     totalItems: 5,
  //     status: "Processing"
  //   },
  //   {
  //     id: "ORD-004",
  //     totalAmount: 12.99,
  //     totalItems: 1,
  //     status: "Finished"
  //   },
  //   {
  //     id: "ORD-005",
  //     totalAmount: 89.75,
  //     totalItems: 7,
  //     status: "Processing"
  //   },
  //   {
  //     id: "ORD-006",
  //     totalAmount: 34.20,
  //     totalItems: 4,
  //     status: "Finished"
  //   }
  // ]);


  const handleFilterOrderChange = (value: OrderStatus | "ALL") => {
    setFilterOrder(value);
  };

  const handleFinishOrder = (orderId: string) => {
    // setOrders(prevOrders =>
    //   prevOrders.map(order =>
    //     order.id === orderId
    //       ? { ...order, status: "Finished" as const }
    //       : order
    //   )
    // );
  };

  return (
    <>
      <DashboardHeader>
        <DashboardTitle>Sales Dashboard</DashboardTitle>
        <DashboardDescription>
          Track your sales performance and view analytics.
        </DashboardDescription>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold">$0.00</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Ongoing Orders</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="text-lg font-medium">Completed Orders</h3>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium mb-4">Orders</h3>

          <Select defaultValue="ALL" onValueChange={handleFilterOrderChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent align="end">
              <SelectItem value="ALL">ALL</SelectItem>
              {
                // ambil isi/value OrderStatus jadi array terus di mapping
                Object.keys(OrderStatus).map((orderStatus) => {
                  return (
                    <SelectItem key={orderStatus} value={orderStatus}>
                      {/* @ts-expect-error will fix type later */}
                      {OrderStatus[orderStatus]}
                    </SelectItem>
                  )
                })
              }
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders?.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              totalAmount={order.grandTotal}
              totalItems={order._count.OrderItems}
              status={order.status}
              onFinishOrder={handleFinishOrder}
            />
          ))}
        </div>
      </div>
    </>
  );
};

SalesPage.getLayout = (page: ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SalesPage; 