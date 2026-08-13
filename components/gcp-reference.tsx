'use client';

import { useState } from 'react';
import { gcpDiagram, type GcpDiagramKey } from '@/content/gcp-diagrams';
import { useLanguage } from './language-provider';
import { TopicDiagram } from './topic-diagram';

type Topic = {
  id: string;
  key: GcpDiagramKey;
  titlePt: string;
  titleEn: string;
  summaryPt: string;
  summaryEn: string;
  aws: string;
  comparePt: string;
  compareEn: string;
  pointsPt: string[];
  pointsEn: string[];
  example?: string;
};

const topics: Topic[] = [
  {
    id: 'gcp-iam', key: 'iam', titlePt: 'IAM, hierarquia e identidade', titleEn: 'IAM, hierarchy, and identity',
    summaryPt: 'Organization → Folder → Project → Resource define o escopo administrativo. IAM liga principals a roles nesse escopo.',
    summaryEn: 'Organization → Folder → Project → Resource defines administrative scope. IAM binds principals to roles at that scope.',
    aws: 'AWS Organizations + Accounts + IAM Roles/Policies',
    comparePt: 'No GCP, projects são uma unidade central de recursos, billing, APIs e quotas. IAM policies podem ser herdadas pela hierarquia. Em AWS, a separação arquitetural costuma ocorrer por accounts dentro de Organizations.',
    compareEn: 'In GCP, projects are a central unit for resources, billing, APIs, and quotas. IAM policies can inherit through the hierarchy. In AWS, architectural isolation commonly uses accounts inside Organizations.',
    pointsPt: ['Use predefined/custom roles com least privilege.', 'Evite service-account keys long-lived; prefira Workload Identity Federation.', 'Use Organization Policy para guardrails organizacionais.', 'Separe identidade humana de identidade de workload.'],
    pointsEn: ['Use predefined/custom roles with least privilege.', 'Avoid long-lived service-account keys; prefer Workload Identity Federation.', 'Use Organization Policy for organizational guardrails.', 'Separate human identity from workload identity.'],
    example: `gcloud projects get-iam-policy my-project\n\ngcloud projects add-iam-policy-binding my-project \\\n  --member="serviceAccount:api@my-project.iam.gserviceaccount.com" \\\n  --role="roles/storage.objectViewer"`,
  },
  {
    id: 'gcp-compute', key: 'compute', titlePt: 'Compute Engine e Managed Instance Groups', titleEn: 'Compute Engine and Managed Instance Groups',
    summaryPt: 'Compute Engine fornece VMs; MIGs adicionam instance templates, autoscaling, autohealing e distribuição por zonas.',
    summaryEn: 'Compute Engine provides VMs; MIGs add instance templates, autoscaling, autohealing, and zonal distribution.',
    aws: 'EC2 + Launch Templates + Auto Scaling Groups',
    comparePt: 'A comparação é direta: VM ↔ EC2 instance e MIG ↔ Auto Scaling Group. Em ambos os casos, templates imutáveis e health checks tornam substituição e scale-out previsíveis.',
    compareEn: 'The mapping is direct: VM ↔ EC2 instance and MIG ↔ Auto Scaling Group. In both, immutable templates and health checks make replacement and scale-out predictable.',
    pointsPt: ['Use regional MIG para distribuir VMs entre zonas.', 'Instance Templates devem ser versionados/imutáveis.', 'Autoscaling pode responder a CPU, load balancing ou métricas.', 'Preemptible/Spot VMs reduzem custo para workloads tolerantes a interrupção.'],
    pointsEn: ['Use regional MIGs to spread VMs across zones.', 'Instance Templates should be versioned/immutable.', 'Autoscaling can react to CPU, load balancing, or metrics.', 'Spot VMs reduce cost for interruption-tolerant workloads.'],
    example: `gcloud compute instance-groups managed set-autoscaling web-mig \\\n  --region=europe-west1 \\\n  --min-num-replicas=2 --max-num-replicas=10 \\\n  --target-cpu-utilization=0.65`,
  },
  {
    id: 'gcp-cloudrun', key: 'cloudrun', titlePt: 'Cloud Run', titleEn: 'Cloud Run',
    summaryPt: 'Plataforma serverless para executar containers sem administrar cluster, nodes ou control plane.',
    summaryEn: 'Serverless platform for running containers without managing a cluster, nodes, or control plane.',
    aws: 'Closest: App Runner / ECS Fargate; event/function cases may resemble Lambda',
    comparePt: 'Não existe equivalência 1:1. Cloud Run é orientado a serviço/revision e escala automaticamente containers HTTP/event-driven. App Runner é o paralelo mais simples; Fargate oferece mais controle de task/network; Lambda é function-centric.',
    compareEn: 'There is no exact 1:1 mapping. Cloud Run is service/revision oriented and automatically scales HTTP/event-driven containers. App Runner is the closest simple analogue; Fargate offers more task/network control; Lambda is function-centric.',
    pointsPt: ['Scale-to-zero reduz custo de serviços esporádicos.', 'Configure concurrency e min instances conforme latency budget.', 'Use service account dedicada por serviço.', 'Para acesso privado, combine VPC e mecanismos de egress/ingress adequados.'],
    pointsEn: ['Scale-to-zero reduces cost for sporadic services.', 'Configure concurrency and minimum instances according to the latency budget.', 'Use a dedicated service account per service.', 'For private access, combine VPC and appropriate ingress/egress mechanisms.'],
    example: `gcloud run deploy api \\\n  --image=europe-west1-docker.pkg.dev/my-project/apps/api:1.0 \\\n  --region=europe-west1 \\\n  --service-account=api@my-project.iam.gserviceaccount.com`,
  },
  {
    id: 'gcp-storage', key: 'storage', titlePt: 'Cloud Storage', titleEn: 'Cloud Storage',
    summaryPt: 'Object storage gerenciado baseado em buckets e objetos, com IAM, lifecycle, versioning e classes de armazenamento.',
    summaryEn: 'Managed object storage based on buckets and objects, with IAM, lifecycle, versioning, and storage classes.',
    aws: 'Amazon S3',
    comparePt: 'Cloud Storage e S3 compartilham o mesmo modelo fundamental: buckets + objetos + IAM/policies + lifecycle. Os nomes de classes, detalhes de políticas e integrações diferem.',
    compareEn: 'Cloud Storage and S3 share the same fundamental model: buckets + objects + IAM/policies + lifecycle. Storage-class names, policy details, and integrations differ.',
    pointsPt: ['Uniform bucket-level access simplifica autorização.', 'Versioning protege contra overwrite/delete acidental.', 'Lifecycle move/remove objetos conforme idade e regras.', 'Use signed URLs para acesso temporário quando necessário.'],
    pointsEn: ['Uniform bucket-level access simplifies authorization.', 'Versioning protects against accidental overwrite/delete.', 'Lifecycle moves/removes objects according to age and rules.', 'Use signed URLs for temporary access when appropriate.'],
    example: `gcloud storage buckets create gs://my-app-data --location=europe-west1\ngcloud storage cp backup.tar.gz gs://my-app-data/backups/`,
  },
  {
    id: 'gcp-cloudsql', key: 'cloudsql', titlePt: 'Cloud SQL', titleEn: 'Cloud SQL',
    summaryPt: 'Banco relacional gerenciado para PostgreSQL, MySQL e SQL Server, com backups, HA, replicação e manutenção gerenciada.',
    summaryEn: 'Managed relational database for PostgreSQL, MySQL, and SQL Server, with backups, HA, replication, and managed maintenance.',
    aws: 'Amazon RDS',
    comparePt: 'Cloud SQL ↔ RDS é uma comparação direta. HA/Multi-AZ melhora disponibilidade; read replicas escalam leitura e não são sinônimo de failover HA.',
    compareEn: 'Cloud SQL ↔ RDS is a direct comparison. HA/Multi-AZ improves availability; read replicas scale reads and are not the same thing as HA failover.',
    pointsPt: ['Prefira private IP para workloads internos.', 'Use Cloud SQL Auth Proxy/Connectors quando fizer sentido operacional.', 'HA mantém standby em outra zona.', 'Backups e PITR continuam necessários mesmo com HA.'],
    pointsEn: ['Prefer private IP for internal workloads.', 'Use Cloud SQL Auth Proxy/Connectors where operationally appropriate.', 'HA maintains a standby in another zone.', 'Backups and PITR are still required even with HA.'],
  },
  {
    id: 'gcp-gke', key: 'gke', titlePt: 'Google Kubernetes Engine (GKE)', titleEn: 'Google Kubernetes Engine (GKE)',
    summaryPt: 'Kubernetes gerenciado com control plane operado pelo Google, node pools ou Autopilot e integrações nativas de rede/identidade.',
    summaryEn: 'Managed Kubernetes with a Google-operated control plane, node pools or Autopilot, and native networking/identity integrations.',
    aws: 'Amazon EKS',
    comparePt: 'GKE ↔ EKS é a comparação natural. GKE oferece Standard e Autopilot; EKS normalmente usa managed node groups/Fargate. Em ambos, identidade por workload é preferível a permissões herdadas do node.',
    compareEn: 'GKE ↔ EKS is the natural comparison. GKE offers Standard and Autopilot; EKS commonly uses managed node groups/Fargate. In both, workload-level identity is preferable to permissions inherited from the node.',
    pointsPt: ['Autopilot reduz gestão do node plane.', 'Workload Identity Federation evita chaves estáticas.', 'Private clusters reduzem exposição do control plane/nodes.', 'Use NetworkPolicy e políticas de admission conforme o modelo de segurança.'],
    pointsEn: ['Autopilot reduces node-plane management.', 'Workload Identity Federation avoids static keys.', 'Private clusters reduce control-plane/node exposure.', 'Use NetworkPolicy and admission policies according to the security model.'],
    example: `gcloud container clusters create-auto app-cluster \\\n  --region=europe-west1\n\ngcloud container clusters get-credentials app-cluster --region=europe-west1`,
  },
  {
    id: 'gcp-pubsub', key: 'pubsub', titlePt: 'Pub/Sub', titleEn: 'Pub/Sub',
    summaryPt: 'Mensageria assíncrona baseada em topics e subscriptions, adequada a fan-out, eventos e desacoplamento.',
    summaryEn: 'Asynchronous messaging based on topics and subscriptions, suited to fan-out, events, and decoupling.',
    aws: 'Usually SNS + SQS; sometimes EventBridge depending on event-routing needs',
    comparePt: 'Pub/Sub combina topic e subscriptions independentes. Na AWS, o padrão mais semelhante frequentemente usa SNS para fan-out e uma SQS por consumidor para isolamento de backlog/retry.',
    compareEn: 'Pub/Sub combines a topic with independent subscriptions. In AWS, the closest common pattern often uses SNS for fan-out and one SQS queue per consumer for isolated backlog/retry behavior.',
    pointsPt: ['Cada subscription mantém seu próprio backlog.', 'Ack deadline e retry policy influenciam redelivery.', 'Dead-letter topics isolam mensagens problemáticas.', 'Consumidores devem ser idempotentes quando redelivery é possível.'],
    pointsEn: ['Each subscription maintains its own backlog.', 'Ack deadline and retry policy affect redelivery.', 'Dead-letter topics isolate problematic messages.', 'Consumers should be idempotent when redelivery is possible.'],
  },
  {
    id: 'gcp-vpc', key: 'vpc', titlePt: 'VPC, subnets, firewall e Shared VPC', titleEn: 'VPC, subnets, firewall, and Shared VPC',
    summaryPt: 'No GCP, a VPC é global e as subnets são regionais. Rotas, firewall e Shared VPC formam a base de networking em escala.',
    summaryEn: 'In GCP, the VPC is global and subnets are regional. Routes, firewall, and Shared VPC form the networking foundation at scale.',
    aws: 'Amazon VPC + Security Groups/NACLs + Shared VPC patterns via multi-account networking',
    comparePt: 'A principal diferença mental é escopo: AWS VPC é regional; GCP VPC é global. No GCP, uma subnet regional pode servir VMs em múltiplas zones daquela região.',
    compareEn: 'The key mental-model difference is scope: an AWS VPC is regional; a GCP VPC is global. In GCP, a regional subnet can serve VMs across multiple zones in that region.',
    pointsPt: ['Firewall rules são stateful e associadas à VPC/políticas.', 'Private Google Access permite acesso a APIs Google sem IP externo em cenários suportados.', 'Cloud NAT fornece egress para recursos privados.', 'Shared VPC centraliza rede em host project e delega service projects.'],
    pointsEn: ['Firewall rules are stateful and associated with VPC/policies.', 'Private Google Access enables access to Google APIs without external IPs in supported scenarios.', 'Cloud NAT provides egress for private resources.', 'Shared VPC centralizes networking in a host project and delegates service projects.'],
  },
  {
    id: 'gcp-loadbalancing', key: 'loadbalancing', titlePt: 'Cloud Load Balancing', titleEn: 'Cloud Load Balancing',
    summaryPt: 'Portfólio de load balancers globais e regionais para HTTP(S), proxy e passthrough, integrado a health checks e backends.',
    summaryEn: 'Portfolio of global and regional load balancers for HTTP(S), proxy, and passthrough traffic, integrated with health checks and backends.',
    aws: 'ALB / NLB + Route 53/Global Accelerator depending on scope',
    comparePt: 'O Application Load Balancer global do GCP pode usar IP anycast global e backends multi-region. Na AWS, ALB é regional; arquiteturas globais normalmente adicionam Route 53, CloudFront ou Global Accelerator.',
    compareEn: 'GCP global Application Load Balancing can use a global anycast IP and multi-region backends. In AWS, ALB is regional; global architectures commonly add Route 53, CloudFront, or Global Accelerator.',
    pointsPt: ['Escolha global versus regional conforme failover e data locality.', 'Health checks retiram backends não saudáveis.', 'Cloud Armor adiciona proteção WAF/DDoS em arquiteturas compatíveis.', 'Backend services definem distribuição e políticas de tráfego.'],
    pointsEn: ['Choose global versus regional according to failover and data locality.', 'Health checks remove unhealthy backends.', 'Cloud Armor adds WAF/DDoS protection in compatible architectures.', 'Backend services define distribution and traffic policies.'],
  },
  {
    id: 'gcp-hybrid', key: 'hybrid', titlePt: 'Hybrid Connectivity: Cloud VPN e Interconnect', titleEn: 'Hybrid Connectivity: Cloud VPN and Interconnect',
    summaryPt: 'Cloud VPN usa IPsec sobre Internet; Cloud Interconnect fornece conectividade dedicada. Cloud Router/BGP distribui rotas dinamicamente.',
    summaryEn: 'Cloud VPN uses IPsec over the Internet; Cloud Interconnect provides dedicated connectivity. Cloud Router/BGP distributes routes dynamically.',
    aws: 'Site-to-Site VPN + Direct Connect + Transit Gateway/BGP patterns',
    comparePt: 'Cloud VPN ↔ AWS Site-to-Site VPN e Interconnect ↔ Direct Connect. Cloud Router fornece troca dinâmica de rotas; em AWS, VGW/TGW/DX Gateway cumprem partes equivalentes conforme a topologia.',
    compareEn: 'Cloud VPN ↔ AWS Site-to-Site VPN and Interconnect ↔ Direct Connect. Cloud Router provides dynamic route exchange; in AWS, VGW/TGW/DX Gateway cover equivalent responsibilities depending on topology.',
    pointsPt: ['HA VPN usa interfaces/túneis redundantes.', 'BGP simplifica propagação de prefixos e failover.', 'Interconnect é adequado quando capacidade/previsibilidade justificam circuito dedicado.', 'Valide sempre rotas de ida/retorno e CIDRs sobrepostos.'],
    pointsEn: ['HA VPN uses redundant interfaces/tunnels.', 'BGP simplifies prefix propagation and failover.', 'Interconnect fits cases where capacity/predictability justify dedicated connectivity.', 'Always validate forward/return routes and overlapping CIDRs.'],
  },
];

