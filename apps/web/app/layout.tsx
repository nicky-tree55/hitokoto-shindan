import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "hitokoto-shindan",
  description: "One Line Diagnosis",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
