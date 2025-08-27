"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CreateFieldDialog({ open, onOpenChange, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: "",
    crop: "",
    area: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/fields", {
        name: form.name,
        crop: form.crop,
        area: parseFloat(form.area),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Talhão</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crop">Cultura</Label>
            <Input name="crop" value={form.crop} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Área (ha)</Label>
            <Input
              name="area"
              value={form.area}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              type="number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              type="number"
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
