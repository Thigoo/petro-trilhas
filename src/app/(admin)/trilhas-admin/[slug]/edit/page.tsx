import { updateTrail } from "@/src/actions/admin/trails";
import { TrailForm } from "@/src/components/admin/TrailForm";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { getTrailBySlug } from "@/src/lib/trails";
import { mapTrailToFormState } from "@/src/utils/formatter";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UpdateTrailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trail = await getTrailBySlug(slug);

  if (!trail) {
    notFound();
  }

  const formInitialData = mapTrailToFormState(trail);

  const handleUpdate = async (data: FormData) => {
    "use server";
    console.log("clicou no update");
    const response = await updateTrail(trail.id, data);
    console.log("response", response);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/trilhas-admin">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Trilha</h1>
          <p className="text-muted-foreground">
            Edite os dados de: {trail.nome}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Trilha</CardTitle>
          <CardDescription>
            Os campos marcados com * são obrigatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TrailForm
            initialData={formInitialData}
            onSubmit={handleUpdate}
            isEdit
          />
        </CardContent>
      </Card>
    </div>
  );
}
