export type Topic = {
  slug: string;
  title: string;
  description: string;
  level: "Iniciante" | "Intermediário" | "Avançado";
  lessons: number;
  status: "Disponível" | "Planejado";
};

export const topics: Topic[] = [
  {
    slug: "kubernetes",
    title: "Kubernetes",
    description: "Workloads, rede, armazenamento, segurança, scheduling e troubleshooting.",
    level: "Iniciante",
    lessons: 15,
    status: "Disponível",
  },
  {
    slug: "linux",
    title: "Linux",
    description: "Processos, memória, filesystem, systemd, logs e diagnóstico.",
    level: "Iniciante",
    lessons: 10,
    status: "Planejado",
  },
  {
    slug: "redes",
    title: "Redes",
    description: "TCP/IP, DNS, HTTP, TLS, routing, NAT e load balancing.",
    level: "Iniciante",
    lessons: 10,
    status: "Planejado",
  },
  {
    slug: "aws",
    title: "AWS",
    description: "Arquiteturas resilientes, segurança, rede, computação e dados.",
    level: "Intermediário",
    lessons: 20,
    status: "Planejado",
  },
  {
    slug: "terraform",
    title: "Terraform",
    description: "State, providers, modules, workflows e infraestrutura escalável.",
    level: "Intermediário",
    lessons: 12,
    status: "Planejado",
  },
  {
    slug: "sistemas-distribuidos",
    title: "Sistemas distribuídos",
    description: "Consistência, consenso, particionamento, replicação, Kafka e Redis.",
    level: "Avançado",
    lessons: 18,
    status: "Planejado",
  },
];
