import type { Metadata } from "next";
import "./globals.css";
import "./wiki.css";
import "./interactive.css";
import "./expandable-cards.css";
import "./vmware-observability-cards.css";
import "./gcp-cards.css";
import "./api-guide.css";
import "./istio-cards.css";
import "./terragrunt-card.css";
import "./theme.css";
import { LanguageProvider } from "@/components/language-provider";
import { SiteChrome } from "@/components/site-chrome";
import { KubernetesCardEnhancer } from "@/components/kubernetes-card-enhancer";
import { DockerLinuxCardEnhancer } from "@/components/docker-linux-card-enhancer";
import { DistributedDataCardEnhancer } from "@/components/distributed-data-card-enhancer";
import { NetworkSecurityCardEnhancer } from "@/components/network-security-card-enhancer";
import { VmwareObservabilityCardEnhancer } from "@/components/vmware-observability-card-enhancer";

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
          <DistributedDataCardEnhancer />
          <NetworkSecurityCardEnhancer />
          <VmwareObservabilityCardEnhancer />
          <SiteChrome>{children}</SiteChrome>
        </LanguageProvider>
      </body>
    </html>
  );
}
