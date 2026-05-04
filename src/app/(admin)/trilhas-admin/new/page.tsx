"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TrailForm } from "@/src/components/admin/TrailForm";
import { Button } from "@/src/components/ui/button";
import { registerTrail } from "@/src/actions/admin/trails";

export default function AddTrailPage() {
  const handleCreate = async (data: FormData) => {
    const response = await registerTrail(data);
    if (response.success) {
      alert("Trilha criada com sucesso!");
      // Aqui você pode redirecionar usando o router do Next
    } else {
      alert(response.message);
    }
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
          <h1 className="text-3xl font-bold">Nova Trilha</h1>
          <p className="text-muted-foreground">
            Preencha os dados da nova trilha
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
          <TrailForm onSubmit={handleCreate} />
        </CardContent>
      </Card>
    </div>
  );
}
