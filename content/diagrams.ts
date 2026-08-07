export type DiagramNodeKind = 'client' | 'control' | 'data' | 'network' | 'workload' | 'security' | 'decision';

export type DiagramNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  kind?: DiagramNodeKind;
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
  bidirectional?: boolean;
};

export type DiagramSpec = {
  title: string;
  description: string;
  width?: number;
  height?: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  sources: { label: string; url: string }[];
};

export type InterviewVisual = {
  answer: string;
  diagram: DiagramSpec;
};

type ArticleDiagramCatalog = {
  sections: Record<string, DiagramSpec>;
  interviews: Record<string, InterviewVisual>;
};

const kubernetesSources = {
  components: { label: 'Kubernetes — Components', url: 'https://kubernetes.io/docs/concepts/overview/components/' },
  service: { label: 'Kubernetes — Services', url: 'https://kubernetes.io/docs/concepts/services-networking/service/' },
  endpoints: { label: 'Kubernetes — EndpointSlices', url: 'https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/' },
  probes: { label: 'Kubernetes — Probes', url: 'https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/' },
  ha: { label: 'Kubernetes — HA topology', url: 'https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/' },
  etcd: { label: 'etcd — Failure tolerance', url: 'https://etcd.io/docs/v3.5/faq/#what-is-failure-tolerance' },
  authn: { label: 'Kubernetes — Authentication', url: 'https://kubernetes.io/docs/reference/access-authn-authz/authentication/' },
  authz: { label: 'Kubernetes — Authorization', url: 'https://kubernetes.io/docs/reference/access-authn-authz/authorization/' },
  admission: { label: 'Kubernetes — Admission controllers', url: 'https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/' },
  workloads: { label: 'Kubernetes — Workload resources', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/' },
};

const kubernetes: ArticleDiagramCatalog = {
  sections: {
    fundamentos: {
      title: 'Arquitetura básica do Kubernetes',
      description: 'O API Server é o ponto central do control plane. Scheduler e controllers observam o estado pela API; o etcd persiste o estado; kubelets executam Pods nos nodes.',
      width: 920,
      height: 430,
      nodes: [
        { id: 'client', label: 'kubectl / API client', x: 35, y: 165, kind: 'client' },
        { id: 'api', label: 'kube-apiserver', x: 305, y: 165, kind: 'control' },
        { id: 'etcd', label: 'etcd', x: 575, y: 35, kind: 'data' },
        { id: 'scheduler', label: 'kube-scheduler', x: 575, y: 135, kind: 'control' },
        { id: 'controllers', label: 'controller-manager', x: 575, y: 235, kind: 'control' },
        { id: 'kubelet', label: 'kubelet', x: 575, y: 335, kind: 'workload' },
        { id: 'pods', label: 'Pods', x: 775, y: 335, kind: 'workload' },
      ],
      edges: [
        { from: 'client', to: 'api', label: 'HTTPS API', animated: true },
        { from: 'api', to: 'etcd', label: 'estado' },
        { from: 'api', to: 'scheduler', label: 'watch / bind', bidirectional: true },
        { from: 'api', to: 'controllers', label: 'watch / reconcile', bidirectional: true },
        { from: 'api', to: 'kubelet', label: 'PodSpec / status', bidirectional: true },
        { from: 'kubelet', to: 'pods', label: 'executa', animated: true },
      ],
      sources: [kubernetesSources.components],
    },
    operacao: {
      title: 'Caminho de tráfego e readiness',
      description: 'Ingress encaminha HTTP/HTTPS para um Service. O Service representa endpoints de Pods; quando readiness falha, o endpoint correspondente deixa de ser considerado pronto para tráfego.',
      width: 980,
      height: 390,
      nodes: [
        { id: 'user', label: 'Cliente', x: 25, y: 145, kind: 'client' },
        { id: 'ingress', label: 'Ingress Controller', x: 200, y: 145, kind: 'network' },
        { id: 'service', label: 'Service', x: 410, y: 145, kind: 'network' },
        { id: 'slice', label: 'EndpointSlice', x: 610, y: 35, kind: 'data' },
        { id: 'podA', label: 'Pod A · Ready', x: 790, y: 105, kind: 'workload' },
        { id: 'podB', label: 'Pod B · NotReady', x: 790, y: 235, kind: 'workload' },
        { id: 'probe', label: 'readinessProbe', x: 585, y: 265, kind: 'decision' },
      ],
      edges: [
        { from: 'user', to: 'ingress', label: 'HTTPS', animated: true },
        { from: 'ingress', to: 'service', label: 'rota', animated: true },
        { from: 'service', to: 'slice', label: 'endpoints' },
        { from: 'slice', to: 'podA', label: 'ready=true', animated: true },
        { from: 'slice', to: 'podB', label: 'ready=false' },
        { from: 'probe', to: 'podB', label: 'verifica' },
        { from: 'probe', to: 'slice', label: 'atualiza condição' },
      ],
      sources: [kubernetesSources.service, kubernetesSources.endpoints, kubernetesSources.probes],
    },
    arquitetura: {
      title: 'Control plane altamente disponível com etcd em quorum',
      description: 'Uma topologia HA distribui API Servers atrás de um load balancer e mantém múltiplos membros etcd. Em um cluster etcd de três membros, são necessários dois membros para manter quorum.',
      width: 1020,
      height: 490,
      nodes: [
        { id: 'client', label: 'Clientes', x: 30, y: 190, kind: 'client' },
        { id: 'lb', label: 'Load Balancer', x: 205, y: 190, kind: 'network' },
        { id: 'api1', label: 'API Server 1', x: 405, y: 70, kind: 'control' },
        { id: 'api2', label: 'API Server 2', x: 405, y: 190, kind: 'control' },
        { id: 'api3', label: 'API Server 3', x: 405, y: 310, kind: 'control' },
        { id: 'etcd1', label: 'etcd 1', x: 720, y: 70, kind: 'data' },
        { id: 'etcd2', label: 'etcd 2', x: 720, y: 190, kind: 'data' },
        { id: 'etcd3', label: 'etcd 3', x: 720, y: 310, kind: 'data' },
        { id: 'quorum', label: 'Quorum = 2 de 3', x: 820, y: 410, kind: 'decision' },
      ],
      edges: [
        { from: 'client', to: 'lb', label: 'API', animated: true },
        { from: 'lb', to: 'api1', animated: true },
        { from: 'lb', to: 'api2', animated: true },
        { from: 'lb', to: 'api3', animated: true },
        { from: 'api1', to: 'etcd1', label: 'estado' },
        { from: 'api2', to: 'etcd2', label: 'estado' },
        { from: 'api3', to: 'etcd3', label: 'estado' },
        { from: 'etcd1', to: 'etcd2', label: 'Raft', bidirectional: true },
        { from: 'etcd2', to: 'etcd3', label: 'Raft', bidirectional: true },
        { from: 'etcd1', to: 'etcd3', label: 'Raft', bidirectional: true },
        { from: 'etcd2', to: 'quorum' },
      ],
      sources: [kubernetesSources.ha, kubernetesSources.etcd],
    },
    especialista: {
      title: 'Pipeline de segurança de uma requisição à API',
      description: 'Uma requisição ao API Server passa por autenticação, autorização e admission control antes de o objeto aceito ser persistido. Cada etapa responde a uma pergunta de segurança diferente.',
      width: 1060,
      height: 320,
      nodes: [
        { id: 'request', label: 'Request', x: 20, y: 115, kind: 'client' },
        { id: 'authn', label: 'Authentication\nQuem é?', x: 190, y: 115, kind: 'security' },
        { id: 'authz', label: 'Authorization\nPode fazer?', x: 390, y: 115, kind: 'security' },
        { id: 'admission', label: 'Admission\nÉ permitido / mutado?', x: 590, y: 115, kind: 'security' },
        { id: 'api', label: 'API Server', x: 805, y: 115, kind: 'control' },
        { id: 'etcd', label: 'etcd', x: 930, y: 225, kind: 'data' },
      ],
      edges: [
        { from: 'request', to: 'authn', animated: true },
        { from: 'authn', to: 'authz', animated: true },
        { from: 'authz', to: 'admission', animated: true },
        { from: 'admission', to: 'api', animated: true },
        { from: 'api', to: 'etcd', label: 'persistência' },
      ],
      sources: [kubernetesSources.authn, kubernetesSources.authz, kubernetesSources.admission],
    },
  },
  interviews: {
    'Qual é a diferença entre Deployment, StatefulSet e DaemonSet?': {
      answer: 'Deployment é indicado para réplicas normalmente intercambiáveis de aplicações stateless. StatefulSet oferece identidade estável e ordenação para workloads que precisam preservar identidade ou armazenamento associado. DaemonSet garante que todos, ou um subconjunto selecionado, dos nodes executem uma cópia do Pod.',
      diagram: {
        title: 'Escolha do controlador de workload',
        description: 'A escolha depende principalmente de identidade, estado e necessidade de executar uma instância por node.',
        width: 980,
        height: 390,
        nodes: [
          { id: 'need', label: 'Requisito do workload', x: 30, y: 145, kind: 'decision' },
          { id: 'deploy', label: 'Deployment', x: 310, y: 45, kind: 'workload' },
          { id: 'stateful', label: 'StatefulSet', x: 310, y: 145, kind: 'workload' },
          { id: 'daemon', label: 'DaemonSet', x: 310, y: 245, kind: 'workload' },
          { id: 'stateless', label: 'Réplicas intercambiáveis', x: 600, y: 45, kind: 'data' },
          { id: 'identity', label: 'Identidade / storage estável', x: 600, y: 145, kind: 'data' },
          { id: 'pernode', label: 'Uma cópia por node', x: 600, y: 245, kind: 'data' },
        ],
        edges: [
          { from: 'need', to: 'deploy', label: 'stateless' },
          { from: 'need', to: 'stateful', label: 'identidade/estado' },
          { from: 'need', to: 'daemon', label: 'node-local' },
          { from: 'deploy', to: 'stateless' },
          { from: 'stateful', to: 'identity' },
          { from: 'daemon', to: 'pernode' },
        ],
        sources: [kubernetesSources.workloads],
      },
    },
    'O que acontece quando uma readiness probe falha?': {
      answer: 'O kubelet marca a condição Ready do container/Pod como não pronta. O endpoint correspondente passa a indicar que não está pronto e deixa de receber tráfego normal por Services que respeitam essa condição. Uma falha de readiness, por si só, não é o mecanismo responsável por reiniciar o container; isso é função da liveness probe quando configurada e falhando.',
      diagram: {
        title: 'Falha de readiness sem reinício automático',
        description: 'O efeito principal é retirar o Pod do caminho normal de tráfego, não reiniciar o processo.',
        width: 960,
        height: 330,
        nodes: [
          { id: 'probe', label: 'readinessProbe falha', x: 25, y: 115, kind: 'decision' },
          { id: 'kubelet', label: 'kubelet', x: 245, y: 115, kind: 'workload' },
          { id: 'pod', label: 'Pod NotReady', x: 430, y: 115, kind: 'workload' },
          { id: 'slice', label: 'EndpointSlice\nready=false', x: 620, y: 115, kind: 'data' },
          { id: 'service', label: 'Service não envia\ntráfego normal', x: 800, y: 115, kind: 'network' },
        ],
        edges: [
          { from: 'probe', to: 'kubelet', animated: true },
          { from: 'kubelet', to: 'pod', animated: true },
          { from: 'pod', to: 'slice', animated: true },
          { from: 'slice', to: 'service', animated: true },
        ],
        sources: [kubernetesSources.probes, kubernetesSources.endpoints],
      },
    },
    'Como investigar um Service sem endpoints?': {
      answer: 'Comece pelo selector do Service e pelos labels dos Pods. Confirme se os Pods existem, estão no namespace esperado e estão Ready; depois inspecione os EndpointSlices. Se o Service não usa selector, verifique como os endpoints são administrados. Só depois avance para DNS, kube-proxy/CNI ou regras de rede.',
      diagram: {
        title: 'Troubleshooting de Service sem endpoints',
        description: 'A investigação começa na relação selector → labels → readiness → EndpointSlice, antes de culpar a camada de rede.',
        width: 1020,
        height: 390,
        nodes: [
          { id: 'svc', label: 'Service selector', x: 25, y: 140, kind: 'network' },
          { id: 'labels', label: 'Pod labels\ncorrespondem?', x: 235, y: 140, kind: 'decision' },
          { id: 'pods', label: 'Pods existem\ne estão Ready?', x: 455, y: 140, kind: 'decision' },
          { id: 'slice', label: 'EndpointSlice', x: 690, y: 70, kind: 'data' },
          { id: 'network', label: 'DNS / proxy / CNI', x: 690, y: 235, kind: 'network' },
          { id: 'fixed', label: 'Endpoints encontrados', x: 860, y: 70, kind: 'workload' },
        ],
        edges: [
          { from: 'svc', to: 'labels', animated: true },
          { from: 'labels', to: 'pods', label: 'sim' },
          { from: 'pods', to: 'slice', label: 'sim' },
          { from: 'slice', to: 'fixed', animated: true },
          { from: 'slice', to: 'network', label: 'endpoints existem' },
        ],
        sources: [kubernetesSources.service, kubernetesSources.endpoints],
      },
    },
    'Como o quorum do etcd afeta a disponibilidade do cluster?': {
      answer: 'O etcd usa consenso Raft e precisa de maioria dos membros para continuar fazendo progresso. Em três membros, o quorum é dois; a perda de um membro ainda preserva maioria, enquanto a perda de dois elimina o quorum e impede o cluster etcd de continuar operações que dependem de consenso. Como o Kubernetes persiste o estado do cluster no etcd, isso afeta diretamente operações do control plane.',
      diagram: {
        title: 'Quorum do etcd com três membros',
        description: 'Três membros toleram a falha de um membro; dois membros restantes ainda formam a maioria necessária.',
        width: 900,
        height: 390,
        nodes: [
          { id: 'api', label: 'API Server', x: 30, y: 145, kind: 'control' },
          { id: 'e1', label: 'etcd 1', x: 315, y: 45, kind: 'data' },
          { id: 'e2', label: 'etcd 2', x: 315, y: 145, kind: 'data' },
          { id: 'e3', label: 'etcd 3', x: 315, y: 245, kind: 'data' },
          { id: 'majority', label: 'Maioria necessária\n2 de 3', x: 625, y: 145, kind: 'decision' },
        ],
        edges: [
          { from: 'api', to: 'e1' },
          { from: 'api', to: 'e2' },
          { from: 'api', to: 'e3' },
          { from: 'e1', to: 'e2', label: 'Raft', bidirectional: true },
          { from: 'e2', to: 'e3', label: 'Raft', bidirectional: true },
          { from: 'e1', to: 'e3', label: 'Raft', bidirectional: true },
          { from: 'e2', to: 'majority' },
        ],
        sources: [kubernetesSources.etcd, kubernetesSources.components],
      },
    },
  },
};

const catalog: Record<string, ArticleDiagramCatalog> = { kubernetes };

export function getSectionDiagram(articleSlug: string, sectionId: string) {
  return catalog[articleSlug]?.sections[sectionId];
}

export function getInterviewVisual(articleSlug: string, question: string) {
  return catalog[articleSlug]?.interviews[question];
}
