import DiagnosisForm from "./diagnosis-form";

export default function Home() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <h1 className="sr-only">One Line Diagnosis</h1>
      <DiagnosisForm />
    </main>
  );
}
