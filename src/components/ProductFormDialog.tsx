import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { postJSON, putJSON } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Product = { id?: string; name: string; category?: string; quantity?: number; price?: number };

export default function ProductFormDialog({
  product,
  onSaved,
  trigger,
}: {
  product?: Product | null;
  onSaved?: (p: any) => void;
  trigger: React.ReactNode;
}) {
  const form = useForm<Product>({ defaultValues: { name: product?.name || "", category: product?.category || "", quantity: product?.quantity || 0, price: product?.price || 0 } });

  async function onSubmit(values: Product) {
    try {
      if (product?.id) {
        const updated = await putJSON(`/api/products/${product.id}`, values);
        onSaved?.(updated);
        toast({ title: "Product updated" });
      } else {
        const created = await postJSON("/api/products", values);
        onSaved?.(created);
        toast({ title: "Product created" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || String(err) });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 pt-4">
          <div>
            <Label>Name</Label>
            <Input {...form.register("name", { required: "Name is required" })} />
            {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{String(form.formState.errors.name.message)}</p>}
          </div>

          <div>
            <Label>Category</Label>
            <Input {...form.register("category")} />
            {form.formState.errors.category && <p className="text-sm text-destructive mt-1">{String(form.formState.errors.category.message)}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantity</Label>
              <Input type="number" {...form.register("quantity", { valueAsNumber: true, min: { value: 0, message: "Minimum 0" } })} />
              {form.formState.errors.quantity && <p className="text-sm text-destructive mt-1">{String(form.formState.errors.quantity.message)}</p>}
            </div>

            <div>
              <Label>Price</Label>
              <Input type="number" {...form.register("price", { valueAsNumber: true, min: { value: 0, message: "Minimum 0" } })} />
              {form.formState.errors.price && <p className="text-sm text-destructive mt-1">{String(form.formState.errors.price.message)}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
