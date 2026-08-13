import type { DiagramSpec } from './diagrams';

export type GcpDiagramKey = 'iam' | 'compute' | 'cloudrun' | 'storage' | 'cloudsql' | 'gke' | 'pubsub' | 'vpc' | 'loadbalancing' | 'hybrid';

type Locale = 'pt' | 'en';

const sources = {
  iam: [{ label: 'Google Cloud IAM', url: 'https://cloud.google.com/iam/docs/overview' }],
  compute: [{ label: 'Compute Engine', url: 'https://cloud.google.com/compute/docs/overview' }],
  cloudrun: [{ label: 'Cloud Run', url: 'https://cloud.google.com/run/docs/overview/what-is-cloud-run' }],
  storage: [{ label: 'Cloud Storage', url: 'https://cloud.google.com/storage/docs/introduction' }],
  cloudsql: [{ label: 'Cloud SQL', url: 'https://cloud.google.com/sql/docs/introduction' }],
  gke: [{ label: 'Google Kubernetes Engine', url: 'https://cloud.google.com/kubernetes-engine/docs/concepts/kubernetes-engine-overview' }],
  pubsub: [{ label: 'Pub/Sub', url: 'https://cloud.google.com/pubsub/docs/overview' }],
  vpc: [{ label: 'VPC networks', url: 'https://cloud.google.com/vpc/docs/vpc' }],
  loadbalancing: [{ label: 'Cloud Load Balancing', url: 'https://cloud.google.com/load-balancing/docs/load-balancing-overview' }],
  hybrid: [{ label: 'Cloud VPN', url: 'https://cloud.google.com/network-connectivity/docs/vpn/concepts/overview' }, { label: 'Cloud Interconnect', url: 'https://cloud.google.com/network-connectivity/docs/interconnect/concepts/overview' }],
};

