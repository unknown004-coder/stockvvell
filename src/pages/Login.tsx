import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginSuccessAnimation from "@/components/LoginSuccessAnimation";
import { postJSON } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    // Demo login: accept any credentials and proceed to dashboard
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    navigate("/dashboard");
  };

  return (
    <>
      {showAnimation && <LoginSuccessAnimation onComplete={handleAnimationComplete} />}
      <div className="min-h-screen bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-primary-foreground mb-3">
            <Package className="w-12 h-12 text-accent" />
            <h1 className="text-4xl font-bold">
              Stock<span className="text-accent">vv</span>ell
            </h1>
          </div>
          <p className="text-primary-foreground/90 text-sm font-medium">Inventory Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Don't have an account? <Link to="/signup" className="text-primary underline">Create one</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-primary-foreground/70 mt-8">
          © 2024 Stockvvell - Beginner Inventory Management System
        </p>
      </div>
      </div>
    </>
  );
};

export default Login;
