"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";

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

export default function FieldDetailPage() {
  const params = useParams<{ id: string }>();
  const [field, setField] = useState<Field | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!params?.id) return;
    api.get<Field>(`/fields/${params.id}`).then(setField).catch(console.error);
    api
      .get<Activity[]>(`/fields/${params.id}/activities`)
      .then(setActivities)
      .catch(console.error);
  }, [params?.id]);

  if (!field) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <Card className="p-4 space-y-1">
        <h1 className="text-2xl font-bold">{field.name}</h1>
        <p>Cultura: {field.crop}</p>
        <p>Área: {Number(field.area_ha)} ha</p>
        <p>
          Localização: {Number(field.latitude)} / {Number(field.longitude)}
        </p>
      </Card>
      <div>
        <h2 className="text-xl font-semibold mb-2">Atividades</h2>
        {activities.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma atividade registrada.</p>
        ) : (
          <ul className="space-y-2">
            {activities.map((act) => (
              <li key={act.id} className="border rounded-md p-2">
                <p className="font-medium">
                  {act.type} - {new Date(act.date).toLocaleDateString()}
                </p>
                {act.notes && (
                  <p className="text-sm text-muted-foreground">{act.notes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
