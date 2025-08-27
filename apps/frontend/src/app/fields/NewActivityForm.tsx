"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

type Props = {
  fieldId: string;
  onSuccess: () => void;
};

export function NewActivityForm({ fieldId, onSuccess }: Props) {
  const [form, setForm] = useState({
    type: "plantio",
    date: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post(`/fields/${fieldId}/activities`, {
        ...form,
        date: new Date(form.date).toISOString(),
      });

      setForm({ type: "plantio", date: "", notes: "" });
      onSuccess();
    } catch (err) {
      console.error("Erro ao criar atividade:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-4 space-y-4">
      <h3 className="text-lg font-semibold">Nova Atividade</h3>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={form.type}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PLANTIO">Plantio</SelectItem>
            <SelectItem value="ADUBACAO">Adubação</SelectItem>
            <SelectItem value="COLHEITA">Colheita</SelectItem>
            <SelectItem value="OUTRO">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Input name="notes" value={form.notes} onChange={handleChange} />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Adicionando..." : "Adicionar Atividade"}
      </Button>
    </div>
  );
}
