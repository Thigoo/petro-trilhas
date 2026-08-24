import { getAllEventosAdmin } from "@/src/api/events";
import EventosTable from "@/src/components/admin/events/EventsTable";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function EventosAdminPage() {
  const eventos = await getAllEventosAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-muted-foreground">
            Gerencie os eventos das trilhas e da comunidade
          </p>
        </div>

        <Button asChild>
          <Link href="/eventos-admin/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>

      <EventosTable eventos={eventos} />
    </div>
  );
}
