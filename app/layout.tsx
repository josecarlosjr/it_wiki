import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IT_WIKI",
    template: "%s | IT_WIKI",
  },
  description: "Aprenda infraestrutura, cloud e sistemas distribuídos com diagramas interativos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="shell">
          <header className="header">
            <Link className="brand" href="/">
              <span className="brand-mark">IT</span>
              <span>IT_WIKI</span>
            </Link>
            <nav className="nav" aria-label="Navegação principal">
              <Link href="/trilhas/">Trilhas</Link>
              <Link href="/aprender/kubernetes-service/">Aulas</Link>
              <Link href="/entrevistas/">Entrevistas</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">IT_WIKI · conhecimento técnico explicado visualmente</footer>
        </div>
      </body>
    </html>
  );
}
