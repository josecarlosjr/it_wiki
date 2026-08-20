import type { DiagramSpec } from './diagrams';

type Locale = 'pt' | 'en';
export type KustomizeDiagramKey = 'mental-model' | 'base-overlays' | 'patches' | 'generators' | 'gitops';

export function getKustomizeDiagram(key: KustomizeDiagramKey, locale: Locale): DiagramSpec {
  const en = locale === 'en';
  const maps: Record<KustomizeDiagramKey, DiagramSpec> = {
    'mental-model': {
      title: en ? 'Kustomize mental model' : 'Mapa mental do Kustomize',
      description: en ? 'Kustomize composes and transforms Kubernetes YAML without templating the YAML files themselves.' : 'Kustomize compõe e transforma YAML Kubernetes sem transformar os manifestos-base em templates.',
      width: 1040, height: 520,
      nodes: [
        { id: 'center', label: 'Kustomize\nkustomization.yaml', x: 420, y: 190, width: 210, kind: 'control' },
        { id: 'resources', label: en ? 'Resources\nDeployment · Service' : 'Resources\nDeployment · Service', x: 40, y: 55, width: 200, kind: 'workload' },
        { id: 'overlays', label: en ? 'Bases + Overlays\ndev · staging · prod' : 'Bases + Overlays\ndev · staging · prod', x: 40, y: 330, width: 210, kind: 'data' },
        { id: 'patches', label: en ? 'Patches / Transformers\nreplicas · image · labels' : 'Patches / Transformers\nreplicas · image · labels', x: 750, y: 55, width: 220, kind: 'decision' },
        { id: 'generators', label: en ? 'Generators\nConfigMap · Secret' : 'Generators\nConfigMap · Secret', x: 760, y: 330, width: 200, kind: 'security' },
        { id: 'render', label: en ? 'Rendered manifests\nkubectl kustomize' : 'Manifests renderizados\nkubectl kustomize', x: 405, y: 400, width: 235, kind: 'data' },
      ],
      edges: [
        { from: 'resources', to: 'center', label: en ? 'compose' : 'compõe', animated: true },
        { from: 'overlays', to: 'center', label: en ? 'reuse + specialize' : 'reutiliza + especializa', animated: true },
        { from: 'patches', to: 'center', label: en ? 'transform' : 'transforma', animated: true },
        { from: 'generators', to: 'center', label: en ? 'generate objects' : 'gera objetos', animated: true },
        { from: 'center', to: 'render', label: en ? 'build' : 'build', animated: true },
      ],
      sources: [{ label: 'Kubernetes — Kustomization', url: 'https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/' }],
    },
    'base-overlays': {
      title: en ? 'Base and overlays' : 'Base e overlays',
      description: en ? 'A base contains reusable Kubernetes resources; overlays customize only what differs per environment.' : 'A base contém recursos Kubernetes reutilizáveis; overlays alteram somente o que muda por ambiente.',
      width: 1040, height: 500,
      nodes: [
        { id: 'base', label: en ? 'BASE\ndeployment.yaml\nservice.yaml\nkustomization.yaml' : 'BASE\ndeployment.yaml\nservice.yaml\nkustomization.yaml', x: 40, y: 180, width: 230, kind: 'data' },
        { id: 'dev', label: en ? 'DEV overlay\n1 replica\ndev namespace' : 'Overlay DEV\n1 réplica\nnamespace dev', x: 390, y: 40, width: 210, kind: 'workload' },
        { id: 'prod', label: en ? 'PROD overlay\n4 replicas\nprod namespace' : 'Overlay PROD\n4 réplicas\nnamespace prod', x: 390, y: 310, width: 210, kind: 'workload' },
        { id: 'devout', label: en ? 'Rendered DEV\nKubernetes YAML' : 'DEV renderizado\nYAML Kubernetes', x: 760, y: 40, width: 210, kind: 'data' },
        { id: 'prodout', label: en ? 'Rendered PROD\nKubernetes YAML' : 'PROD renderizado\nYAML Kubernetes', x: 760, y: 310, width: 210, kind: 'data' },
      ],
      edges: [
        { from: 'base', to: 'dev', label: en ? 'resources: ../../base' : 'resources: ../../base', animated: true },
        { from: 'base', to: 'prod', label: en ? 'resources: ../../base' : 'resources: ../../base', animated: true },
        { from: 'dev', to: 'devout', label: 'kubectl kustomize', animated: true },
        { from: 'prod', to: 'prodout', label: 'kubectl kustomize', animated: true },
      ],
      sources: [{ label: 'Kubernetes — Bases and overlays', url: 'https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/' }],
    },
    patches: {
      title: en ? 'Patches and transformations' : 'Patches e transformações',
      description: en ? 'Patches change only selected fields while preserving the reusable base.' : 'Patches alteram apenas campos selecionados, preservando a base reutilizável.',
      width: 1040, height: 470,
      nodes: [
        { id: 'base', label: en ? 'Base Deployment\nreplicas: 2\nimage: api:1.0' : 'Deployment base\nreplicas: 2\nimage: api:1.0', x: 40, y: 170, width: 220, kind: 'workload' },
        { id: 'patch', label: en ? 'Patch\nreplicas: 5\nCPU limits' : 'Patch\nreplicas: 5\nlimits de CPU', x: 390, y: 60, width: 210, kind: 'decision' },
        { id: 'image', label: en ? 'Image transformer\napi:2.4.1' : 'Image transformer\napi:2.4.1', x: 390, y: 290, width: 210, kind: 'control' },
        { id: 'out', label: en ? 'Final Deployment\nreplicas: 5\nimage: api:2.4.1' : 'Deployment final\nreplicas: 5\nimage: api:2.4.1', x: 760, y: 170, width: 220, kind: 'data' },
      ],
      edges: [
        { from: 'base', to: 'patch', label: en ? 'target by kind/name' : 'target por kind/name', animated: true },
        { from: 'base', to: 'image', label: en ? 'transform image' : 'transforma imagem', animated: true },
        { from: 'patch', to: 'out', label: en ? 'merge fields' : 'mescla campos', animated: true },
        { from: 'image', to: 'out', label: en ? 'replace tag/digest' : 'troca tag/digest', animated: true },
      ],
      sources: [{ label: 'Kubernetes — Kustomize patches', url: 'https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/' }],
    },
    generators: {
      title: en ? 'Generators, replacements, and components' : 'Generators, replacements e components',
      description: en ? 'Generators create ConfigMaps/Secrets, replacements copy values between objects, and Components package optional reusable behavior.' : 'Generators criam ConfigMaps/Secrets, replacements copiam valores entre objetos e Components empacotam comportamento opcional reutilizável.',
      width: 1080, height: 520,
      nodes: [
        { id: 'center', label: 'kustomization.yaml', x: 430, y: 195, width: 200, kind: 'control' },
        { id: 'cm', label: 'configMapGenerator\nAPP_MODE=prod', x: 40, y: 60, width: 220, kind: 'data' },
        { id: 'secret', label: en ? 'secretGenerator\ncredentials files/literals' : 'secretGenerator\narquivos/literals de credenciais', x: 40, y: 330, width: 220, kind: 'security' },
        { id: 'replacement', label: en ? 'replacements\nsource → targets' : 'replacements\nsource → targets', x: 770, y: 60, width: 220, kind: 'decision' },
        { id: 'component', label: en ? 'Component\noptional observability/TLS' : 'Component\nobservabilidade/TLS opcional', x: 770, y: 330, width: 220, kind: 'workload' },
        { id: 'output', label: en ? 'Generated + transformed\nKubernetes objects' : 'Objetos Kubernetes\ngerados + transformados', x: 420, y: 405, width: 225, kind: 'data' },
      ],
      edges: [
        { from: 'cm', to: 'center', label: en ? 'generate ConfigMap' : 'gera ConfigMap', animated: true },
        { from: 'secret', to: 'center', label: en ? 'generate Secret' : 'gera Secret', animated: true },
        { from: 'replacement', to: 'center', label: en ? 'copy values' : 'copia valores', animated: true },
        { from: 'component', to: 'center', label: en ? 'optional composition' : 'composição opcional', animated: true },
        { from: 'center', to: 'output', label: 'build', animated: true },
      ],
      sources: [{ label: 'Kubernetes — Generators', url: 'https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/' }],
    },
    gitops: {
      title: en ? 'Kustomize in GitOps and production' : 'Kustomize em GitOps e produção',
      description: en ? 'Git stores base and overlays; CI validates the build; Argo CD or Flux renders Kustomize and reconciles the cluster.' : 'Git guarda base e overlays; CI valida o build; Argo CD ou Flux renderiza Kustomize e reconcilia o cluster.',
      width: 1080, height: 490,
      nodes: [
        { id: 'git', label: en ? 'Git repository\nbase/ + overlays/' : 'Repositório Git\nbase/ + overlays/', x: 30, y: 175, width: 220, kind: 'data' },
        { id: 'ci', label: en ? 'CI validation\nkustomize build\nkubeconform/policy' : 'Validação CI\nkustomize build\nkubeconform/policy', x: 330, y: 60, width: 220, kind: 'control' },
        { id: 'argo', label: en ? 'Argo CD / Flux\nrender + reconcile' : 'Argo CD / Flux\nrender + reconcile', x: 330, y: 310, width: 220, kind: 'control' },
        { id: 'desired', label: en ? 'Desired manifests\nimmutable image digest' : 'Manifests desejados\nimage digest imutável', x: 675, y: 60, width: 220, kind: 'workload' },
        { id: 'cluster', label: en ? 'Kubernetes cluster\nlive state' : 'Cluster Kubernetes\nlive state', x: 675, y: 310, width: 220, kind: 'network' },
        { id: 'drift', label: en ? 'Diff / drift\nreview → reconcile' : 'Diff / drift\nreview → reconcile', x: 900, y: 200, width: 160, kind: 'decision' },
      ],
      edges: [
        { from: 'git', to: 'ci', label: en ? 'pull request' : 'pull request', animated: true },
        { from: 'ci', to: 'desired', label: en ? 'validated render' : 'render validado', animated: true },
        { from: 'git', to: 'argo', label: en ? 'source of truth' : 'source of truth', animated: true },
        { from: 'argo', to: 'cluster', label: en ? 'apply/reconcile' : 'apply/reconcile', animated: true },
        { from: 'desired', to: 'drift', label: en ? 'desired' : 'desired' },
        { from: 'cluster', to: 'drift', label: en ? 'live' : 'live' },
      ],
      sources: [
        { label: 'Kubernetes — Kustomize', url: 'https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/' },
        { label: 'Argo CD — Kustomize', url: 'https://argo-cd.readthedocs.io/en/stable/user-guide/kustomize/' },
      ],
    },
  };
  return maps[key];
}