export function gcpDiagram(key: GcpDiagramKey, locale: Locale): DiagramSpec {
  const en = locale === 'en';
  const diagrams: Record<GcpDiagramKey, DiagramSpec> = {
    iam: {
      title: en ? 'GCP IAM: principal → role binding → resource' : 'GCP IAM: principal → role binding → recurso',
      description: en ? 'IAM grants roles to principals at organization, folder, project, or resource scope. Prefer workload identity and short-lived credentials instead of service-account keys.' : 'IAM concede roles a principals no escopo de organization, folder, project ou recurso. Prefira workload identity e credenciais temporárias em vez de chaves de service account.',
      width: 1080, height: 360,
      nodes: [
        { id: 'p', label: en ? 'Principal\nUser · Group · Workload' : 'Principal\nUser · Group · Workload', x: 25, y: 130, width: 190, kind: 'client' },
        { id: 'iam', label: 'IAM Policy\nRole Binding', x: 280, y: 130, width: 180, kind: 'security' },
        { id: 'scope', label: en ? 'Scope\nOrg → Folder → Project' : 'Escopo\nOrg → Folder → Project', x: 525, y: 130, width: 210, kind: 'control' },
        { id: 'r', label: en ? 'Resource\nGCS · GKE · Cloud SQL' : 'Recurso\nGCS · GKE · Cloud SQL', x: 800, y: 130, width: 210, kind: 'data' },
      ],
      edges: [
        { from: 'p', to: 'iam', label: en ? 'is granted role' : 'recebe role' },
        { from: 'iam', to: 'scope', label: en ? 'at scope' : 'no escopo' },
        { from: 'scope', to: 'r', label: en ? 'authorizes actions' : 'autoriza ações' },
      ], sources: sources.iam,
    },
    compute: {
      title: en ? 'Compute Engine and Managed Instance Groups' : 'Compute Engine e Managed Instance Groups',
      description: en ? 'Compute Engine provides VMs. Managed Instance Groups add templates, autoscaling, autohealing, and regional distribution.' : 'Compute Engine fornece VMs. Managed Instance Groups adicionam templates, autoscaling, autohealing e distribuição regional.',
      width: 1080, height: 390,
      nodes: [
        { id: 'lb', label: en ? 'Load Balancer' : 'Load Balancer', x: 25, y: 145, width: 160, kind: 'network' },
        { id: 'mig', label: 'Managed Instance Group', x: 250, y: 145, width: 190, kind: 'control' },
        { id: 'a', label: 'VM A\nZone A', x: 520, y: 70, width: 150, kind: 'workload' },
        { id: 'b', label: 'VM B\nZone B', x: 520, y: 220, width: 150, kind: 'workload' },
        { id: 'tmpl', label: 'Instance Template', x: 760, y: 145, width: 170, kind: 'data' },
      ],
      edges: [
        { from: 'lb', to: 'mig', label: en ? 'traffic' : 'tráfego' },
        { from: 'mig', to: 'a', label: en ? 'places/heals' : 'cria/recupera' },
        { from: 'mig', to: 'b', label: en ? 'places/heals' : 'cria/recupera' },
        { from: 'tmpl', to: 'mig', label: en ? 'desired VM config' : 'configuração desejada' },
      ], sources: sources.compute,
    },
    cloudrun: {
      title: en ? 'Cloud Run: request-driven serverless containers' : 'Cloud Run: containers serverless orientados a requests',
      description: en ? 'Cloud Run runs containers without managing a cluster. Revisions scale horizontally, including scale-to-zero when configured.' : 'Cloud Run executa containers sem administrar cluster. Revisions escalam horizontalmente, inclusive até zero quando configurado.',
      width: 1080, height: 380,
      nodes: [
        { id: 'client', label: 'HTTPS Client', x: 25, y: 135, width: 160, kind: 'client' },
        { id: 'svc', label: 'Cloud Run Service', x: 250, y: 135, width: 180, kind: 'control' },
        { id: 'rev', label: 'Revision', x: 500, y: 135, width: 150, kind: 'workload' },
        { id: 'i1', label: 'Container\nInstance 1', x: 740, y: 60, width: 150, kind: 'workload' },
        { id: 'i2', label: 'Container\nInstance N', x: 740, y: 220, width: 150, kind: 'workload' },
      ],
      edges: [
        { from: 'client', to: 'svc', label: 'HTTPS' },
        { from: 'svc', to: 'rev', label: en ? 'routes to revision' : 'roteia para revision' },
        { from: 'rev', to: 'i1', label: en ? 'autoscale' : 'autoscaling' },
        { from: 'rev', to: 'i2', label: en ? 'autoscale' : 'autoscaling' },
      ], sources: sources.cloudrun,
    },
    storage: {
      title: en ? 'Cloud Storage: project → bucket → objects' : 'Cloud Storage: project → bucket → objetos',
      description: en ? 'Cloud Storage is managed object storage. IAM controls access; lifecycle and storage-class policies control retention and cost.' : 'Cloud Storage é armazenamento de objetos gerenciado. IAM controla acesso; lifecycle e storage classes controlam retenção e custo.',
      width: 1080, height: 360,
      nodes: [
        { id: 'app', label: en ? 'Application / Workload' : 'Aplicação / Workload', x: 25, y: 130, width: 180, kind: 'client' },
        { id: 'iam', label: 'IAM / Workload Identity', x: 265, y: 130, width: 190, kind: 'security' },
        { id: 'bucket', label: 'Cloud Storage\nBucket', x: 525, y: 130, width: 180, kind: 'data' },
        { id: 'obj', label: en ? 'Objects\nStandard · Nearline · Coldline' : 'Objetos\nStandard · Nearline · Coldline', x: 775, y: 130, width: 230, kind: 'data' },
      ], edges: [
        { from: 'app', to: 'iam', label: en ? 'identity' : 'identidade' },
        { from: 'iam', to: 'bucket', label: en ? 'authorized API call' : 'chamada autorizada' },
        { from: 'bucket', to: 'obj', label: en ? 'stores' : 'armazena' },
      ], sources: sources.storage,
    },
    cloudsql: {
      title: en ? 'Cloud SQL HA: primary + standby across zones' : 'Cloud SQL HA: primary + standby entre zonas',
      description: en ? 'Cloud SQL manages relational databases. HA adds a standby in another zone; read replicas are a separate scaling mechanism.' : 'Cloud SQL gerencia bancos relacionais. HA adiciona standby em outra zona; read replicas são um mecanismo separado para escalar leituras.',
      width: 1080, height: 390,
      nodes: [
        { id: 'app', label: en ? 'Application' : 'Aplicação', x: 25, y: 145, width: 150, kind: 'client' },
        { id: 'ip', label: 'Private IP /\nCloud SQL Connector', x: 230, y: 145, width: 190, kind: 'network' },
        { id: 'pri', label: 'Primary\nZone A', x: 500, y: 75, width: 160, kind: 'data' },
        { id: 'std', label: 'Standby\nZone B', x: 500, y: 225, width: 160, kind: 'data' },
        { id: 'rep', label: 'Read Replica', x: 760, y: 145, width: 160, kind: 'data' },
      ], edges: [
        { from: 'app', to: 'ip', label: en ? 'DB connection' : 'conexão DB' },
        { from: 'ip', to: 'pri', label: en ? 'read/write' : 'read/write' },
        { from: 'pri', to: 'std', label: en ? 'HA replication' : 'replicação HA' },
        { from: 'pri', to: 'rep', label: en ? 'read scaling' : 'escala leitura' },
      ], sources: sources.cloudsql,
    },
    gke: {
      title: en ? 'GKE: managed control plane and workload identity' : 'GKE: control plane gerenciado e identidade de workload',
      description: en ? 'GKE manages Kubernetes control-plane components. Workloads run on node pools or Autopilot and should access Google APIs through Workload Identity Federation for GKE.' : 'GKE gerencia componentes do control plane. Workloads executam em node pools ou Autopilot e devem acessar APIs Google via Workload Identity Federation for GKE.',
      width: 1080, height: 400,
      nodes: [
        { id: 'cp', label: 'GKE Control Plane', x: 25, y: 145, width: 180, kind: 'control' },
        { id: 'np', label: en ? 'Node Pool / Autopilot' : 'Node Pool / Autopilot', x: 270, y: 145, width: 190, kind: 'workload' },
        { id: 'pod', label: 'Pod\nKSA', x: 525, y: 145, width: 150, kind: 'workload' },
        { id: 'wi', label: 'Workload Identity\nFederation', x: 740, y: 145, width: 190, kind: 'security' },
        { id: 'api', label: 'Google Cloud API', x: 995, y: 145, width: 150, kind: 'data' },
      ], edges: [
        { from: 'cp', to: 'np', label: en ? 'orchestrates' : 'orquestra' },
        { from: 'np', to: 'pod', label: en ? 'runs' : 'executa' },
        { from: 'pod', to: 'wi', label: en ? 'federated identity' : 'identidade federada' },
        { from: 'wi', to: 'api', label: en ? 'short-lived access' : 'acesso temporário' },
      ], sources: sources.gke,
    },
    pubsub: {
      title: en ? 'Pub/Sub: publisher → topic → subscriptions → consumers' : 'Pub/Sub: publisher → topic → subscriptions → consumers',
      description: en ? 'A topic fans out messages to subscriptions. Each subscription has its own delivery state, retry behavior, and backlog.' : 'Um topic distribui mensagens para subscriptions. Cada subscription mantém seu próprio estado de entrega, retries e backlog.',
      width: 1080, height: 400,
      nodes: [
        { id: 'pub', label: 'Publisher', x: 25, y: 145, width: 150, kind: 'client' },
        { id: 'topic', label: 'Pub/Sub Topic', x: 245, y: 145, width: 170, kind: 'network' },
        { id: 's1', label: 'Subscription A', x: 500, y: 65, width: 170, kind: 'data' },
        { id: 's2', label: 'Subscription B', x: 500, y: 230, width: 170, kind: 'data' },
        { id: 'c1', label: 'Consumer A', x: 770, y: 65, width: 160, kind: 'workload' },
        { id: 'c2', label: 'Consumer B', x: 770, y: 230, width: 160, kind: 'workload' },
      ], edges: [
        { from: 'pub', to: 'topic', label: en ? 'publish' : 'publica' },
        { from: 'topic', to: 's1', label: 'fan-out' },
        { from: 'topic', to: 's2', label: 'fan-out' },
        { from: 's1', to: 'c1', label: en ? 'deliver/ack' : 'entrega/ack' },
        { from: 's2', to: 'c2', label: en ? 'deliver/ack' : 'entrega/ack' },
      ], sources: sources.pubsub,
    },
    vpc: {
      title: en ? 'GCP VPC: global network, regional subnets' : 'GCP VPC: rede global, subnets regionais',
      description: en ? 'A GCP VPC is a global resource. Subnets are regional and can span multiple zones within that region. Routes and firewall policies define connectivity.' : 'A VPC do GCP é um recurso global. Subnets são regionais e abrangem múltiplas zonas da região. Rotas e políticas de firewall definem conectividade.',
      width: 1080, height: 420,
      nodes: [
        { id: 'vpc', label: 'Global VPC', x: 25, y: 155, width: 170, kind: 'network' },
        { id: 's1', label: 'Subnet\nRegion europe-west1', x: 260, y: 70, width: 200, kind: 'network' },
        { id: 's2', label: 'Subnet\nRegion us-central1', x: 260, y: 245, width: 200, kind: 'network' },
        { id: 'a', label: 'VM / GKE\nZone A/B/C', x: 550, y: 70, width: 170, kind: 'workload' },
        { id: 'b', label: 'VM / GKE\nZone A/B/C', x: 550, y: 245, width: 170, kind: 'workload' },
        { id: 'fw', label: en ? 'Routes + Firewall' : 'Rotas + Firewall', x: 800, y: 155, width: 180, kind: 'security' },
      ], edges: [
        { from: 'vpc', to: 's1' }, { from: 'vpc', to: 's2' },
        { from: 's1', to: 'a' }, { from: 's2', to: 'b' },
        { from: 'a', to: 'fw', label: en ? 'policy/routing' : 'política/rotas' },
        { from: 'b', to: 'fw', label: en ? 'policy/routing' : 'política/rotas' },
      ], sources: sources.vpc,
    },
    loadbalancing: {
      title: en ? 'Cloud Load Balancing: global edge to regional backends' : 'Cloud Load Balancing: edge global para backends regionais',
      description: en ? 'Google Cloud offers global and regional load balancers. Global application load balancing can terminate at Google’s edge and route to healthy backends in multiple regions.' : 'Google Cloud oferece load balancers globais e regionais. O load balancing global de aplicação pode terminar no edge do Google e rotear para backends saudáveis em múltiplas regiões.',
      width: 1080, height: 390,
      nodes: [
        { id: 'u', label: 'Users', x: 25, y: 145, width: 140, kind: 'client' },
        { id: 'vip', label: en ? 'Global Anycast IP\nApplication LB' : 'IP Anycast Global\nApplication LB', x: 225, y: 145, width: 190, kind: 'network' },
        { id: 'b1', label: 'Backend\nRegion A', x: 510, y: 70, width: 160, kind: 'workload' },
        { id: 'b2', label: 'Backend\nRegion B', x: 510, y: 225, width: 160, kind: 'workload' },
        { id: 'hc', label: 'Health Checks', x: 780, y: 145, width: 160, kind: 'control' },
      ], edges: [
        { from: 'u', to: 'vip', label: 'HTTPS' },
        { from: 'vip', to: 'b1', label: en ? 'route' : 'rota' },
        { from: 'vip', to: 'b2', label: en ? 'route' : 'rota' },
        { from: 'hc', to: 'b1', label: en ? 'health' : 'saúde' },
        { from: 'hc', to: 'b2', label: en ? 'health' : 'saúde' },
      ], sources: sources.loadbalancing,
    },
    hybrid: {
      title: en ? 'Hybrid connectivity: Cloud VPN or Cloud Interconnect' : 'Conectividade híbrida: Cloud VPN ou Cloud Interconnect',
      description: en ? 'Cloud VPN provides encrypted IPsec connectivity over the Internet. Cloud Interconnect provides dedicated connectivity. Cloud Router commonly exchanges routes dynamically with BGP.' : 'Cloud VPN fornece conectividade IPsec cifrada sobre a Internet. Cloud Interconnect fornece conectividade dedicada. Cloud Router normalmente troca rotas dinamicamente via BGP.',
      width: 1080, height: 420,
      nodes: [
        { id: 'on', label: 'On-premises', x: 25, y: 155, width: 170, kind: 'network' },
        { id: 'edge', label: en ? 'Customer Router' : 'Router do cliente', x: 245, y: 155, width: 170, kind: 'network' },
        { id: 'vpn', label: 'HA VPN\nIPsec', x: 500, y: 65, width: 160, kind: 'security' },
        { id: 'ix', label: 'Cloud Interconnect', x: 500, y: 245, width: 180, kind: 'network' },
        { id: 'cr', label: 'Cloud Router\nBGP', x: 760, y: 155, width: 170, kind: 'control' },
        { id: 'vpc', label: 'GCP VPC', x: 990, y: 155, width: 140, kind: 'network' },
      ], edges: [
        { from: 'on', to: 'edge' },
        { from: 'edge', to: 'vpn', label: en ? 'Internet' : 'Internet' },
        { from: 'edge', to: 'ix', label: en ? 'dedicated' : 'dedicado' },
        { from: 'vpn', to: 'cr', label: 'BGP' }, { from: 'ix', to: 'cr', label: 'BGP' },
        { from: 'cr', to: 'vpc', label: en ? 'dynamic routes' : 'rotas dinâmicas' },
      ], sources: sources.hybrid,
    },
  };
  return diagrams[key];
}
