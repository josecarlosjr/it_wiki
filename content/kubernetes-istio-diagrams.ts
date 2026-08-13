import type { DiagramNodeKind, DiagramSpec } from './diagrams';

type Locale = 'pt' | 'en';
type Bi = { pt: string; en: string };
type BiNode = { id: string; label: Bi; x: number; y: number; width?: number; kind?: DiagramNodeKind };
type BiEdge = { from: string; to: string; label?: Bi; animated?: boolean; bidirectional?: boolean };
type BiDiagram = { title: Bi; description: Bi; width?: number; height?: number; nodes: BiNode[]; edges: BiEdge[]; sources: { label: string; url: string }[] };

const b = (pt: string, en: string): Bi => ({ pt, en });
const n = (id: string, pt: string, en: string, x: number, y: number, kind: DiagramNodeKind = 'workload', width?: number): BiNode => ({ id, label: b(pt, en), x, y, kind, width });
const e = (from: string, to: string, pt?: string, en?: string, animated = false, bidirectional = false): BiEdge => ({ from, to, label: pt && en ? b(pt, en) : undefined, animated, bidirectional });

const sources = {
  arch: { label: 'Istio — Architecture', url: 'https://istio.io/latest/docs/ops/deployment/architecture/' },
  ambient: { label: 'Istio — Ambient mode', url: 'https://istio.io/latest/docs/ambient/overview/' },
  traffic: { label: 'Istio — Traffic Management', url: 'https://istio.io/latest/docs/concepts/traffic-management/' },
  security: { label: 'Istio — Security', url: 'https://istio.io/latest/docs/concepts/security/' },
  telemetry: { label: 'Istio — Telemetry API', url: 'https://istio.io/latest/docs/tasks/observability/telemetry/' },
  inject: { label: 'Istio — Sidecar Injection', url: 'https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/' },
  kserve: { label: 'KServe — Architecture', url: 'https://kserve.github.io/website/docs/concepts/architecture/control-plane' },
  storage: { label: 'KServe — Storage Initializer', url: 'https://kserve.github.io/website/docs/0.17/model-serving/storage/overview' },
  linkerd: { label: 'Linkerd — Architecture', url: 'https://linkerd.io/2/reference/architecture/' },
  cilium: { label: 'Cilium — Service Mesh', url: 'https://docs.cilium.io/en/stable/network/servicemesh/' },
  consul: { label: 'Consul — Service Mesh', url: 'https://developer.hashicorp.com/consul/docs/connect' },
  gateway: { label: 'Kubernetes Gateway API', url: 'https://gateway-api.sigs.k8s.io/' },
};

