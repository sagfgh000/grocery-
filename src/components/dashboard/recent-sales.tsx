import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const salesData = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+৳১,৯৯৯.০০", avatar: "OM" },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+৳৩৯.০০", avatar: "JL" },
    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+৳২৯৯.০০", avatar: "IN" },
    { name: "William Kim", email: "will@email.com", amount: "+৳৯৯.০০", avatar: "WK" },
    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+৳৩৯.০০", avatar: "SD" },
];

export function RecentSales() {
  return (
    <div className="space-y-8">
      {salesData.map((sale) => (
        <div className="flex items-center" key={sale.email}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://placehold.co/40x40.png?text=${sale.avatar}`} alt="Avatar" />
            <AvatarFallback>{sale.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  )
}
