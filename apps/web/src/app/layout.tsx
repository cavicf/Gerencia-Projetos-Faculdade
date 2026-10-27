import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";

// Guia de Design: Sora para títulos e números, Manrope para textos, botões, formulários e tabelas.
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AcadFlow – Gerenciador de Atividades Acadêmicas",
  description: "Organize provas, trabalhos e tarefas de todas as suas disciplinas em um só lugar.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
