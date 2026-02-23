import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, TrendingUp, Bell, LogOut } from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/sales", label: "Sales & Demand", icon: TrendingUp },
  { path: "/alerts", label: "Alerts", icon: Bell },
];

const Sidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  function handleLogout() {
    // Authentication removed; just navigate to login screen
    navigate("/");
  }

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border bg-gradient-to-r from-sidebar to-sidebar/90">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6 text-sidebar-primary" />
          <span>Stock<span className="text-sidebar-primary">vv</span>ell</span>
        </h1>
        <p className="text-xs text-sidebar-foreground/70 mt-1">Inventory System</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/30 transition-all duration-200">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
