import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { NewActivityForm } from "./NewActivityForm";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fieldId: string;
};

type Field = {
  id: string;
  name: string;
  crop: string;
  area_ha: number;
  latitude: number;
  longitude: number;
};

type Activity = {
  id: string;
  type: string;
  date: string;
  notes?: string | null;
};

const activityTypeLabels: Record<string, string> = {
  ADUBACAO: "Adubação",
  PLANTIO: "Plantio",
  COLHEITA: "Colheita",
  OUTRO: "Outro",
};

function formatActivityType(type: string) {
  return activityTypeLabels[type.toUpperCase()] ?? type;
}

export function FieldDialog({ open, onOpenChange, fieldId }: Props) {
  const [field, setField] = useState<Field | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    if (!open) return;

    api.get<Field>(`/fields/${fieldId}`).then(setField).catch(console.error);
    api
      .get<Activity[]>(`/fields/${fieldId}/activities`)
      .then(setActivities)
      .catch(console.error);
  }, [open, fieldId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Talhão</DialogTitle>
        </DialogHeader>
        {!field ? (
          <p>Carregando...</p>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 space-y-1">
              <h1 className="text-xl font-bold">{field.name}</h1>
              <p>Cultura: {field.crop}</p>
              <p>Área: {field.area_ha} ha</p>
              <p>
                Localização: {field.latitude} / {field.longitude}
              </p>
            </Card>

            <div>
              <h2 className="text-lg font-semibold mb-2">Atividades</h2>
              {activities.length === 0 ? (
                <p className="text-muted-foreground">
                  Nenhuma atividade registrada.
                </p>
              ) : (
                <ul className="space-y-2">
                  {activities.map((act) => (
                    <li key={act.id} className="border rounded-md p-2">
                      <p className="font-medium">
                        {formatActivityType(act.type)} -{" "}
                        {new Date(act.date).toLocaleDateString("pt-BR")}
                      </p>
                      {act.notes && (
                        <p className="text-sm text-muted-foreground">
                          {act.notes}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {!showActivityForm ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowActivityForm(true)}
                >
                  Adicionar Atividade
                </Button>
              ) : (
                <div className="mt-4 space-y-4">
                  <NewActivityForm
                    fieldId={field.id}
                    onSuccess={() => {
                      api
                        .get<Activity[]>(`/fields/${field.id}/activities`)
                        .then(setActivities)
                        .catch(console.error);
                      setShowActivityForm(false);
                    }}
                  />
                  <Button
                    variant="ghost"
                    className="text-sm text-muted-foreground"
                    onClick={() => setShowActivityForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
