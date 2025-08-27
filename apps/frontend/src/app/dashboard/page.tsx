"use client";

import { useEffect, useState } from "react";

import { CreateFieldDialog } from "../fields/CreateFieldDialog";
import { FieldDialog } from "../fields/FieldDialog";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

type Field = {
  id: string;
  name: string;
  crop: string;
  area_ha: number;
};

export default function DashboardPage() {
  const { logout } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    api
      .get<Field[]>("/fields")
      .then(setFields)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Seus Talhões</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            Novo Talhão
          </Button>
          <Button variant="destructive" onClick={logout}>
            Sair
          </Button>
          <CreateFieldDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            onSuccess={() => {
              setCreateOpen(false);
              api.get<Field[]>("/fields").then(setFields);
            }}
          />
        </div>
      </div>

      {fields.length === 0 ? (
        <p className="text-muted-foreground">Nenhum talhão cadastrado.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cultura</TableHead>
              <TableHead>Área (ha)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell>{field.name}</TableCell>
                <TableCell>{field.crop}</TableCell>
                <TableCell>{field.area_ha}</TableCell>
                <TableCell className="text-right">
                  {/* <Link href={`/fields/${field.id}`}>
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </Link> */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedFieldId(field.id);
                      setDialogOpen(true);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedFieldId && (
        <FieldDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          fieldId={selectedFieldId}
        />
      )}
    </div>
  );
}
