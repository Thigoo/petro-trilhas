import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-medium">Petro Trilhas 🌿</h1>
      <Button className="bg-amber-600">Explorar trilhas</Button>
      <Button variant="outline">Fazer login</Button>
      <Button variant="ghost">Ver mapa</Button>
    </main>
  );
}
