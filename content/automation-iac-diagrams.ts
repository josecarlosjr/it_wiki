import type { DiagramSpec, InterviewVisual } from './diagrams';

type Catalog = { sections: Record<string, DiagramSpec>; interviews: Record<string, InterviewVisual> };

const src = {
  helmCharts: { label: 'Helm — Charts', url: 'https://helm.sh/docs/topics/charts/' },
  helmTemplate: { label: 'Helm — Template functions and pipelines', url: 'https://helm.sh/docs/chart_template_guide/functions_and_pipelines/' },
  helmDeps: { label: 'Helm — Dependencies', url: 'https://helm.sh/docs/helm/helm_dependency/' },
  helmUpgrade: { label: 'Helm — Upgrade', url: 'https://helm.sh/docs/helm/helm_upgrade/' },
  tfModules: { label: 'Terraform — Modules', url: 'https://developer.hashicorp.com/terraform/language/modules' },
  tfState: { label: 'Terraform — State', url: 'https://developer.hashicorp.com/terraform/language/state' },
  tfWorkspaces: { label: 'Terraform — Workspaces', url: 'https://developer.hashicorp.com/terraform/language/state/workspaces' },
  tfImport: { label: 'Terraform — Import', url: 'https://developer.hashicorp.com/terraform/language/import' },
  tfRefresh: { label: 'Terraform — Refresh-only mode', url: 'https://developer.hashicorp.com/terraform/cli/commands/plan#refresh-only-mode' },
  tfStatePull: { label: 'Terraform — state pull', url: 'https://developer.hashicorp.com/terraform/cli/commands/state/pull' },
  tfStateRm: { label: 'Terraform — state rm', url: 'https://developer.hashicorp.com/terraform/cli/commands/state/rm' },
  tfMoved: { label: 'Terraform — moved blocks', url: 'https://developer.hashicorp.com/terraform/language/moved' },
  ansiblePlaybooks: { label: 'Ansible — Playbooks', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html' },
  ansibleRoles: { label: 'Ansible — Roles', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html' },
  ansibleVars: { label: 'Ansible — Variable precedence', url: 'https://docs.ansible.com/ansible/latest/reference_appendices/general_precedence.html' },
  ansibleVault: { label: 'Ansible — Vault', url: 'https://docs.ansible.com/ansible/latest/vault_guide/index.html' },
  ansibleCheck: { label: 'Ansible — Check and diff mode', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_checkmode.html' },
  ansibleStrategies: { label: 'Ansible — Strategies', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_strategies.html' },
  gha: { label: 'GitHub Actions — Workflows', url: 'https://docs.github.com/actions/writing-workflows/about-workflows' },
  ghaOidc: { label: 'GitHub Actions — OIDC', url: 'https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect' },
  argoAuto: { label: 'Argo CD — Automated Sync', url: 'https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/' },
  argoSync: { label: 'Argo CD — Sync phases and waves', url: 'https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/' },
  argoAppSet: { label: 'Argo CD — ApplicationSet', url: 'https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/' },
};

const helm: Catalog = {
  sections: {
    fundamentos: {
      title: 'Chart → templates → manifests → release',
      description: 'Um chart combina metadados, values e templates. O Helm renderiza manifests Kubernetes e registra a instalação como uma release.',
      width: 1000, height: 340,
      nodes: [
        { id: 'chart', label: 'Chart\nChart.yaml', x: 20, y: 120, kind: 'data' },
        { id: 'values', label: 'values.yaml\n+ overrides', x: 210, y: 40, kind: 'data' },
        { id: 'templates', label: 'templates/', x: 210, y: 200, kind: 'data' },
        { id: 'render', label: 'Helm renderer', x: 445, y: 120, kind: 'control' },
        { id: 'manifests', label: 'Kubernetes manifests', x: 670, y: 120, kind: 'workload' },
        { id: 'release', label: 'Release', x: 860, y: 120, kind: 'control' },
      ],
      edges: [
        { from: 'chart', to: 'render' }, { from: 'values', to: 'render' }, { from: 'templates', to: 'render' },
        { from: 'render', to: 'manifests', animated: true }, { from: 'manifests', to: 'release', animated: true },
      ],
      sources: [src.helmCharts],
    },
    templates: {
      title: 'Renderização e validação de templates',
      description: 'Templates recebem values, funções e pipelines. A validação deve acontecer antes do deploy com lint e renderização local.',
      width: 1040, height: 360,
      nodes: [
        { id: 'values', label: 'values', x: 20, y: 135, kind: 'data' },
        { id: 'helpers', label: '_helpers.tpl', x: 190, y: 55, kind: 'data' },
        { id: 'tpl', label: 'Templates', x: 190, y: 215, kind: 'data' },
        { id: 'render', label: 'helm template', x: 420, y: 135, kind: 'control' },
        { id: 'lint', label: 'helm lint', x: 630, y: 55, kind: 'decision' },
        { id: 'review', label: 'Rendered YAML\nreview/tests', x: 630, y: 215, kind: 'decision' },
        { id: 'deploy', label: 'helm upgrade --install', x: 850, y: 135, kind: 'workload' },
      ],
      edges: [
        { from: 'values', to: 'render' }, { from: 'helpers', to: 'render' }, { from: 'tpl', to: 'render' },
        { from: 'render', to: 'lint' }, { from: 'render', to: 'review' }, { from: 'lint', to: 'deploy' }, { from: 'review', to: 'deploy' },
      ],
      sources: [src.helmTemplate, src.helmUpgrade],
    },
    dependencias: {
      title: 'Chart pai, subcharts e configuração por ambiente',
      description: 'Dependências devem ter contratos claros. O chart pai coordena subcharts; ambientes devem sobrescrever apenas diferenças necessárias.',
      width: 980, height: 390,
      nodes: [
        { id: 'parent', label: 'Parent chart', x: 35, y: 150, kind: 'control' },
        { id: 'dep1', label: 'Subchart A', x: 300, y: 60, kind: 'workload' },
        { id: 'dep2', label: 'Subchart B', x: 300, y: 240, kind: 'workload' },
        { id: 'defaults', label: 'Default values', x: 545, y: 40, kind: 'data' },
        { id: 'env', label: 'Environment override', x: 545, y: 250, kind: 'data' },
        { id: 'rendered', label: 'Composed release', x: 795, y: 150, kind: 'workload' },
      ],
      edges: [
        { from: 'parent', to: 'dep1' }, { from: 'parent', to: 'dep2' }, { from: 'defaults', to: 'dep1' },
        { from: 'defaults', to: 'dep2' }, { from: 'env', to: 'parent' }, { from: 'dep1', to: 'rendered' }, { from: 'dep2', to: 'rendered' },
      ],
      sources: [src.helmDeps, src.helmCharts],
    },
    especialista: {
      title: 'Helm sob GitOps',
      description: 'Git mantém o estado desejado; Argo CD renderiza ou consome Helm e reconcilia o cluster. Rollback preferencialmente acontece revertendo Git.',
      width: 1050, height: 350,
      nodes: [
        { id: 'git', label: 'Git\nchart + values', x: 25, y: 125, kind: 'data' },
        { id: 'argo', label: 'Argo CD', x: 255, y: 125, kind: 'control' },
        { id: 'render', label: 'Helm render', x: 470, y: 50, kind: 'control' },
        { id: 'desired', label: 'Desired manifests', x: 470, y: 220, kind: 'data' },
        { id: 'cluster', label: 'Kubernetes cluster', x: 730, y: 125, kind: 'workload' },
        { id: 'diff', label: 'Diff / health / sync', x: 900, y: 125, width: 125, kind: 'decision' },
      ],
      edges: [
        { from: 'git', to: 'argo', animated: true }, { from: 'argo', to: 'render' }, { from: 'render', to: 'desired' },
        { from: 'desired', to: 'cluster', animated: true }, { from: 'cluster', to: 'diff', bidirectional: true }, { from: 'diff', to: 'argo' },
      ],
      sources: [src.helmUpgrade, src.argoAuto],
    },
  },
  interviews: {
    'Qual é a diferença entre chart e release?': {
      answer: 'Chart é o pacote versionado contendo templates, valores padrão e metadados. Release é uma instalação concreta desse chart, com nome, namespace, values efetivos e histórico de revisões.',
      diagram: { title: 'Chart reutilizável, releases concretas', description: 'Um mesmo chart pode originar múltiplas releases com configurações diferentes.', width: 900, height: 330,
        nodes: [{ id: 'chart', label: 'Chart', x: 40, y: 120, kind: 'data' }, { id: 'r1', label: 'Release dev', x: 350, y: 40, kind: 'workload' }, { id: 'r2', label: 'Release prod', x: 350, y: 200, kind: 'workload' }, { id: 'cluster', label: 'Kubernetes', x: 680, y: 120, kind: 'control' }],
        edges: [{ from: 'chart', to: 'r1' }, { from: 'chart', to: 'r2' }, { from: 'r1', to: 'cluster' }, { from: 'r2', to: 'cluster' }], sources: [src.helmCharts] },
    },
    'Como validar um chart antes do deploy?': {
      answer: 'Use helm lint para erros estruturais, helm template para inspecionar YAML renderizado, schemas para validar values quando aplicável e testes/policies sobre os manifests antes de executar helm upgrade --install.',
      diagram: { title: 'Pipeline de validação de chart', description: 'Valide estrutura, renderização e políticas antes do deploy.', width: 940, height: 300,
        nodes: [{ id: 'chart', label: 'Chart', x: 20, y: 100, kind: 'data' }, { id: 'lint', label: 'helm lint', x: 205, y: 100, kind: 'decision' }, { id: 'tpl', label: 'helm template', x: 390, y: 100, kind: 'control' }, { id: 'policy', label: 'Tests / policy', x: 585, y: 100, kind: 'security' }, { id: 'deploy', label: 'Deploy', x: 780, y: 100, kind: 'workload' }],
        edges: [{ from: 'chart', to: 'lint' }, { from: 'lint', to: 'tpl' }, { from: 'tpl', to: 'policy' }, { from: 'policy', to: 'deploy' }], sources: [src.helmTemplate, src.helmUpgrade] },
    },
    'Como usar Helm com Argo CD?': {
      answer: 'Argo CD pode apontar para um chart ou para um chart versionado no Git, fornecer values e comparar os manifests renderizados com o estado vivo. Em GitOps, alterações e rollbacks devem preferencialmente ser expressos no Git para preservar auditoria.',
      diagram: { title: 'Helm renderizado pelo Argo CD', description: 'Argo CD usa Git como fonte de verdade e o Helm como motor de renderização.', width: 900, height: 300,
        nodes: [{ id: 'git', label: 'Git', x: 30, y: 100, kind: 'data' }, { id: 'argo', label: 'Argo CD', x: 250, y: 100, kind: 'control' }, { id: 'helm', label: 'Helm', x: 450, y: 100, kind: 'control' }, { id: 'cluster', label: 'Cluster', x: 680, y: 100, kind: 'workload' }],
        edges: [{ from: 'git', to: 'argo' }, { from: 'argo', to: 'helm' }, { from: 'helm', to: 'cluster', animated: true }, { from: 'cluster', to: 'argo', label: 'live state' }], sources: [src.argoAuto, src.helmCharts] },
    },
  },
};

const terraform: Catalog = {
  sections: {
    fundamentos: {
      title: 'Configuração declarativa → grafo → plano → apply',
      description: 'Terraform descreve estado desejado, constrói um grafo de dependências, compara configuração/estado/realidade e executa as mudanças planejadas.',
      width: 1050, height: 360,
      nodes: [
        { id: 'hcl', label: 'HCL config', x: 20, y: 130, kind: 'data' }, { id: 'providers', label: 'Providers', x: 200, y: 45, kind: 'control' },
        { id: 'graph', label: 'Dependency graph', x: 405, y: 130, kind: 'control' }, { id: 'state', label: 'State', x: 200, y: 235, kind: 'data' },
        { id: 'plan', label: 'terraform plan', x: 625, y: 130, kind: 'decision' }, { id: 'apply', label: 'terraform apply', x: 830, y: 130, kind: 'workload' },
      ],
      edges: [{ from: 'hcl', to: 'graph' }, { from: 'providers', to: 'graph' }, { from: 'state', to: 'graph' }, { from: 'graph', to: 'plan' }, { from: 'plan', to: 'apply', animated: true }],
      sources: [src.tfState],
    },
    'state-modulos': {
      title: 'Root module, child modules e state remoto',
      description: 'Módulos encapsulam recursos e expõem variables/outputs. O state remoto é compartilhado com proteção, locking quando suportado e controle de acesso.',
      width: 1080, height: 420,
      nodes: [
        { id: 'root', label: 'Root module', x: 25, y: 165, kind: 'control' }, { id: 'net', label: 'module.network', x: 285, y: 65, kind: 'workload' },
        { id: 'app', label: 'module.app', x: 285, y: 165, kind: 'workload' }, { id: 'db', label: 'module.database', x: 285, y: 265, kind: 'workload' },
        { id: 'state', label: 'Remote state', x: 585, y: 165, kind: 'data' }, { id: 'lock', label: 'Lock / concurrency', x: 800, y: 65, kind: 'security' },
        { id: 'acl', label: 'Encryption + access control', x: 800, y: 265, kind: 'security' },
      ],
      edges: [{ from: 'root', to: 'net' }, { from: 'root', to: 'app' }, { from: 'root', to: 'db' }, { from: 'net', to: 'state' }, { from: 'app', to: 'state' }, { from: 'db', to: 'state' }, { from: 'state', to: 'lock' }, { from: 'state', to: 'acl' }],
      sources: [src.tfModules, src.tfState],
    },
    ciclo: {
      title: 'Refatoração segura e reconciliação de identidade',
      description: 'Import, moved blocks e operações de state tratam identidade de recursos. O objetivo é alinhar configuração, state e infraestrutura sem recriação indevida.',
      width: 1080, height: 400,
      nodes: [
        { id: 'real', label: 'Existing infrastructure', x: 25, y: 150, kind: 'workload' }, { id: 'import', label: 'import block / terraform import', x: 275, y: 65, kind: 'control' },
        { id: 'state', label: 'State identity', x: 525, y: 150, kind: 'data' }, { id: 'moved', label: 'moved block', x: 275, y: 245, kind: 'control' },
        { id: 'config', label: 'Refactored HCL', x: 760, y: 65, kind: 'data' }, { id: 'plan', label: 'Plan without unintended recreate', x: 760, y: 245, kind: 'decision' },
      ],
      edges: [{ from: 'real', to: 'import' }, { from: 'import', to: 'state' }, { from: 'moved', to: 'state' }, { from: 'state', to: 'config' }, { from: 'config', to: 'plan' }, { from: 'state', to: 'plan' }],
      sources: [src.tfImport, src.tfMoved, src.tfStateRm],
    },
    especialista: {
      title: 'Pipeline de governança e drift',
      description: 'CI valida e gera plan; revisão/policy decide promoção; apply usa o artefato aprovado. Detecção de drift compara estado desejado e realidade antes de qualquer correção.',
      width: 1120, height: 380,
      nodes: [
        { id: 'pr', label: 'Pull Request', x: 20, y: 135, kind: 'client' }, { id: 'validate', label: 'fmt / validate / tests', x: 205, y: 50, kind: 'decision' },
        { id: 'plan', label: 'Saved plan', x: 410, y: 135, kind: 'data' }, { id: 'policy', label: 'Policy + approval', x: 620, y: 50, kind: 'security' },
        { id: 'apply', label: 'Apply approved plan', x: 825, y: 135, kind: 'control' }, { id: 'infra', label: 'Infrastructure', x: 1010, y: 135, width: 95, kind: 'workload' },
        { id: 'drift', label: 'Scheduled refresh-only\n/ plan', x: 620, y: 245, kind: 'decision' },
      ],
      edges: [{ from: 'pr', to: 'validate' }, { from: 'validate', to: 'plan' }, { from: 'plan', to: 'policy' }, { from: 'policy', to: 'apply' }, { from: 'apply', to: 'infra', animated: true }, { from: 'infra', to: 'drift' }, { from: 'drift', to: 'plan' }],
      sources: [src.tfRefresh, src.tfState],
    },
  },
  interviews: {},
};

const ansible: Catalog = {
  sections: {
    fundamentos: {
      title: 'Control node → inventory → playbook → managed nodes',
      description: 'Ansible é normalmente agentless: o control node seleciona hosts pelo inventory e executa módulos definidos por tasks no playbook.',
      width: 1040, height: 350,
      nodes: [
        { id: 'control', label: 'Control node', x: 25, y: 120, kind: 'control' }, { id: 'inventory', label: 'Inventory', x: 210, y: 40, kind: 'data' },
        { id: 'playbook', label: 'Playbook', x: 210, y: 205, kind: 'data' }, { id: 'engine', label: 'Ansible engine', x: 430, y: 120, kind: 'control' },
        { id: 'h1', label: 'Host A', x: 690, y: 35, kind: 'workload' }, { id: 'h2', label: 'Host B', x: 690, y: 130, kind: 'workload' }, { id: 'h3', label: 'Host C', x: 690, y: 225, kind: 'workload' },
      ],
      edges: [{ from: 'inventory', to: 'engine' }, { from: 'playbook', to: 'engine' }, { from: 'control', to: 'engine' }, { from: 'engine', to: 'h1', label: 'SSH/WinRM' }, { from: 'engine', to: 'h2', label: 'SSH/WinRM' }, { from: 'engine', to: 'h3', label: 'SSH/WinRM' }],
      sources: [src.ansiblePlaybooks],
    },
    roles: {
      title: 'Roles, handlers e precedence de variáveis',
      description: 'Roles organizam reutilização. Variáveis entram por múltiplas fontes e seguem regras de precedência; handlers executam ações notificadas apenas quando há mudança.',
      width: 1050, height: 400,
      nodes: [
        { id: 'role', label: 'Role', x: 30, y: 155, kind: 'control' }, { id: 'tasks', label: 'tasks/', x: 250, y: 45, kind: 'data' }, { id: 'templates', label: 'templates/', x: 250, y: 145, kind: 'data' },
        { id: 'handlers', label: 'handlers/', x: 250, y: 245, kind: 'data' }, { id: 'vars', label: 'defaults / vars / inventory / extra-vars', x: 520, y: 45, kind: 'decision' },
        { id: 'host', label: 'Managed host', x: 790, y: 155, kind: 'workload' }, { id: 'service', label: 'Handler: restart service\nonly if notified', x: 520, y: 245, kind: 'control' },
      ],
      edges: [{ from: 'role', to: 'tasks' }, { from: 'role', to: 'templates' }, { from: 'role', to: 'handlers' }, { from: 'vars', to: 'tasks' }, { from: 'tasks', to: 'host' }, { from: 'templates', to: 'host' }, { from: 'tasks', to: 'service', label: 'notify on changed' }, { from: 'service', to: 'host' }],
      sources: [src.ansibleRoles, src.ansibleVars],
    },
    seguranca: {
      title: 'Execução segura: Vault, check mode, diff, become e serial',
      description: 'Antes de mudanças amplas, valide o impacto. Vault protege conteúdo em repouso; check/diff ajudam revisão; serial limita blast radius e become eleva privilégio apenas quando necessário.',
      width: 1100, height: 360,
      nodes: [
        { id: 'git', label: 'Playbook + encrypted vars', x: 20, y: 130, kind: 'data' }, { id: 'vault', label: 'Ansible Vault', x: 225, y: 50, kind: 'security' },
        { id: 'check', label: '--check --diff', x: 225, y: 220, kind: 'decision' }, { id: 'review', label: 'Review change set', x: 465, y: 130, kind: 'decision' },
        { id: 'serial', label: 'serial / batches', x: 680, y: 50, kind: 'control' }, { id: 'become', label: 'become per task', x: 680, y: 220, kind: 'security' }, { id: 'hosts', label: 'Managed nodes', x: 900, y: 130, kind: 'workload' },
      ],
      edges: [{ from: 'git', to: 'vault' }, { from: 'git', to: 'check' }, { from: 'vault', to: 'review' }, { from: 'check', to: 'review' }, { from: 'review', to: 'serial' }, { from: 'review', to: 'become' }, { from: 'serial', to: 'hosts' }, { from: 'become', to: 'hosts' }],
      sources: [src.ansibleVault, src.ansibleCheck, src.ansibleStrategies],
    },
    especialista: {
      title: 'Automação em escala com inventories dinâmicos e execution environments',
      description: 'Em escala, inventário vem de APIs/CMDBs, execution environments fixam dependências e a execução precisa ser observável, testável e controlada por lotes.',
      width: 1100, height: 390,
      nodes: [
        { id: 'cloud', label: 'Cloud / CMDB API', x: 20, y: 130, kind: 'network' }, { id: 'inventory', label: 'Dynamic inventory', x: 225, y: 130, kind: 'data' },
        { id: 'ee', label: 'Execution Environment\ncollections + runtime', x: 450, y: 45, kind: 'workload' }, { id: 'tests', label: 'Role tests / lint', x: 450, y: 220, kind: 'decision' },
        { id: 'controller', label: 'Automation controller', x: 700, y: 130, kind: 'control' }, { id: 'fleet', label: 'Large host fleet', x: 920, y: 130, kind: 'workload' },
      ],
      edges: [{ from: 'cloud', to: 'inventory' }, { from: 'inventory', to: 'controller' }, { from: 'ee', to: 'controller' }, { from: 'tests', to: 'controller' }, { from: 'controller', to: 'fleet', animated: true }],
      sources: [src.ansibleStrategies, src.ansibleRoles],
    },
  }, interviews: {},
};

const cicd: Catalog = {
  sections: {
    fundamentos: {
      title: 'Continuous Integration: feedback rápido por commit',
      description: 'Cada mudança passa por checkout, build, lint, testes e geração de artefato. Falhas devem aparecer cedo e bloquear promoção.',
      width: 1060, height: 320,
      nodes: [
        { id: 'commit', label: 'Commit / PR', x: 20, y: 105, kind: 'client' }, { id: 'checkout', label: 'Checkout', x: 190, y: 105, kind: 'control' },
        { id: 'lint', label: 'Lint / typecheck', x: 360, y: 35, kind: 'decision' }, { id: 'test', label: 'Tests', x: 360, y: 175, kind: 'decision' },
        { id: 'build', label: 'Build once', x: 580, y: 105, kind: 'control' }, { id: 'artifact', label: 'Immutable artifact', x: 790, y: 105, kind: 'data' },
      ],
      edges: [{ from: 'commit', to: 'checkout' }, { from: 'checkout', to: 'lint' }, { from: 'checkout', to: 'test' }, { from: 'lint', to: 'build' }, { from: 'test', to: 'build' }, { from: 'build', to: 'artifact', animated: true }],
      sources: [src.gha],
    },
    entrega: {
      title: 'Promotion: o mesmo artefato atravessa ambientes',
      description: 'O artefato deve ser construído uma vez e promovido por ambientes com configuração externa, gates e rollback.',
      width: 1080, height: 350,
      nodes: [
        { id: 'artifact', label: 'artifact@digest', x: 20, y: 125, kind: 'data' }, { id: 'dev', label: 'Dev', x: 220, y: 45, kind: 'workload' },
        { id: 'stage', label: 'Staging', x: 450, y: 125, kind: 'workload' }, { id: 'approve', label: 'Approval / policy', x: 670, y: 45, kind: 'security' },
        { id: 'prod', label: 'Production', x: 875, y: 125, kind: 'workload' }, { id: 'rollback', label: 'Rollback to known digest', x: 670, y: 230, kind: 'decision' },
      ],
      edges: [{ from: 'artifact', to: 'dev' }, { from: 'dev', to: 'stage' }, { from: 'stage', to: 'approve' }, { from: 'approve', to: 'prod', animated: true }, { from: 'prod', to: 'rollback' }, { from: 'rollback', to: 'prod' }],
      sources: [src.gha],
    },
    gitops: {
      title: 'GitOps: reconciliação contínua de estado desejado',
      description: 'CI publica o artefato e atualiza a referência declarativa no Git. Argo CD compara desired vs live e sincroniza conforme a política configurada.',
      width: 1120, height: 390,
      nodes: [
        { id: 'source', label: 'Source Git', x: 20, y: 70, kind: 'data' }, { id: 'ci', label: 'GitHub Actions', x: 220, y: 70, kind: 'control' },
        { id: 'registry', label: 'Image registry\nsha digest', x: 440, y: 25, kind: 'data' }, { id: 'config', label: 'GitOps repo / values', x: 440, y: 190, kind: 'data' },
        { id: 'argo', label: 'Argo CD', x: 690, y: 120, kind: 'control' }, { id: 'cluster', label: 'Kubernetes', x: 900, y: 120, kind: 'workload' },
        { id: 'drift', label: 'OutOfSync / health', x: 900, y: 260, kind: 'decision' },
      ],
      edges: [{ from: 'source', to: 'ci' }, { from: 'ci', to: 'registry' }, { from: 'ci', to: 'config' }, { from: 'config', to: 'argo', animated: true }, { from: 'argo', to: 'cluster', animated: true }, { from: 'cluster', to: 'drift' }, { from: 'drift', to: 'argo' }],
      sources: [src.gha, src.argoAuto],
    },
    especialista: {
      title: 'Supply chain, OIDC e orquestração de sync',
      description: 'Pipelines especialistas reduzem credenciais persistentes com OIDC, usam provenance/SBOM/policies e controlam ordem de implantação com phases/waves quando necessário.',
      width: 1120, height: 370,
      nodes: [
        { id: 'workflow', label: 'Workflow identity', x: 20, y: 130, kind: 'control' }, { id: 'oidc', label: 'OIDC federation', x: 220, y: 45, kind: 'security' },
        { id: 'artifact', label: 'Artifact + provenance', x: 220, y: 220, kind: 'data' }, { id: 'policy', label: 'Policy verification', x: 470, y: 130, kind: 'security' },
        { id: 'waves', label: 'Argo sync phases / waves', x: 705, y: 130, kind: 'control' }, { id: 'prod', label: 'Production', x: 955, y: 130, kind: 'workload' },
      ],
      edges: [{ from: 'workflow', to: 'oidc' }, { from: 'workflow', to: 'artifact' }, { from: 'oidc', to: 'policy' }, { from: 'artifact', to: 'policy' }, { from: 'policy', to: 'waves' }, { from: 'waves', to: 'prod', animated: true }],
      sources: [src.ghaOidc, src.argoSync],
    },
  }, interviews: {},
};

const catalogs: Record<string, Catalog> = { helm, terraform, ansible, cicd };

const extraQuestions: Record<string, string[]> = {
  terraform: [
    'Qual é a diferença entre resource, data source, module e provider no Terraform?',
    'Quando usar Terraform workspaces e quando evitar workspaces?',
    'Como investigar e recuperar um state file inconsistente ou perdido?',
    'Como corrigir drift sem destruir recursos?',
  ],
  ansible: [
    'Como a idempotência funciona no Ansible e como diagnosticar uma task que sempre retorna changed?',
    'Como organizar roles, handlers e variable precedence sem criar configuração imprevisível?',
    'Como fazer rollout seguro em centenas de hosts?',
    'Como investigar um playbook que funciona em um host e falha em outro?',
  ],
  cicd: [
    'Qual é a diferença entre Continuous Delivery, Continuous Deployment e GitOps?',
    'Por que build once, promote many é preferível a recompilar por ambiente?',
    'Como Argo CD detecta drift e quando usar self-heal e prune?',
    'Como reduzir o risco de secrets de longa duração em pipelines?',
  ],
  helm: [
    'Como tratar secrets e values por ambiente em Helm sem duplicar charts?',
    'Como diagnosticar um helm upgrade que falha ou deixa a release em estado inconsistente?',
  ],
};

const extraInterviewVisuals: Record<string, Record<string, InterviewVisual>> = {
  terraform: {
    'Quando usar Terraform workspaces e quando evitar workspaces?': {
      answer: 'Workspaces permitem múltiplas instâncias de state para a mesma configuração e são úteis quando os ambientes têm estrutura praticamente idêntica. Evite usá-los como única estratégia quando ambientes exigem credenciais, backends, topologias, políticas ou ciclos de vida muito diferentes; nesses casos, diretórios/root modules separados costumam oferecer isolamento mais explícito.',
      diagram: { title: 'Workspace: mesma configuração, state separado', description: 'O código é compartilhado, mas cada workspace mantém sua própria instância de state.', width: 920, height: 340,
        nodes: [{ id: 'code', label: 'Same root module', x: 30, y: 115, kind: 'data' }, { id: 'dev', label: 'workspace dev\nstate A', x: 330, y: 35, kind: 'data' }, { id: 'prod', label: 'workspace prod\nstate B', x: 330, y: 195, kind: 'data' }, { id: 'infra1', label: 'Dev resources', x: 660, y: 35, kind: 'workload' }, { id: 'infra2', label: 'Prod resources', x: 660, y: 195, kind: 'workload' }],
        edges: [{ from: 'code', to: 'dev' }, { from: 'code', to: 'prod' }, { from: 'dev', to: 'infra1' }, { from: 'prod', to: 'infra2' }], sources: [src.tfWorkspaces] },
    },
    'Como investigar e recuperar um state file inconsistente ou perdido?': {
      answer: 'Primeiro pare applies concorrentes e preserve cópias do backend. Use terraform state pull para exportar o state atual quando acessível. Compare configuração, state e infraestrutura real com plan. Para recursos existentes ausentes do state, use import blocks ou terraform import. Para recursos removidos da configuração mas ainda no state, avalie state rm somente com entendimento do impacto. Se a intenção é aceitar alterações externas, refresh-only ajuda a revisar e atualizar o state. Nunca edite state manualmente como primeira opção; tenha versionamento/backup do backend e valide tudo com plan antes do apply.',
      diagram: { title: 'Recuperação de state: preservar → diagnosticar → reconciliar', description: 'A recuperação segura começa por backup e observação antes de qualquer mutação do state.', width: 1080, height: 360,
        nodes: [{ id: 'stop', label: 'Stop concurrent applies', x: 20, y: 120, kind: 'security' }, { id: 'backup', label: 'Backup / state pull', x: 220, y: 40, kind: 'data' }, { id: 'plan', label: 'terraform plan', x: 430, y: 120, kind: 'decision' }, { id: 'missing', label: 'Existing resource\nmissing in state → import', x: 650, y: 35, kind: 'control' }, { id: 'stale', label: 'State stale\n→ refresh-only', x: 650, y: 205, kind: 'control' }, { id: 'verify', label: 'Plan again\nthen apply', x: 900, y: 120, kind: 'decision' }],
        edges: [{ from: 'stop', to: 'backup' }, { from: 'backup', to: 'plan' }, { from: 'plan', to: 'missing' }, { from: 'plan', to: 'stale' }, { from: 'missing', to: 'verify' }, { from: 'stale', to: 'verify' }], sources: [src.tfStatePull, src.tfImport, src.tfRefresh] },
    },
    'Como corrigir drift sem destruir recursos?': {
      answer: 'Identifique primeiro se o drift é legítimo ou não. Se a infraestrutura real deve voltar ao código, revise plan e aplique a configuração desejada. Se a mudança externa é válida, atualize o código e use refresh-only quando necessário para alinhar o state. Se um recurso existe mas não está gerenciado, importe-o. Para refatorações de endereço, use moved blocks em vez de remover/recriar identidade.',
      diagram: { title: 'Decisão de correção de drift', description: 'Drift não deve ser corrigido automaticamente sem decidir qual estado é a fonte correta.', width: 980, height: 350,
        nodes: [{ id: 'drift', label: 'Drift detected', x: 30, y: 120, kind: 'decision' }, { id: 'desired', label: 'Code is correct?', x: 270, y: 120, kind: 'decision' }, { id: 'apply', label: 'Apply desired config', x: 540, y: 35, kind: 'control' }, { id: 'adopt', label: 'Update HCL + refresh/import', x: 540, y: 205, kind: 'control' }, { id: 'plan', label: 'Review plan', x: 800, y: 120, kind: 'decision' }],
        edges: [{ from: 'drift', to: 'desired' }, { from: 'desired', to: 'apply', label: 'yes' }, { from: 'desired', to: 'adopt', label: 'no' }, { from: 'apply', to: 'plan' }, { from: 'adopt', to: 'plan' }], sources: [src.tfRefresh, src.tfImport, src.tfMoved] },
    },
  },
  ansible: {
    'Como fazer rollout seguro em centenas de hosts?': {
      answer: 'Use batches com serial, health checks entre lotes, handlers apenas quando mudanças ocorrerem, failure thresholds apropriados e, quando necessário, max_fail_percentage/any_errors_fatal. Valide primeiro com check/diff em subconjuntos e use inventories/grupos para limitar o blast radius.',
      diagram: { title: 'Rollout em batches', description: 'O controlador aplica mudanças em pequenos grupos e só avança após validação.', width: 980, height: 320,
        nodes: [{ id: 'ctl', label: 'Controller', x: 20, y: 105, kind: 'control' }, { id: 'b1', label: 'Batch 1\n10 hosts', x: 240, y: 35, kind: 'workload' }, { id: 'check', label: 'Health validation', x: 470, y: 105, kind: 'decision' }, { id: 'b2', label: 'Batch 2\n10 hosts', x: 700, y: 35, kind: 'workload' }, { id: 'rest', label: 'Remaining fleet', x: 700, y: 190, kind: 'workload' }],
        edges: [{ from: 'ctl', to: 'b1' }, { from: 'b1', to: 'check' }, { from: 'check', to: 'b2', label: 'healthy' }, { from: 'check', to: 'rest', label: 'continue batches' }], sources: [src.ansibleStrategies] },
    },
    'Como investigar um playbook que funciona em um host e falha em outro?': {
      answer: 'Compare inventory e variables efetivas, facts, versão do SO/pacotes, conectividade, usuário/become, Python/interpreter discovery e output com maior verbosity. Use --limit para reproduzir no host afetado, --check quando seguro, debug/assert para hipóteses e ansible-inventory para inspecionar a composição do inventory.',
      diagram: { title: 'Troubleshooting por diferenças entre hosts', description: 'O objetivo é encontrar a primeira divergência entre contexto, variáveis, dependências e privilégios.', width: 1040, height: 340,
        nodes: [{ id: 'fail', label: 'Host B fails', x: 20, y: 115, kind: 'decision' }, { id: 'inv', label: 'Inventory / vars', x: 230, y: 35, kind: 'data' }, { id: 'facts', label: 'Facts / OS / interpreter', x: 230, y: 195, kind: 'data' }, { id: 'auth', label: 'SSH / become', x: 480, y: 35, kind: 'security' }, { id: 'verbose', label: '-vvv + --limit', x: 480, y: 195, kind: 'control' }, { id: 'root', label: 'First differing condition', x: 760, y: 115, kind: 'decision' }],
        edges: [{ from: 'fail', to: 'inv' }, { from: 'fail', to: 'facts' }, { from: 'inv', to: 'auth' }, { from: 'facts', to: 'verbose' }, { from: 'auth', to: 'root' }, { from: 'verbose', to: 'root' }], sources: [src.ansibleVars, src.ansiblePlaybooks] },
    },
  },
  cicd: {
    'Como Argo CD detecta drift e quando usar self-heal e prune?': {
      answer: 'Argo CD compara o estado desejado renderizado da source com os recursos vivos. Self-heal faz o controlador corrigir mudanças feitas fora do Git quando a aplicação fica OutOfSync. Prune remove recursos que existiam no estado desejado e deixaram de existir. Ambos devem ser habilitados conscientemente, porque podem reverter hotfixes manuais ou remover objetos não planejados.',
      diagram: { title: 'Desired vs live → OutOfSync → reconcile', description: 'Drift é uma diferença entre Git e o cluster; self-heal reaplica desired state e prune remove recursos órfãos do desired state.', width: 980, height: 330,
        nodes: [{ id: 'git', label: 'Git desired state', x: 30, y: 40, kind: 'data' }, { id: 'live', label: 'Cluster live state', x: 30, y: 200, kind: 'workload' }, { id: 'compare', label: 'Argo compare', x: 300, y: 120, kind: 'control' }, { id: 'diff', label: 'OutOfSync?', x: 540, y: 120, kind: 'decision' }, { id: 'heal', label: 'self-heal', x: 760, y: 40, kind: 'control' }, { id: 'prune', label: 'prune', x: 760, y: 200, kind: 'control' }],
        edges: [{ from: 'git', to: 'compare' }, { from: 'live', to: 'compare' }, { from: 'compare', to: 'diff' }, { from: 'diff', to: 'heal' }, { from: 'diff', to: 'prune' }], sources: [src.argoAuto] },
    },
    'Como reduzir o risco de secrets de longa duração em pipelines?': {
      answer: 'Prefira identidade federada/OIDC para obter credenciais temporárias do provedor em vez de armazenar access keys persistentes. Restrinja subject/audience, permissions do workflow, environments e approvals, e mantenha secrets restantes com escopo mínimo e rotação.',
      diagram: { title: 'OIDC em vez de credencial estática', description: 'O workflow troca um token OIDC por credenciais temporárias e limitadas no provedor.', width: 920, height: 300,
        nodes: [{ id: 'gha', label: 'GitHub Actions', x: 30, y: 100, kind: 'control' }, { id: 'token', label: 'OIDC token', x: 250, y: 100, kind: 'security' }, { id: 'idp', label: 'Cloud STS / IdP', x: 470, y: 100, kind: 'security' }, { id: 'temp', label: 'Temporary credentials', x: 700, y: 100, kind: 'data' }],
        edges: [{ from: 'gha', to: 'token' }, { from: 'token', to: 'idp' }, { from: 'idp', to: 'temp', animated: true }], sources: [src.ghaOidc] },
    },
  },
};

for (const [slug, visuals] of Object.entries(extraInterviewVisuals)) {
  Object.assign(catalogs[slug].interviews, visuals);
}

export function getAutomationIacSectionDiagram(articleSlug: string, sectionId: string) {
  return catalogs[articleSlug]?.sections[sectionId];
}

export function getAutomationIacInterviewVisual(articleSlug: string, question: string) {
  return catalogs[articleSlug]?.interviews[question];
}

export function getAutomationIacExtraQuestions(articleSlug: string) {
  return extraQuestions[articleSlug] ?? [];
}