const comparisonRows = [
  ['Organization / Folder / Project', 'Organizations / OUs / Accounts', 'Governance hierarchy'],
  ['IAM / Service Account', 'IAM / IAM Role', 'Identity and authorization'],
  ['Compute Engine / MIG', 'EC2 / Auto Scaling Group', 'Virtual machines and autoscaling'],
  ['Cloud Run', 'App Runner / ECS Fargate / Lambda*', 'Managed/serverless application runtime'],
  ['Cloud Storage', 'S3', 'Object storage'],
  ['Cloud SQL', 'RDS', 'Managed relational database'],
  ['GKE', 'EKS', 'Managed Kubernetes'],
  ['Pub/Sub', 'SNS + SQS / EventBridge*', 'Asynchronous messaging/events'],
  ['Global VPC', 'Regional VPC', 'Virtual networking scope differs'],
  ['Cloud VPN / Interconnect', 'Site-to-Site VPN / Direct Connect', 'Hybrid connectivity'],
];

export function GcpReference() {
  const { locale, t } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="article-section" id="gcp-reference">
      <h2>{t('Google Cloud em produção — conceitos principais e comparação com AWS', 'Google Cloud in production — core concepts and AWS comparison')}</h2>
      <p className="section-summary">{t('Use a comparação como mapa mental, não como equivalência absoluta. Serviços com nomes semelhantes podem ter escopo, networking, identidade e modelo operacional diferentes.', 'Use the comparison as a mental map, not as an absolute equivalence. Similarly named services can differ in scope, networking, identity, and operational model.')}</p>

      <div className="gcp-comparison-table table-wrap">
        <table className="reference-table">
          <thead><tr><th>Google Cloud</th><th>AWS</th><th>{t('Função principal', 'Primary role')}</th></tr></thead>
          <tbody>{comparisonRows.map(([gcp, aws, role]) => <tr key={gcp}><td><strong>{gcp}</strong></td><td>{aws}</td><td>{role}</td></tr>)}</tbody>
        </table>
      </div>

      <div className="gcp-topic-grid">
        {topics.map((topic) => {
          const isExpanded = expanded === topic.id;
          return (
            <section
              key={topic.id}
              id={topic.id}
              className={`gcp-topic-card${isExpanded ? ' is-expanded' : ''}`}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onClick={(event) => {
                const target = event.target as HTMLElement;
                if (target.closest('a, button, pre, code, table')) return;
                setExpanded(isExpanded ? null : topic.id);
              }}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                setExpanded(isExpanded ? null : topic.id);
              }}
            >
              <h3 className="gcp-topic-card-title">
                {locale === 'en' ? topic.titleEn : topic.titlePt}
                <span className="gcp-topic-card-hint" aria-hidden="true">{isExpanded ? '−' : '+'}</span>
              </h3>
              <div className="gcp-topic-card-body">
                <p>{locale === 'en' ? topic.summaryEn : topic.summaryPt}</p>
                <div className="gcp-aws-comparison">
                  <strong>AWS:</strong> {topic.aws}
                  <p>{locale === 'en' ? topic.compareEn : topic.comparePt}</p>
                </div>
                <ul className="reference-list">{(locale === 'en' ? topic.pointsEn : topic.pointsPt).map((point) => <li key={point}>{point}</li>)}</ul>
                {topic.example ? <pre className="reference-code"><code>{topic.example}</code></pre> : null}
                <TopicDiagram spec={gcpDiagram(topic.key, locale)} />
              </div>
            </section>
          );
        })}
      </div>

      <p className="technical-source-note">{t('Baseado na documentação oficial do Google Cloud para IAM, Compute Engine, Cloud Run, Cloud Storage, Cloud SQL, GKE, Pub/Sub, VPC, Cloud Load Balancing, Cloud VPN e Cloud Interconnect.', 'Based on official Google Cloud documentation for IAM, Compute Engine, Cloud Run, Cloud Storage, Cloud SQL, GKE, Pub/Sub, VPC, Cloud Load Balancing, Cloud VPN, and Cloud Interconnect.')}</p>
    </section>
  );
}
