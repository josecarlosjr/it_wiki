import type { InterviewVisual } from './diagrams';

const s = {
  tfState: { label: 'Terraform — State', url: 'https://developer.hashicorp.com/terraform/language/state' },
  tfLock: { label: 'Terraform — State locking', url: 'https://developer.hashicorp.com/terraform/language/state/locking' },
  tfModules: { label: 'Terraform — Modules', url: 'https://developer.hashicorp.com/terraform/language/modules' },
  tfData: { label: 'Terraform — Data sources', url: 'https://developer.hashicorp.com/terraform/language/data-sources' },
  ansiblePlay: { label: 'Ansible — Playbooks', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html' },
  ansibleHandlers: { label: 'Ansible — Handlers', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_handlers.html' },
  ansibleRoles: { label: 'Ansible — Roles', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html' },
  argoAuto: { label: 'Argo CD — Automated Sync', url: 'https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/' },
  gha: { label: 'GitHub Actions — Workflows', url: 'https://docs.github.com/actions/writing-workflows/about-workflows' },
};

const visuals: Record<string, Record<string, InterviewVisual>> = {
  terraform: {
    'Por que o Terraform precisa de state?': {
      answer: 'O state mapeia endereços da configuração para objetos remotos e armazena metadados necessários para calcular diferenças e dependências. Sem esse mapeamento, Terraform não sabe de forma confiável qual objeto real corresponde a cada resource block. O state também melhora desempenho ao evitar consultas desnecessárias, mas deve ser protegido porque pode conter dados sensíveis.',
      diagram: { title: 'State liga HCL a objetos reais', description: 'O state mantém identidade e metadados entre configuração declarativa e infraestrutura remota.', width: 900, height: 300,
        nodes: [{ id: 'hcl', label: 'HCL address\naws_instance.web', x: 30, y: 100, kind: 'data' }, { id: 'state', label: 'State mapping', x: 335, y: 100, kind: 'data' }, { id: 'real', label: 'Cloud object\ni-0123…', x: 650, y: 100, kind: 'workload' }],
        edges: [{ from: 'hcl', to: 'state', label: 'address' }, { from: 'state', to: 'real', label: 'remote ID', bidirectional: true }], sources: [s.tfState] },
    },
    'Como evitar aplicação concorrente sobre o mesmo state?': {
      answer: 'Use um backend remoto com mecanismo de locking compatível e mantenha um único fluxo autorizado de apply por state boundary. Pipelines devem serializar applies e não compartilhar o mesmo state entre componentes sem ownership comum. Se um lock ficar órfão, investigue se não existe operação ativa antes de usar force-unlock.',
      diagram: { title: 'Lock serializa writers do state', description: 'Dois applies concorrentes não devem alterar o mesmo state simultaneamente.', width: 930, height: 320,
        nodes: [{ id: 'p1', label: 'Pipeline A', x: 30, y: 40, kind: 'control' }, { id: 'p2', label: 'Pipeline B', x: 30, y: 200, kind: 'control' }, { id: 'lock', label: 'State lock', x: 350, y: 120, kind: 'security' }, { id: 'state', label: 'Remote state', x: 650, y: 120, kind: 'data' }],
        edges: [{ from: 'p1', to: 'lock', label: 'acquire' }, { from: 'p2', to: 'lock', label: 'wait/fail' }, { from: 'lock', to: 'state', animated: true }], sources: [s.tfLock, s.tfState] },
    },
    'Qual é a diferença entre module, resource e data source?': {
      answer: 'Resource declara um objeto que Terraform gerencia ao longo do ciclo de vida. Data source lê informação existente sem assumir seu lifecycle. Module agrupa resources, data sources e lógica HCL atrás de uma interface de variables e outputs para reutilização e composição.',
      diagram: { title: 'Resource, data source e module', description: 'Resource gerencia; data source consulta; module encapsula composição.', width: 980, height: 330,
        nodes: [{ id: 'module', label: 'Module', x: 30, y: 115, kind: 'control' }, { id: 'resource', label: 'Resource\nmanage lifecycle', x: 330, y: 35, kind: 'workload' }, { id: 'data', label: 'Data source\nread existing', x: 330, y: 195, kind: 'data' }, { id: 'provider', label: 'Provider API', x: 680, y: 115, kind: 'network' }],
        edges: [{ from: 'module', to: 'resource' }, { from: 'module', to: 'data' }, { from: 'resource', to: 'provider', bidirectional: true }, { from: 'data', to: 'provider', label: 'read' }], sources: [s.tfModules, s.tfData] },
    },
    'Qual é a diferença entre resource, data source, module e provider no Terraform?': {
      answer: 'Resource gerencia o lifecycle de um objeto; data source lê um objeto/dado existente; module encapsula uma composição reutilizável; provider é o plugin que traduz operações do Terraform para a API de um sistema externo e fornece os tipos de resources/data sources.',
      diagram: { title: 'Camadas de abstração do Terraform', description: 'Modules usam resources/data sources; estes são implementados por providers que conversam com APIs.', width: 1000, height: 330,
        nodes: [{ id: 'module', label: 'Module', x: 25, y: 110, kind: 'control' }, { id: 'resource', label: 'Resource', x: 270, y: 35, kind: 'workload' }, { id: 'data', label: 'Data source', x: 270, y: 195, kind: 'data' }, { id: 'provider', label: 'Provider plugin', x: 540, y: 110, kind: 'control' }, { id: 'api', label: 'Remote API', x: 800, y: 110, kind: 'network' }],
        edges: [{ from: 'module', to: 'resource' }, { from: 'module', to: 'data' }, { from: 'resource', to: 'provider' }, { from: 'data', to: 'provider' }, { from: 'provider', to: 'api', bidirectional: true }], sources: [s.tfModules, s.tfData] },
    },
  },
  ansible: {
    'O que significa idempotência no Ansible?': {
      answer: 'Uma operação idempotente converge o host para o estado desejado e, quando esse estado já foi atingido, uma nova execução não produz mudança. Muitos módulos implementam isso verificando o estado antes de agir. shell/command podem ser necessários, mas exigem guards como creates/removes ou changed_when para não reportar mudança sempre.',
      diagram: { title: 'Idempotência: convergir, depois no-op', description: 'A primeira execução pode mudar o host; execuções seguintes devem permanecer sem mudança quando o estado desejado já existe.', width: 950, height: 300,
        nodes: [{ id: 'desired', label: 'Desired state', x: 30, y: 100, kind: 'data' }, { id: 'module', label: 'Ansible module', x: 280, y: 100, kind: 'control' }, { id: 'host', label: 'Managed host', x: 530, y: 100, kind: 'workload' }, { id: 'again', label: 'Run again\nchanged=false', x: 770, y: 100, kind: 'decision' }],
        edges: [{ from: 'desired', to: 'module' }, { from: 'module', to: 'host', animated: true }, { from: 'host', to: 'again' }, { from: 'again', to: 'module' }], sources: [s.ansiblePlay] },
    },
    'Qual é a diferença entre task, handler e role?': {
      answer: 'Task é uma unidade de trabalho que invoca um módulo. Handler é uma task especial disparada por notify e normalmente executada ao final de uma seção do play quando houve mudança. Role é uma estrutura reutilizável que agrupa tasks, handlers, templates, defaults, vars e arquivos.',
      diagram: { title: 'Task, handler e role', description: 'A role contém componentes; tasks podem notificar handlers quando alteram o host.', width: 900, height: 320,
        nodes: [{ id: 'role', label: 'Role', x: 30, y: 110, kind: 'control' }, { id: 'task', label: 'Task', x: 300, y: 40, kind: 'workload' }, { id: 'handler', label: 'Handler', x: 300, y: 190, kind: 'control' }, { id: 'host', label: 'Host', x: 650, y: 110, kind: 'workload' }],
        edges: [{ from: 'role', to: 'task' }, { from: 'role', to: 'handler' }, { from: 'task', to: 'host' }, { from: 'task', to: 'handler', label: 'notify if changed' }, { from: 'handler', to: 'host' }], sources: [s.ansibleRoles, s.ansibleHandlers] },
    },
    'Quando usar Terraform e quando usar Ansible?': {
      answer: 'Terraform é mais adequado para provisionar e gerenciar infraestrutura declarativa por APIs com state explícito. Ansible é forte em configuração de sistemas, orquestração procedural/declarativa sem agent e operações remotas. Eles se complementam: Terraform pode criar hosts/redes e Ansible configurar software nesses hosts.',
      diagram: { title: 'Terraform provisiona; Ansible configura', description: 'A fronteira não é absoluta, mas separar lifecycle de infraestrutura da configuração reduz acoplamento.', width: 950, height: 300,
        nodes: [{ id: 'tf', label: 'Terraform', x: 30, y: 100, kind: 'control' }, { id: 'infra', label: 'VMs / networks / LB', x: 290, y: 100, kind: 'workload' }, { id: 'ansible', label: 'Ansible', x: 540, y: 100, kind: 'control' }, { id: 'config', label: 'Packages / files / services', x: 750, y: 100, kind: 'workload' }],
        edges: [{ from: 'tf', to: 'infra', label: 'provision' }, { from: 'infra', to: 'ansible', label: 'inventory/targets' }, { from: 'ansible', to: 'config', label: 'configure' }], sources: [s.ansiblePlay] },
    },
    'Como a idempotência funciona no Ansible e como diagnosticar uma task que sempre retorna changed?': {
      answer: 'Módulos idempotentes comparam o estado atual com o desejado. Se uma task sempre retorna changed, procure command/shell sem guards, templates com conteúdo não determinístico, timestamps, permissions/ownership divergentes, handlers ou módulos cujo changed_when esteja incorreto. Rode com --check --diff quando suportado e isole a task/host.',
      diagram: { title: 'Diagnóstico de changed=true permanente', description: 'Compare entrada determinística, estado real e regra changed antes de culpar o módulo.', width: 980, height: 320,
        nodes: [{ id: 'task', label: 'Task always changed', x: 30, y: 110, kind: 'decision' }, { id: 'input', label: 'Input deterministic?', x: 280, y: 35, kind: 'decision' }, { id: 'state', label: 'Desired == actual?', x: 280, y: 190, kind: 'decision' }, { id: 'rule', label: 'changed_when / guards', x: 560, y: 110, kind: 'control' }, { id: 'fix', label: 'Idempotent execution', x: 790, y: 110, kind: 'workload' }],
        edges: [{ from: 'task', to: 'input' }, { from: 'task', to: 'state' }, { from: 'input', to: 'rule' }, { from: 'state', to: 'rule' }, { from: 'rule', to: 'fix' }], sources: [s.ansiblePlay] },
    },
    'Como organizar roles, handlers e variable precedence sem criar configuração imprevisível?': {
      answer: 'Use roles coesas, defaults como valores substituíveis, vars apenas para valores que realmente não devem ser sobrescritos facilmente, group_vars/host_vars com escopo claro e extra-vars apenas para overrides intencionais. Handlers devem ter nomes estáveis e serem notificados somente por tasks que realmente mudam estado. Documente o contrato de cada role e evite depender de muitas camadas implícitas de precedence.',
      diagram: { title: 'Contrato previsível de uma role', description: 'Defaults e inputs entram na role; tasks mudam estado; handlers reagem a mudanças reais.', width: 940, height: 320,
        nodes: [{ id: 'defaults', label: 'defaults', x: 30, y: 35, kind: 'data' }, { id: 'inventory', label: 'inventory vars', x: 30, y: 190, kind: 'data' }, { id: 'role', label: 'Role contract', x: 330, y: 110, kind: 'control' }, { id: 'tasks', label: 'Tasks', x: 570, y: 35, kind: 'workload' }, { id: 'handlers', label: 'Handlers', x: 570, y: 190, kind: 'control' }, { id: 'host', label: 'Host', x: 790, y: 110, kind: 'workload' }],
        edges: [{ from: 'defaults', to: 'role' }, { from: 'inventory', to: 'role' }, { from: 'role', to: 'tasks' }, { from: 'tasks', to: 'handlers', label: 'notify' }, { from: 'tasks', to: 'host' }, { from: 'handlers', to: 'host' }], sources: [s.ansibleRoles, s.ansibleHandlers] },
    },
  },
  cicd: {
    'Qual é a diferença entre continuous delivery e continuous deployment?': {
      answer: 'Continuous Delivery mantém software sempre em estado implantável e automatiza o caminho até produção, mas pode exigir uma decisão manual para a promoção final. Continuous Deployment remove esse gate manual: toda mudança que passa pelos critérios automatizados é implantada em produção automaticamente.',
      diagram: { title: 'Delivery versus Deployment', description: 'A diferença principal está no gate final para produção.', width: 960, height: 320,
        nodes: [{ id: 'ci', label: 'CI passed', x: 30, y: 110, kind: 'decision' }, { id: 'stage', label: 'Release candidate', x: 270, y: 110, kind: 'data' }, { id: 'manual', label: 'Delivery\nmanual approval', x: 520, y: 35, kind: 'decision' }, { id: 'auto', label: 'Deployment\nautomated policy', x: 520, y: 190, kind: 'control' }, { id: 'prod', label: 'Production', x: 790, y: 110, kind: 'workload' }],
        edges: [{ from: 'ci', to: 'stage' }, { from: 'stage', to: 'manual' }, { from: 'stage', to: 'auto' }, { from: 'manual', to: 'prod' }, { from: 'auto', to: 'prod' }], sources: [s.gha] },
    },
    'Como o Argo CD detecta e corrige drift?': {
      answer: 'Argo CD renderiza o desired state da source e compara com os recursos vivos. Diferenças tornam a aplicação OutOfSync. Uma sincronização aplica o desired state; com automated sync e selfHeal, mudanças feitas diretamente no cluster podem ser revertidas automaticamente. Prune pode remover recursos que deixaram de existir no desired state.',
      diagram: { title: 'Loop de reconciliação do Argo CD', description: 'Git e cluster são continuamente comparados; sync faz o live state convergir para o desired state.', width: 960, height: 320,
        nodes: [{ id: 'git', label: 'Git desired', x: 30, y: 35, kind: 'data' }, { id: 'live', label: 'Cluster live', x: 30, y: 195, kind: 'workload' }, { id: 'argo', label: 'Argo CD compare', x: 330, y: 110, kind: 'control' }, { id: 'out', label: 'OutOfSync', x: 570, y: 110, kind: 'decision' }, { id: 'sync', label: 'Sync / self-heal', x: 790, y: 110, kind: 'control' }],
        edges: [{ from: 'git', to: 'argo' }, { from: 'live', to: 'argo' }, { from: 'argo', to: 'out' }, { from: 'out', to: 'sync' }, { from: 'sync', to: 'live', animated: true }], sources: [s.argoAuto] },
    },
    'Por que usar tags de imagem imutáveis?': {
      answer: 'Uma tag mutável como latest pode apontar para conteúdo diferente ao longo do tempo. Tags únicas por commit e, principalmente, digests permitem identificar exatamente qual imagem foi promovida, facilitando auditoria, reprodução e rollback. O ideal é que o desired state de produção identifique uma versão imutável.',
      diagram: { title: 'Referência imutável preserva identidade', description: 'O mesmo identificador deve resolver sempre para o mesmo conteúdo promovido.', width: 900, height: 300,
        nodes: [{ id: 'commit', label: 'Git SHA', x: 30, y: 100, kind: 'client' }, { id: 'build', label: 'Build', x: 250, y: 100, kind: 'control' }, { id: 'digest', label: 'image@sha256:abc', x: 470, y: 100, kind: 'data' }, { id: 'prod', label: 'Production', x: 700, y: 100, kind: 'workload' }],
        edges: [{ from: 'commit', to: 'build' }, { from: 'build', to: 'digest' }, { from: 'digest', to: 'prod', animated: true }], sources: [s.gha] },
    },
    'Qual é a diferença entre Continuous Delivery, Continuous Deployment e GitOps?': {
      answer: 'Continuous Delivery é a capacidade de manter mudanças prontas para produção com promoção final potencialmente manual. Continuous Deployment automatiza também essa promoção final. GitOps é um modelo operacional declarativo no qual Git representa o desired state e um reconciliador como Argo CD converge o ambiente continuamente. GitOps pode ser usado dentro de uma estratégia de Delivery ou Deployment.',
      diagram: { title: 'CI/CD e GitOps são dimensões diferentes', description: 'Delivery/Deployment descrevem promoção; GitOps descreve como desired state é reconciliado.', width: 1000, height: 330,
        nodes: [{ id: 'artifact', label: 'Validated artifact', x: 30, y: 110, kind: 'data' }, { id: 'delivery', label: 'Delivery\ngate possible', x: 290, y: 35, kind: 'decision' }, { id: 'deployment', label: 'Deployment\nauto promotion', x: 290, y: 190, kind: 'control' }, { id: 'git', label: 'Git desired state', x: 570, y: 110, kind: 'data' }, { id: 'reconcile', label: 'GitOps reconciler', x: 800, y: 110, kind: 'control' }],
        edges: [{ from: 'artifact', to: 'delivery' }, { from: 'artifact', to: 'deployment' }, { from: 'delivery', to: 'git' }, { from: 'deployment', to: 'git' }, { from: 'git', to: 'reconcile' }], sources: [s.gha, s.argoAuto] },
    },
    'Por que build once, promote many é preferível a recompilar por ambiente?': {
      answer: 'Recompilar por ambiente cria artefatos diferentes para o mesmo commit e reduz a garantia de que o que foi testado é exatamente o que chegou a produção. Build once gera um artefato imutável; cada ambiente injeta configuração externa e promove a mesma identidade de artefato.',
      diagram: { title: 'Um artefato, múltiplos ambientes', description: 'O binário/imagem não muda; configuração e políticas de ambiente mudam.', width: 950, height: 300,
        nodes: [{ id: 'build', label: 'Single build', x: 30, y: 100, kind: 'control' }, { id: 'artifact', label: 'Immutable artifact', x: 270, y: 100, kind: 'data' }, { id: 'dev', label: 'Dev', x: 550, y: 25, kind: 'workload' }, { id: 'stage', label: 'Staging', x: 550, y: 100, kind: 'workload' }, { id: 'prod', label: 'Prod', x: 550, y: 190, kind: 'workload' }],
        edges: [{ from: 'build', to: 'artifact' }, { from: 'artifact', to: 'dev' }, { from: 'artifact', to: 'stage' }, { from: 'artifact', to: 'prod' }], sources: [s.gha] },
    },
  },
};

export function getAutomationIacCoreInterviewVisual(articleSlug: string, question: string) {
  return visuals[articleSlug]?.[question];
}
