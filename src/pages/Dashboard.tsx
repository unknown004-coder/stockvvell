import { Package, IndianRupee, TrendingUp, AlertTriangle, Info } from "lucide-react";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";

const Dashboard = () => {
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: () => getJSON("/api/stats") });

  return (
    <div>
      <h1 className="page-header">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon={Package} iconColor="text-primary" />
        <StatCard title="Total Sales" value={`₹${stats?.totalSales ?? 0}`} icon={IndianRupee} iconColor="text-[hsl(var(--success))]" />
        <StatCard title="Demand Score" value={"0%"} icon={TrendingUp} iconColor="text-accent" />
        <StatCard title="Low Stock Items" value={stats?.lowStock ?? 0} icon={AlertTriangle} iconColor="text-destructive" />
      </div>

      {/* Empty State */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <Info className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <p className="text-center text-base text-muted-foreground font-medium">
            No data available. Start by adding products.
          </p>
          <p className="text-center text-sm text-muted-foreground/70 mt-2">
            Go to the Inventory page to add your first product.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