const diagrams: Record<string, BiDiagram> = {
  sidecar: {
    title: b('Istio em modo sidecar: control plane e data plane', 'Istio sidecar mode: control plane and data plane'),
    description: b('Istiod observa configuração e descoberta de serviços, emite identidade/certificados e distribui configuração aos Envoy sidecars. O tráfego de aplicação passa pelos proxies do data plane.', 'Istiod observes configuration and service discovery, issues identity/certificates, and distributes proxy configuration to Envoy sidecars. Application traffic flows through the data-plane proxies.'),
    width: 980, height: 390,
    nodes: [
      n('ops','1. Operador\nCRDs / Gateway API','1. Operator\nCRDs / Gateway API',20,35,'client',180),
      n('istiod','2. Istiod\nDiscovery + Config + CA','2. Istiod\nDiscovery + Config + CA',300,35,'control',220),
      n('aenvoy','3. Envoy sidecar\nPod A','3. Envoy sidecar\nPod A',250,220,'network',180),
      n('appA','App A','App A',20,220,'workload',150),
      n('benvoy','4. Envoy sidecar\nPod B','4. Envoy sidecar\nPod B',610,220,'network',180),
      n('appB','App B','App B',830,220,'workload',130),
    ],
    edges: [e('ops','istiod','1. aplica configuração','1. applies config',true),e('istiod','aenvoy','2. xDS + certificados','2. xDS + certificates',true),e('istiod','benvoy','2. xDS + certificados','2. xDS + certificates',true),e('appA','aenvoy','3. saída interceptada','3. outbound intercepted',true),e('aenvoy','benvoy','4. mTLS + routing','4. mTLS + routing',true),e('benvoy','appB','5. entrega local','5. local delivery',true)],
    sources:[sources.arch,sources.security],
  },
  injection: {
    title: b('Como o sidecar entra no Pod', 'How the sidecar enters the Pod'),
    description: b('A injeção automática ocorre na criação do Pod por admission webhook. O Deployment permanece igual; o Pod resultante ganha istio-proxy e configuração de interceptação.', 'Automatic injection happens at Pod creation through an admission webhook. The Deployment remains unchanged; the resulting Pod gains istio-proxy and traffic interception configuration.'),
    width: 900,height:330,
    nodes:[n('label','1. Namespace label\nistio-injection=enabled','1. Namespace label\nistio-injection=enabled',20,110,'client',210),n('api','2. API Server','2. API Server',290,110,'control',160),n('webhook','3. Istio injector\nwebhook','3. Istio injector\nwebhook',500,110,'control',190),n('pod','4. Pod\napp + istio-proxy','4. Pod\napp + istio-proxy',750,110,'workload',170)],
    edges:[e('label','api','1. cria workload','1. creates workload',true),e('api','webhook','2. admission review','2. admission review',true),e('webhook','api','3. patch do Pod','3. Pod patch',true),e('api','pod','4. Pod mutado','4. mutated Pod',true)], sources:[sources.inject],
  },
  ambient: {
    title:b('Istio Ambient: ztunnel + waypoint','Istio Ambient: ztunnel + waypoint'),
    description:b('Ambient remove o sidecar do Pod. ztunnel fornece a camada L4 segura por Node; um waypoint Envoy opcional adiciona políticas e roteamento L7 por namespace/workload.', 'Ambient removes the proxy sidecar from application Pods. ztunnel provides a secure per-node L4 overlay; an optional Envoy waypoint adds L7 policy and routing per namespace/workload.'),
    width:980,height:410,
    nodes:[n('a','1. Pod A\nsem sidecar','1. Pod A\nno sidecar',20,200,'workload',160),n('za','2. ztunnel\nNode A','2. ztunnel\nNode A',230,200,'network',160),n('wp','3. Waypoint Envoy\nL7 opcional','3. Waypoint Envoy\noptional L7',470,80,'network',190),n('zb','4. ztunnel\nNode B','4. ztunnel\nNode B',700,200,'network',160),n('b','5. Pod B\nsem sidecar','5. Pod B\nno sidecar',850,200,'workload',130),n('istiod','Istiod\nconfig + identidade','Istiod\nconfig + identity',420,300,'control',190)],
    edges:[e('a','za','1. tráfego capturado','1. traffic captured',true),e('za','wp','2. L7 se necessário','2. L7 when required',true),e('wp','zb','3. policy/routing','3. policy/routing',true),e('za','zb','2b. HBONE/mTLS L4','2b. HBONE/mTLS L4',true),e('zb','b','4. entrega','4. delivery',true),e('istiod','za','config/certs','config/certs'),e('istiod','wp','config/certs','config/certs'),e('istiod','zb','config/certs','config/certs')],sources:[sources.ambient],
  },
  traffic: {
    title:b('Traffic management: Gateway → route → subset','Traffic management: Gateway → route → subset'),
    description:b('O Gateway recebe tráfego. VirtualService/HTTPRoute decide o destino e pesos. DestinationRule define subsets e políticas como load balancing, TLS e circuit breaking.', 'The Gateway receives traffic. VirtualService/HTTPRoute chooses destinations and weights. DestinationRule defines subsets and policies such as load balancing, TLS, and circuit breaking.'),
    width:980,height:360,
    nodes:[n('client','1. Cliente','1. Client',20,120,'client'),n('gw','2. Ingress Gateway','2. Ingress Gateway',220,120,'network',190),n('route','3. VirtualService /\nHTTPRoute','3. VirtualService /\nHTTPRoute',465,120,'decision',190),n('v1','4a. reviews v1\n90%','4a. reviews v1\n90%',730,55,'workload',160),n('v2','4b. reviews v2\n10%','4b. reviews v2\n10%',730,195,'workload',160)],
    edges:[e('client','gw','1. HTTPS','1. HTTPS',true),e('gw','route','2. host/path match','2. host/path match',true),e('route','v1','3. subset v1','3. subset v1',true),e('route','v2','3. subset v2','3. subset v2',true)],sources:[sources.traffic],
  },
  security: {
    title:b('Zero Trust no mesh: identidade, mTLS e autorização','Mesh Zero Trust: identity, mTLS, and authorization'),
    description:b('Istiod emite identidade de workload. PeerAuthentication pode exigir mTLS; RequestAuthentication valida JWT; AuthorizationPolicy decide ALLOW/DENY com base em identidade, operação e contexto.', 'Istiod issues workload identity. PeerAuthentication can require mTLS; RequestAuthentication validates JWTs; AuthorizationPolicy decides ALLOW/DENY based on identity, operation, and context.'),
    width:1000,height:390,
    nodes:[n('id','1. Istiod CA\nworkload identity','1. Istiod CA\nworkload identity',20,45,'control',180),n('client','2. Client proxy','2. Client proxy',210,200,'network',170),n('server','3. Server proxy\nPEP','3. Server proxy\nPEP',500,200,'security',190),n('app','4. App','4. App',780,200,'workload',150),n('jwt','JWT / OIDC issuer','JWT / OIDC issuer',500,45,'security',190)],
    edges:[e('id','client','cert + key','cert + key'),e('id','server','cert + key','cert + key'),e('client','server','1. mTLS + SPIFFE identity','1. mTLS + SPIFFE identity',true),e('jwt','server','2. JWT keys/claims','2. JWT keys/claims'),e('server','app','3. AuthorizationPolicy ALLOW','3. AuthorizationPolicy ALLOW',true)],sources:[sources.security],
  },
  telemetry: {
    title:b('Observabilidade do mesh','Mesh observability'),
    description:b('Os proxies geram métricas, access logs e spans. A Telemetry API escolhe providers e escopo; backends como Prometheus/OpenTelemetry recebem os sinais para dashboards, traces e troubleshooting.', 'Proxies generate metrics, access logs, and spans. The Telemetry API selects providers and scope; backends such as Prometheus/OpenTelemetry receive signals for dashboards, traces, and troubleshooting.'),
    width:970,height:350,
    nodes:[n('proxy','1. Envoy / Waypoint / ztunnel','1. Envoy / Waypoint / ztunnel',20,115,'network',220),n('tel','2. Telemetry API','2. Telemetry API',295,115,'control',180),n('prom','3a. Prometheus\nmetrics','3a. Prometheus\nmetrics',540,35,'data',170),n('otel','3b. OTel Collector\nlogs/traces','3b. OTel Collector\nlogs/traces',540,180,'data',190),n('ui','4. Grafana / Jaeger / Kiali','4. Grafana / Jaeger / Kiali',785,110,'client',180)],
    edges:[e('proxy','tel','metrics/logs/traces','metrics/logs/traces',true),e('tel','prom','provider','provider',true),e('tel','otel','provider','provider',true),e('prom','ui','query','query'),e('otel','ui','query','query')],sources:[sources.telemetry],
  },
  kserve: {
    title:b('KServe + Istio: model serving seguro e observável','KServe + Istio: secure and observable model serving'),
    description:b('Arquitetura inspirada no diagrama anexado: InferenceService é reconciliado pelo KServe controller, o runtime é criado, o storage initializer obtém o modelo e Istio publica/protege a API HTTP/gRPC.', 'Architecture inspired by the attached diagram: InferenceService is reconciled by the KServe controller, the runtime workload is created, the storage initializer fetches the model, and Istio publishes/protects the HTTP/gRPC API.'),
    width:1180,height:520,
    nodes:[n('user','1. ML / Platform user\nInferenceService CR','1. ML / Platform user\nInferenceService CR',20,55,'client',210),n('api','2. Kubernetes API','2. Kubernetes API',300,55,'control',180),n('ctrl','3. KServe Controller','3. KServe Controller',540,55,'control',190),n('runtime','4. ServingRuntime +\nDeployment/Pod/Service','4. ServingRuntime +\nDeployment/Pod/Service',810,55,'workload',230),n('registry','5. Container Registry\nruntime image','5. Container Registry\nruntime image',930,250,'data',190),n('storage','6. S3 / GCS / PVC / OCI\nmodel artifact','6. S3 / GCS / PVC / OCI\nmodel artifact',650,350,'data',210),n('init','7. storage-initializer\n/mnt/models','7. storage-initializer\n/mnt/models',400,350,'workload',190),n('gw','8. Istio Gateway\nTLS + policy','8. Istio Gateway\nTLS + policy',180,350,'network',190),n('client','9. Inference client\nHTTP/gRPC','9. Inference client\nHTTP/gRPC',20,350,'client',160)],
    edges:[e('user','api','1. kubectl/apply','1. kubectl/apply',true),e('api','ctrl','2. watch/reconcile','2. watch/reconcile',true),e('ctrl','runtime','3. cria recursos','3. creates resources',true),e('registry','runtime','4. pull image','4. pulls image',true),e('storage','init','5. download model','5. downloads model',true),e('init','runtime','6. modelo disponível','6. model available',true),e('client','gw','7. HTTPS/gRPC','7. HTTPS/gRPC',true),e('gw','runtime','8. mTLS/routing','8. mTLS/routing',true)],sources:[sources.kserve,sources.storage,sources.security],
  },
  egress: {
    title:b('Egress control: ServiceEntry e Egress Gateway','Egress control: ServiceEntry and Egress Gateway'),
    description:b('ServiceEntry registra dependências externas. Um Egress Gateway opcional centraliza saída para auditoria, policy, TLS origination e controles de rede.', 'ServiceEntry registers external dependencies. An optional Egress Gateway centralizes outbound traffic for auditing, policy, TLS origination, and network controls.'),
    width:900,height:320,
    nodes:[n('pod','1. Pod','1. Pod',20,110,'workload'),n('proxy','2. Envoy/ztunnel','2. Envoy/ztunnel',220,110,'network',170),n('eg','3. Egress Gateway','3. Egress Gateway',475,110,'network',180),n('ext','4. External API','4. External API',735,110,'client',160)],edges:[e('pod','proxy','1. request','1. request',true),e('proxy','eg','2. route via policy','2. route via policy',true),e('eg','ext','3. controlled egress','3. controlled egress',true)],sources:[sources.traffic],
  },
  alternatives: {
    title:b('Alternativas e abordagens sem Istio','Alternatives and approaches without Istio'),
    description:b('A escolha depende do problema: Linkerd prioriza simplicidade com proxy leve; Cilium combina eBPF e Envoy; Consul atende ambientes Kubernetes/VM; Gateway API + CNI + cert-manager + OTel pode cobrir ingress, network policy, TLS e observabilidade sem um mesh completo.', 'The choice depends on the problem: Linkerd prioritizes simplicity with a lightweight proxy; Cilium combines eBPF and Envoy; Consul spans Kubernetes/VM environments; Gateway API + CNI + cert-manager + OTel can cover ingress, network policy, TLS, and observability without a full mesh.'),
    width:1100,height:420,
    nodes:[n('need','1. Necessidade','1. Requirement',20,155,'decision',160),n('linkerd','2a. Linkerd\nsidecar proxy','2a. Linkerd\nsidecar proxy',250,30,'network',180),n('cilium','2b. Cilium\neBPF + Envoy','2b. Cilium\neBPF + Envoy',250,135,'network',180),n('consul','2c. Consul\nEnvoy + catalog','2c. Consul\nEnvoy + catalog',250,240,'network',180),n('native','2d. Kubernetes native\nGateway+CNI+certs+OTel','2d. Kubernetes native\nGateway+CNI+certs+OTel',250,345,'network',220),n('goal','3. Routing / Security /\nObservability','3. Routing / Security /\nObservability',650,155,'workload',230)],edges:[e('need','linkerd','simple mesh','simple mesh'),e('need','cilium','network + mesh','network + mesh'),e('need','consul','hybrid/multiplatform','hybrid/multiplatform'),e('need','native','avoid full mesh','avoid full mesh'),e('linkerd','goal'),e('cilium','goal'),e('consul','goal'),e('native','goal')],sources:[sources.linkerd,sources.cilium,sources.consul,sources.gateway],
  },
};

function localize(spec: BiDiagram, locale: Locale): DiagramSpec {
  return {
    title: spec.title[locale], description: spec.description[locale], width: spec.width, height: spec.height,
    nodes: spec.nodes.map((node) => ({ ...node, label: node.label[locale] })),
    edges: spec.edges.map((edge) => ({ ...edge, label: edge.label?.[locale] })), sources: spec.sources,
  };
}

export type KubernetesIstioDiagramKey = keyof typeof diagrams;
export function getKubernetesIstioDiagram(key: KubernetesIstioDiagramKey, locale: Locale): DiagramSpec { return localize(diagrams[key], locale); }
