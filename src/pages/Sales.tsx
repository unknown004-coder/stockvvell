import { BarChart3, TrendingUp, AlertCircle } from "lucide-react";

const Sales = () => {
  return (
    <div>
      <h1 className="page-header">Sales & Demand</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border bg-primary/5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Sales Overview
            </h2>
          </div>
          
          {/* Empty Chart Area */}
          <div className="p-6">
            <div className="h-48 border-2 border-dashed border-border rounded-md flex flex-col bg-muted/20">
              {/* Y-axis labels */}
              <div className="flex-1 flex flex-col justify-between py-4 pl-3 text-xs text-muted-foreground font-medium">
                <span>₹1000</span>
                <span>₹750</span>
                <span>₹500</span>
                <span>₹250</span>
                <span>₹0</span>
              </div>
              {/* X-axis */}
              <div className="flex justify-between px-8 py-3 text-xs text-muted-foreground font-medium border-t border-dashed border-border">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Sales data will appear once transactions are added.
              </p>
            </div>
          </div>
        </div>

        {/* Demand Trends */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border bg-primary/5">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Demand Trends
            </h2>
          </div>
          
          {/* Empty Chart Area */}
          <div className="p-6">
            <div className="h-48 border-2 border-dashed border-border rounded-md flex flex-col bg-muted/20">
              {/* Y-axis labels */}
              <div className="flex-1 flex flex-col justify-between py-4 pl-3 text-xs text-muted-foreground font-medium">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
              {/* X-axis */}
              <div className="flex justify-between px-8 py-3 text-xs text-muted-foreground font-medium border-t border-dashed border-border">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-accent/5 rounded-md border border-accent/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Demand trends will appear as data is collected.
              </p>
            </div>
          </div>
        </div>
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

        {/* Empty State */}
        <div className="py-12 text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">No transactions recorded yet.</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Transactions will appear here once products are sold.</p>
        </div>
      </div>
    </div>
  );
};

export default Sales;
