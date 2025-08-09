import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { orders } from "@/lib/data";

  export default function OrdersPage() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Orders</h2>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                            <TableHead className="text-right">Total Profit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.createdAt.toLocaleDateString('bn-BD')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.paymentMethod}</Badge>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                                <TableCell className="text-right text-green-600">{formatCurrency(order.totalProfit)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
  }
  