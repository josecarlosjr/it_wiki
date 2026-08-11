import type { Metadata } from "next";
import "./globals.css";
import "./wiki.css";
import "./interactive.css";
import "./expandable-cards.css";
import { LanguageProvider } from "@/components/language-provider";
import { SiteChrome } from "@/components/site-chrome";
import { KubernetesCardEnhancer } from "@/components/kubernetes-card-enhancer";
import { DockerLinuxCardEnhancer } from "@/components/docker-linux-card-enhancer";

export const metadata: Metadata = {
  title: {
    default: "IT_WIKI",
    template: "%s | IT_WIKI",
  },
  description: "Open technical encyclopedia about infrastructure, cloud, networking and distributed systems / Enciclopédia técnica aberta sobre infraestrutura, cloud, redes e sistemas distribuídos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <KubernetesCardEnhancer />
          <DockerLinuxCardEnhancer />
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
