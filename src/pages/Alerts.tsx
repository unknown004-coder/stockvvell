import { Bell, AlertTriangle, Info, AlertCircle } from "lucide-react";

const Alerts = () => {
  return (
    <div>
      <h1 className="page-header">Alerts</h1>

      {/* Alert Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs font-semibold">Critical</span>
          </div>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Bell className="w-5 h-5" />
            <span className="text-xs font-semibold">Warnings</span>
          </div>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Info className="w-5 h-5" />
            <span className="text-xs font-semibold">Info</span>
          </div>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-primary/5">
          <h2 className="text-lg font-semibold">All Alerts</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <AlertCircle className="w-14 h-14 mb-4 opacity-30" />
          <p className="text-center text-base font-medium">No alerts available.</p>
          <p className="text-center text-sm text-muted-foreground/70 mt-1">
            Inventory levels are not set. Alerts will appear when stock falls below thresholds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
