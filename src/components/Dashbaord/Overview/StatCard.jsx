import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatCard({ title, icon, value, description }) {
  return (
    <Card className={' shadow-xl gap-2'}>
      <CardHeader className="flex flex-row items-center justify-start gap-2 pb-2">
        {icon}
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
