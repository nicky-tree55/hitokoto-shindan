import { Header } from "./components/header";
import DiagnosisFlow from "./diagnosis-flow";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col overflow-x-hidden bg-background pb-[env(safe-area-inset-bottom)] text-foreground">
      <Header />
      <DiagnosisFlow />
    </main>
  );
}
