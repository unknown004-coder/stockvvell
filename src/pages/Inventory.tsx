import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductFormDialog from "@/components/ProductFormDialog";
import EmptyState from "@/components/EmptyState";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getJSON, postJSON, putJSON, del } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Inventory = () => {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: () => getJSON("/api/products") });
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: () => getJSON("/api/stats") });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-header mb-0">Inventory</h1>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
          + Add Product
        </Button>
      </div>

      {/* Stock Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-md bg-[hsl(var(--success))]/10">
              <CheckCircle className="w-5 h-5 text-[hsl(var(--success))]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">In Stock</p>
              <p className="text-2xl font-bold">{stats?.inStock ?? 0}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-md bg-accent/10">
              <AlertTriangle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Low Stock</p>
              <p className="text-2xl font-bold">{stats?.lowStock ?? 0}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-md bg-destructive/10">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Out of Stock</p>
              <p className="text-2xl font-bold">{stats?.outOfStock ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-primary/5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Product List</h2>
          <div>
            <ProductFormDialog
              trigger={<Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">+ Add Product</Button>}
              onSaved={() => {
                toast({ title: "Product saved" });
                qc.invalidateQueries(["products"]);
                qc.invalidateQueries(["stats"]);
              }}
            />
          </div>
        </div>
        
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 px-4 py-3 bg-muted text-muted-foreground text-xs font-semibold">
          <span>Product Name</span>
          <span>Category</span>
          <span>Quantity</span>
          <span>Price</span>
          <span>Status</span>
        </div>

        {/* Products */}
        <div className="divide-y">
          {isLoading && (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading...</div>
          )}
          {products?.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-t border-border">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-center text-sm font-medium">No products added yet.</p>
              <p className="text-center text-xs text-muted-foreground/70 mt-1">Click the 'Add Product' button to get started.</p>
            </div>
          )}
          {products?.map((p: any) => (
            <div key={p.id} className="grid grid-cols-5 gap-4 px-4 py-3 items-center">
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-muted-foreground">{p.category}</span>
              <span>{p.quantity}</span>
              <span>₹{p.price}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground mr-2">{p.quantity > 0 ? "In stock" : "Out"}</span>
                <ProductFormDialog
                  product={p}
                  trigger={<Button size="sm" variant="outline">Edit</Button>}
                  onSaved={() => {
                    toast({ title: "Product updated" });
                    qc.invalidateQueries(["products"]);
                    qc.invalidateQueries(["stats"]);
                  }}
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    try {
                      if (!confirm(`Delete ${p.name}?`)) return;
                      await del(`/api/products/${p.id}`);
                      toast({ title: "Deleted", description: p.name });
                      qc.invalidateQueries(["products"]);
                      qc.invalidateQueries(["stats"]);
                    } catch (err: any) {
                      toast({ title: "Error", description: err?.message || String(err) });
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Inventory;
