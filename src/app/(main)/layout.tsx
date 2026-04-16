import Header from "@/src/components/shared/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* O Header fica aqui para aparecer em todas as rotas deste grupo */}
      {/* <Header /> */}

      <main className="flex-1">{children}</main>
    </div>
  );
}
