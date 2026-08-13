import type { DiagramSpec } from './diagrams';

export function getIstioAmbientFullDiagram(locale: 'pt' | 'en'): DiagramSpec {
  const en = locale === 'en';
  return {
    title: en ? 'Istio Ambient: complete infrastructure' : 'Istio Ambient: infraestrutura completa',
    description: en
      ? 'External traffic enters through the load balancer and Istio Gateway. Istio CNI redirects workload traffic to the node-local ztunnel. ztunnel provides the L4 secure overlay over HBONE/mTLS; an optional waypoint provides L7 processing. Istiod watches Kubernetes/Istio resources and configures the data plane through xDS.'
      : 'O tráfego externo entra pelo load balancer e Istio Gateway. Istio CNI redireciona o tráfego dos workloads ao ztunnel local do Node. ztunnel fornece o secure overlay L4 com HBONE/mTLS; um waypoint opcional fornece processamento L7. Istiod observa recursos Kubernetes/Istio e configura o data plane via xDS.',
    width: 1120,
    height: 610,
    nodes: [
      { id: 'client', label: en ? '1. External client' : '1. Cliente externo', x: 20, y: 20, kind: 'client' },
      { id: 'lb', label: '2. Load Balancer', x: 220, y: 20, kind: 'network' },
      { id: 'gw', label: '3. Istio Gateway', x: 430, y: 20, kind: 'network' },
      { id: 'podA', label: en ? '4. App Pod A\nno sidecar' : '4. App Pod A\nsem sidecar', x: 20, y: 210, kind: 'workload' },
      { id: 'cniA', label: 'Istio CNI\nNode 01', x: 20, y: 340, kind: 'network' },
      { id: 'ztA', label: '5. ztunnel\nNode 01 · L4', x: 230, y: 235, kind: 'network' },
      { id: 'wp', label: en ? '6. Waypoint\nL7 optional' : '6. Waypoint\nL7 opcional', x: 465, y: 220, kind: 'network' },
      { id: 'ztB', label: '7. ztunnel\nNode 02 · L4', x: 720, y: 235, kind: 'network' },
      { id: 'podB', label: en ? '8. App Pod B\nno sidecar' : '8. App Pod B\nsem sidecar', x: 925, y: 210, kind: 'workload' },
      { id: 'cniB', label: 'Istio CNI\nNode 02', x: 925, y: 340, kind: 'network' },
      { id: 'api', label: '9. Kubernetes API\n+ Istio CRDs', x: 220, y: 480, kind: 'control' },
      { id: 'istiod', label: '10. Istiod\nControl Plane + xDS', x: 610, y: 475, kind: 'control' }
    ],
    edges: [
      { from: 'client', to: 'lb', label: '1. HTTPS', animated: true },
      { from: 'lb', to: 'gw', label: '2. ingress', animated: true },
      { from: 'cniA', to: 'podA', label: en ? '3. redirect' : '3. redireciona' },
      { from: 'cniB', to: 'podB', label: en ? '3. redirect' : '3. redireciona' },
      { from: 'podA', to: 'ztA', label: en ? '4. capture' : '4. captura', animated: true },
      { from: 'ztA', to: 'wp', label: '5. HBONE / mTLS', animated: true },
      { from: 'wp', to: 'ztB', label: en ? '6. L7 policy + HBONE' : '6. policy L7 + HBONE', animated: true },
      { from: 'ztA', to: 'ztB', label: en ? '5b. direct L4 HBONE' : '5b. HBONE L4 direto', animated: true },
      { from: 'ztB', to: 'podB', label: en ? '7. deliver' : '7. entrega', animated: true },
      { from: 'gw', to: 'podB', label: en ? '8. ingress bypasses waypoint by default' : '8. ingress ignora waypoint por padrão', animated: true },
      { from: 'api', to: 'istiod', label: en ? '9. watch resources' : '9. watch recursos', animated: true },
      { from: 'istiod', to: 'ztA', label: '10. xDS + certs' },
      { from: 'istiod', to: 'ztB', label: '10. xDS + certs' },
      { from: 'istiod', to: 'wp', label: '10. xDS L7' },
      { from: 'istiod', to: 'gw', label: '10. xDS' }
    ],
    sources: [
      { label: 'Istio — Ambient architecture', url: 'https://istio.io/latest/docs/ambient/architecture/' }
    ]
  };
}
