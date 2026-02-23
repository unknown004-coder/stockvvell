import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Alerts = () => {
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => getJSON("/api/products") });
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: () => getJSON("/api/stats") });

  const lowStock = products.filter((p: any) => p.quantity > 0 && p.quantity <= 5);
  const outOfStock = products.filter((p: any) => p.quantity === 0);

  useEffect(() => {
    if (outOfStock.length > 0) {
      toast({ title: `${outOfStock.length} product(s) out of stock`, description: "Please restock these items" });
    } else if (lowStock.length > 0) {
      toast({ title: `${lowStock.length} low stock product(s)`, description: "Some items are running low" });
    }
  }, [lowStock.length, outOfStock.length]);

  return (
    <div>
      <h1 className="page-header">Alerts</h1>

      {/* Alert Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs font-semibold">Out of Stock</span>
          </div>
          <p className="text-3xl font-bold">{outOfStock.length}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Bell className="w-5 h-5" />
            <span className="text-xs font-semibold">Low Stock</span>
          </div>
          <p className="text-3xl font-bold">{lowStock.length}</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Info className="w-5 h-5" />
            <span className="text-xs font-semibold">Total Products</span>
          </div>
          <p className="text-3xl font-bold">{stats?.totalProducts ?? products.length}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-primary/5">
          <h2 className="text-lg font-semibold">All Alerts</h2>
        </div>

        {outOfStock.length === 0 && lowStock.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertCircle className="w-14 h-14 mb-4 opacity-30" />
            <p className="text-center text-base font-medium">No alerts available.</p>
            <p className="text-center text-sm text-muted-foreground/70 mt-1">
              Inventory levels are healthy. Alerts will appear when stock falls below thresholds.
            </p>
          </div>
        ) : (
          <div className="p-4">
            {outOfStock.length > 0 && (
              <div className="mb-6">
                <h3 className="section-title">Out of Stock</h3>
                <ul className="list-disc list-inside">
                  {outOfStock.map((p: any) => (
                    <li key={p.id} className="text-sm text-muted-foreground">{p.name} — {p.category || "—"}</li>
                  ))}
                </ul>
              </div>
            )}

            {lowStock.length > 0 && (
              <div>
                <h3 className="section-title">Low Stock</h3>
                <ul className="list-disc list-inside">
                  {lowStock.map((p: any) => (
                    <li key={p.id} className="text-sm text-muted-foreground">{p.name} — {p.quantity} left</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
