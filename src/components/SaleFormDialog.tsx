import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getJSON, postJSON } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function SaleFormDialog({ trigger, onSaved }: { trigger: React.ReactNode; onSaved?: (s: any) => void }) {
  const [products, setProducts] = React.useState<any[]>([]);
  const form = useForm({ defaultValues: { productId: "", quantity: 1, amount: 0 } });

  React.useEffect(() => {
    getJSON("/api/products").then((data) => setProducts(data || []));
  }, []);

  // Auto-calculate amount when productId or quantity changes
  const productId = form.watch("productId");
  const quantity = form.watch("quantity");

  React.useEffect(() => {
    if (productId && quantity) {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const calculatedAmount = product.price * quantity;
        form.setValue("amount", calculatedAmount);
      }
    }
  }, [productId, quantity, products, form]);

  async function onSubmit(values: any) {
    try {
      const sale = await postJSON("/api/sales", values);
      onSaved?.(sale);
      toast({ title: "Sale recorded" });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || String(err) });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Sale</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 pt-4">
          <div>
            <Label>Product</Label>
            <select {...form.register("productId", { required: "Product required" })} className="flex h-10 w-full rounded-md border border-input px-3">
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (qty {p.quantity})
                </option>
              ))}
            </select>
            {form.formState.errors.productId && <p className="text-sm text-destructive mt-1">{String(form.formState.errors.productId.message)}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input type="number" {...form.register("quantity", { valueAsNumber: true, min: { value: 1, message: "Minimum 1" } })} />
              {form.formState.errors.quantity && <p className="text-sm text-destructive mt-1">{String(form.formState.errors.quantity.message)}</p>}
            </div>

            <div>
              <Label>Amount</Label>
              <Input type="number" {...form.register("amount", { valueAsNumber: true })} readOnly className="bg-muted cursor-not-allowed" />
              {form.formState.errors.amount && <p className="text-sm text-destructive mt-1">{String(form.formState.errors.amount.message)}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
