import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "./wiki.css";
import "./interactive.css";

export const metadata: Metadata = {
  title: {
    default: "IT_WIKI",
    template: "%s | IT_WIKI",
  },
  description: "Enciclopédia técnica aberta sobre infraestrutura, cloud, redes e sistemas distribuídos.",
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
              <Link href="/wiki/">Enciclopédia</Link>
              <Link href="/wiki/kubernetes/">Kubernetes</Link>
              <Link href="/wiki/redes/">Redes</Link>
              <Link href="/entrevistas/">Entrevistas</Link>
            </nav>
          </header>
          {children}
          <footer className="footer">IT_WIKI · enciclopédia técnica aberta e visual</footer>
        </div>
      </body>
    </html>
  );
}
