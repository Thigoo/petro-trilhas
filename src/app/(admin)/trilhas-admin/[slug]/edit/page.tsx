import TrailEditForm from "@/src/components/admin/TrailEditForm";
import { Button } from "@/src/components/ui/button";
import { getTrailBySlug } from "@/src/lib/trails";
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

  if (!trail) notFound();

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
          <p className="text-muted-foreground">Editando: {trail.nome}</p>
        </div>
      </div>

      <TrailEditForm initialData={trail} />
    </div>
  );
}
