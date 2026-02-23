import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJSON, postJSON, del } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import SaleFormDialog from "@/components/SaleFormDialog";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const Sales = () => {
  const qc = useQueryClient();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-header">Sales & Demand</h1>
        <div className="flex items-center gap-2">
          <SaleFormDialog
            trigger={<button className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-accent-foreground">Record Sale</button>}
            onSaved={() => {
              toast({ title: "Sale recorded" });
              qc.invalidateQueries(["sales"]);
              qc.invalidateQueries(["products"]);
              qc.invalidateQueries(["stats"]);
            }}
          />
          <button
            onClick={async () => {
              if (!confirm("Clear all sales? This will reset the demand graph.")) return;
              try {
                await del("/api/sales");
                toast({ title: "Sales cleared" });
                qc.invalidateQueries(["sales"]);
                qc.invalidateQueries(["stats"]);
              } catch (err: any) {
                toast({ title: "Error", description: err?.message || String(err) });
              }
            }}
            className="inline-flex items-center gap-2 rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground"
          >
            Reset Sales
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <SalesOverviewChart />

        {/* Demand Trends */}
        <DemandTrendsChart />
      </div>

      {/* Sales Summary Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-primary/5">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-muted text-muted-foreground text-xs font-semibold">
          <span>Date</span>
          <span>Product</span>
          <span>Quantity</span>
          <span>Amount</span>
        </div>

        {/* Transactions */}
        <TransactionsList />
      </div>
    </div>
  );
};

export default Sales;

function SalesOverviewChart() {
  const { data: sales = [] } = useQuery({ queryKey: ["sales"], queryFn: () => getJSON("/api/sales") });

  const totalSales = sales.reduce((sum: number, sale: any) => sum + (sale.amount || 0), 0);
  const totalTransactions = sales.length;
  const avgSale = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border border-primary/20 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow text-primary-foreground"
    >
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-3 rounded-lg bg-primary-foreground/10"
          >
            <BarChart3 className="w-6 h-6" />
          </motion.div>
          <h2 className="text-lg font-semibold">Sales Overview</h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-1">
            <p className="text-primary-foreground/70 text-sm font-medium">Total Sales</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl font-bold"
            >
              ₹{totalSales.toFixed(2)}
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-primary-foreground/10 rounded-lg p-4"
            >
              <p className="text-primary-foreground/70 text-xs font-medium">Transactions</p>
              <p className="text-2xl font-bold mt-1">{totalTransactions}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-primary-foreground/10 rounded-lg p-4"
            >
              <p className="text-primary-foreground/70 text-xs font-medium">Avg Sale</p>
              <p className="text-2xl font-bold mt-1">₹{avgSale.toFixed(0)}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function DemandTrendsChart() {
  const { data: sales = [] } = useQuery({ queryKey: ["sales"], queryFn: () => getJSON("/api/sales") });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => getJSON("/api/products") });

  // Top products by quantity sold
  const demandData = sales.reduce((acc: any, sale: any) => {
    const product = products.find((p: any) => p.id === sale.productId);
    const productName = product?.name || sale.productName || "Unknown";
    const existing = acc.find((item: any) => item.name === productName);
    if (existing) {
      existing.quantity += sale.quantity;
    } else {
      acc.push({ name: productName, quantity: sale.quantity });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.quantity - a.quantity).slice(0, 5);

  const COLORS = [
    "hsl(var(--accent))",
    "hsl(var(--primary))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--destructive))",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="bg-gradient-to-br from-card to-card/95 border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-5 border-b border-border/50 bg-gradient-to-r from-accent/5 via-transparent to-accent/5">
        <div className="flex items-center gap-2.5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="p-2 rounded-lg bg-accent/10"
          >
            <TrendingUp className="w-5 h-5 text-accent" />
          </motion.div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Demand Trends</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Top selling products</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        {demandData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground space-y-2">
            <TrendingUp className="w-12 h-12 opacity-20" />
            <p className="text-sm">No sales data yet</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={demandData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, quantity }) => `${name}: ${quantity}`}
                    outerRadius={85}
                    innerRadius={50}
                    fill="#8884d8"
                    dataKey="quantity"
                    animationDuration={1200}
                    animationBegin={300}
                  >
                    {demandData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} units`} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 pt-4 border-t border-border/30"
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                {demandData.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function TransactionsList() {
  const { data: sales = [] } = useQuery({ queryKey: ["sales"], queryFn: () => getJSON("/api/sales") });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => getJSON("/api/products") });

  if (!sales || sales.length === 0) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-medium">No transactions recorded yet.</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Transactions will appear here once products are sold.</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {sales.map((s: any) => {
        const p = products.find((x: any) => x.id === s.productId);
        const name = p?.name || s.productName || "Unknown";
        return (
          <div key={s.id} className="grid grid-cols-4 gap-4 px-4 py-3 items-center">
            <span>{new Date(s.date).toLocaleString()}</span>
            <span className="font-medium">{name}</span>
            <span>{s.quantity}</span>
            <span>₹{s.amount}</span>
          </div>
        );
      })}
    </div>
  );
}
