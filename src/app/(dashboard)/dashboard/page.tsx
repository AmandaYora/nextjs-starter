import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { TrendLineChart } from "@/shared/ui/chart";

const chartData = [
  { name: "Mon", value: 16 },
  { name: "Tue", value: 22 },
  { name: "Wed", value: 18 },
  { name: "Thu", value: 27 },
  { name: "Fri", value: 32 },
  { name: "Sat", value: 20 },
  { name: "Sun", value: 24 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground">
          This starter ships with sensible defaults for a real admin dashboard.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">1,284</p>
            <p className="text-sm text-green-600">+4.2% vs last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">312</p>
            <p className="text-sm text-muted-foreground">Updated every 5 minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Support tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">18 open</p>
            <p className="text-sm text-muted-foreground">12 resolved today</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Weekly signups</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendLineChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
