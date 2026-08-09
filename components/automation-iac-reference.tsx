'use client';

import { useLanguage } from './language-provider';

type ReferenceProps = { articleSlug: string };
type Row = { code: string; text: string };
type Block = { title: string; level: string; summary: string; rows: Row[] };

const pt: Record<string, Block[]> = {
  terraform: [
    { title: 'Paradigma declarativo e ciclo básico', level: 'Fundamentos', summary: 'Terraform descreve o estado desejado e calcula como chegar até ele; não é um script imperativo de passos.', rows: [
      { code: 'terraform init', text: 'Inicializa providers, modules e backend. Execute após alterar backend ou dependências.' }, { code: 'terraform fmt -check && terraform validate', text: 'Padroniza HCL e valida a configuração antes do plan.' }, { code: 'terraform plan -out=tfplan', text: 'Calcula o plano e o grava para que a revisão corresponda ao artefato posteriormente aplicado.' }, { code: 'terraform apply tfplan', text: 'Aplica exatamente o plano salvo. Em CI reduz a janela entre revisão e execução.' },
    ]},
    { title: 'Módulos e composição', level: 'Intermediário', summary: 'Use módulos para encapsular padrões com interfaces pequenas. O root module compõe child modules.', rows: [
      { code: 'module "network" { source = "./modules/network" ... }', text: 'Invoca um child module local. Variables são entradas; outputs formam a interface de saída.' }, { code: 'module "vpc" { source = "git::https://...//modules/vpc?ref=v1.4.0" }', text: 'Em módulos remotos, fixe versões/tags para reprodutibilidade.' }, { code: 'output "subnet_ids" { value = module.network.subnet_ids }', text: 'Propaga saídas necessárias sem expor toda a implementação do módulo.' }, { code: 'Princípio', text: 'Evite módulos gigantes. Prefira unidades coesas por responsabilidade e composição explícita no root module.' },
    ]},
    { title: 'Workspaces e isolamento', level: 'Avançado', summary: 'Workspaces separam state para a mesma configuração. São úteis, mas não substituem isolamento arquitetural quando ambientes divergem muito.', rows: [
      { code: 'terraform workspace list', text: 'Lista workspaces e indica o atual.' }, { code: 'terraform workspace new dev', text: 'Cria outro state lógico para a mesma configuração.' }, { code: 'terraform workspace select prod', text: 'Troca a instância de state usada pelo root module.' }, { code: 'Evite quando', text: 'Prod/dev usam contas, backends, políticas, topologias ou ciclos de vida muito diferentes. Nesse caso, root modules separados são mais explícitos.' },
    ]},
    { title: 'State file: melhores práticas', level: 'Avançado', summary: 'O state é parte crítica do sistema de controle do Terraform. Trate-o como dado sensível e operacionalmente indispensável.', rows: [
      { code: 'Remote backend', text: 'Centralize o state; habilite locking quando suportado; use criptografia, versionamento e controles de acesso.' }, { code: 'terraform state pull > backup.tfstate', text: 'Exporta uma cópia do state atual. Útil antes de troubleshooting ou operações de state.' }, { code: 'Nunca versionar terraform.tfstate no Git', text: 'O state pode conter IDs, endpoints e dados sensíveis; também cria risco de concorrência e corrupção.' }, { code: 'Uma state boundary por blast radius', text: 'Separe states quando componentes tiverem ciclos de vida, ownership ou impacto operacional distintos.' },
    ]},
    { title: 'Drift e recuperação de state', level: 'Especialista', summary: 'Recuperação segura exige distinguir configuração, state e infraestrutura real. Preserve evidências antes de alterar state.', rows: [
      { code: 'terraform plan -refresh-only', text: 'Mostra mudanças necessárias apenas para atualizar o state com alterações externas. Revise antes de aplicar.' }, { code: 'terraform import aws_s3_bucket.logs my-bucket', text: 'Associa um recurso existente ao endereço do Terraform quando ele existe fora do state.' }, { code: 'import { to = aws_s3_bucket.logs id = "my-bucket" }', text: 'Forma declarativa de import, adequada a workflows revisáveis.' }, { code: 'moved { from = aws_instance.old to = module.compute.aws_instance.main }', text: 'Preserva identidade durante refatoração e evita destroy/create desnecessário.' }, { code: 'terraform state rm <address>', text: 'Faz Terraform esquecer um recurso sem destruí-lo. Use apenas quando essa for deliberadamente a intenção.' }, { code: 'Sequência de recuperação', text: 'Pare applies concorrentes → faça backup/state pull → rode plan → identifique missing/stale addresses → import/refresh/moved conforme o caso → rode plan novamente → só então apply.' },
    ]},
  ],
  ansible: [
    { title: 'Inventory, playbooks e idempotência', level: 'Fundamentos', summary: 'Playbooks descrevem estado/ações sobre grupos de hosts; módulos devem ser preferidos a shell commands quando há módulo idempotente equivalente.', rows: [
      { code: 'ansible all -m ping', text: 'Valida conectividade básica, autenticação e execução de módulo.' }, { code: 'ansible-playbook site.yml --syntax-check', text: 'Valida sintaxe antes da execução.' }, { code: 'ansible-playbook site.yml --check --diff', text: 'Simula mudanças e mostra diffs quando os módulos suportam esse modo.' }, { code: 'Idempotência', text: 'Rodar novamente deve convergir para o mesmo estado sem reportar mudança quando nada precisa mudar.' },
    ]},
    { title: 'Roles, handlers e variáveis', level: 'Intermediário', summary: 'Roles organizam reutilização; handlers evitam reinícios desnecessários; precedência de variáveis precisa ser deliberada.', rows: [
      { code: 'roles/<role>/{tasks,handlers,templates,defaults,vars}', text: 'Estrutura padrão de uma role reutilizável.' }, { code: 'notify: restart nginx', text: 'Notifica handler apenas quando a task retorna changed.' }, { code: 'ansible-inventory -i inventory.yml --host web01', text: 'Mostra as variáveis efetivas de um host e ajuda a investigar precedence.' }, { code: 'Regra prática', text: 'Use defaults para valores substituíveis; evite espalhar overrides em muitas camadas sem documentação.' },
    ]},
    { title: 'Segredos e privilégio', level: 'Avançado', summary: 'Vault protege conteúdo em repouso; become deve ser restrito; não confunda Vault com um sistema completo de secret management em runtime.', rows: [
      { code: 'ansible-vault encrypt group_vars/prod/vault.yml', text: 'Criptografa arquivo sensível no repositório.' }, { code: 'ansible-playbook site.yml --ask-vault-pass', text: 'Solicita segredo de Vault interativamente; em automação prefira integração segura com fonte de credenciais.' }, { code: 'become: true', text: 'Eleva privilégio para a task/play. Restrinja o escopo e o usuário quando possível.' }, { code: 'no_log: true', text: 'Reduz vazamento de dados sensíveis no output, mas também dificulta troubleshooting; use de forma focada.' },
    ]},
    { title: 'Execução em escala', level: 'Avançado', summary: 'Controle blast radius e concorrência quando a mesma mudança atinge centenas ou milhares de hosts.', rows: [
      { code: 'serial: 10', text: 'Executa o play em lotes de 10 hosts, útil para rolling changes.' }, { code: 'max_fail_percentage: 10', text: 'Pode interromper o rollout quando falhas ultrapassam o limite definido.' }, { code: 'ansible-playbook site.yml --limit canary', text: 'Aplica primeiro em um subconjunto para validar comportamento real.' }, { code: 'strategy: free', text: 'Permite hosts progredirem de forma independente; use somente quando a ordem entre hosts não importa.' },
    ]},
    { title: 'Troubleshooting especializado', level: 'Especialista', summary: 'Falhas geralmente vêm de contexto diferente por host: inventory, facts, privileges, interpreter, SO, dependências ou conectividade.', rows: [
      { code: 'ansible-playbook site.yml --limit web17 -vvv', text: 'Reproduz somente no host problemático com verbosity elevada.' }, { code: 'ansible web17 -m setup', text: 'Coleta facts para comparar SO, interfaces, memória e outras características.' }, { code: 'ansible-inventory --graph && ansible-inventory --host web17', text: 'Confirma membership de grupos e variáveis efetivas.' }, { code: 'changed sempre', text: 'Procure shell/command sem changed_when, templates não determinísticos, timestamps e módulos usados de forma não idempotente.' }, { code: 'unreachable', text: 'Separe erro de transporte/autenticação de erro do módulo. Teste SSH/WinRM, usuário, chave, bastion e become.' },
    ]},
  ],
  helm: [
    { title: 'Estrutura de chart e ciclo de release', level: 'Fundamentos', summary: 'Chart é o pacote; release é uma instalação. Values parametrizam templates que geram manifests Kubernetes.', rows: [
      { code: 'helm create myapp', text: 'Cria a estrutura inicial de um chart.' }, { code: 'helm lint ./myapp', text: 'Executa verificações estruturais básicas.' }, { code: 'helm template myapp ./myapp -f values-dev.yaml', text: 'Renderiza manifests localmente sem alterar o cluster.' }, { code: 'helm upgrade --install myapp ./myapp -n app --create-namespace', text: 'Idempotentemente instala ou atualiza uma release.' },
    ]},
    { title: 'Templates e values por ambiente', level: 'Intermediário', summary: 'Mantenha um chart comum e overlays pequenos de values. Evite duplicar charts inteiros por ambiente.', rows: [
      { code: 'values.yaml + values-prod.yaml', text: 'Valores default ficam no chart; arquivo de ambiente deve conter apenas diferenças.' }, { code: '{{ include "myapp.fullname" . }}', text: 'Helpers centralizam nomes/labels e reduzem divergências.' }, { code: 'values.schema.json', text: 'Pode validar tipos e campos de values antes da renderização.' }, { code: 'Secrets', text: 'Não mantenha secrets em plaintext no Git. Integre com secret manager, SOPS/Sealed Secrets/External Secrets conforme o modelo da plataforma.' },
    ]},
    { title: 'Dependências, hooks e upgrades', level: 'Avançado', summary: 'Subcharts, hooks e recursos imutáveis aumentam a complexidade do lifecycle e precisam ser tratados explicitamente.', rows: [
      { code: 'helm dependency update ./myapp', text: 'Resolve e baixa dependências declaradas no Chart.yaml.' }, { code: 'helm history myapp -n app', text: 'Lista revisões da release para diagnóstico e rollback.' }, { code: 'helm rollback myapp 7 -n app', text: 'Reverte para revisão anterior. Em GitOps, alinhe o Git ao estado desejado para evitar reconciliação de volta.' }, { code: 'helm get manifest myapp -n app', text: 'Mostra os manifests associados à release e ajuda a comparar com o que era esperado.' },
    ]},
    { title: 'Troubleshooting e GitOps', level: 'Especialista', summary: 'Diferencie erro de renderização, erro da API do Kubernetes e divergência GitOps.', rows: [
      { code: 'helm template --debug ...', text: 'Diagnostica valores e templates sem depender do cluster.' }, { code: 'helm status myapp -n app', text: 'Mostra estado atual e recursos associados à release.' }, { code: 'kubectl get events -n app --sort-by=.lastTimestamp', text: 'Quando o Helm aplicou manifests mas o workload falhou, prossiga para eventos e estado Kubernetes.' }, { code: 'Argo CD', text: 'Em GitOps, não use helm upgrade manual como rotina. O reconciliador deve aplicar o estado versionado no Git.' },
    ]},
  ],
  cicd: [
    { title: 'CI: feedback e qualidade', level: 'Fundamentos', summary: 'Pull request deve executar validações rápidas e determinísticas antes do merge.', rows: [
      { code: 'lint → typecheck → unit tests → build', text: 'Ordene checks para falhar cedo e economizar tempo de runner.' }, { code: 'Artifact', text: 'Resultado de build que será promovido. Evite recompilar o mesmo commit de forma diferente por ambiente.' }, { code: 'Cache', text: 'Use cache para dependências/build, mas não permita que ele seja a única fonte de um artefato necessário.' },
    ]},
    { title: 'CD e promotion', level: 'Intermediário', summary: 'Build once, promote many: o mesmo digest atravessa dev, staging e produção; muda configuração, não binário.', rows: [
      { code: 'sha-<commit> / image@sha256:...', text: 'Tags/digests imutáveis dão rastreabilidade e rollback previsível.' }, { code: 'Environment approvals', text: 'Use gates para ambientes críticos quando o modelo de risco exigir revisão humana.' }, { code: 'Rollback', text: 'Promova novamente um artefato conhecido ou reverta a configuração GitOps; não tente “consertar” produção manualmente sem registrar o desired state.' },
    ]},
    { title: 'GitOps com Argo CD', level: 'Avançado', summary: 'Git contém o estado desejado; Argo CD compara com o cluster e reconcilia diferenças.', rows: [
      { code: 'automated.prune: true', text: 'Permite remover recursos que saíram do desired state. Habilite com entendimento do risco.' }, { code: 'automated.selfHeal: true', text: 'Reverte drift manual no cluster quando o estado fica OutOfSync.' }, { code: 'Sync waves', text: 'Controlam ordenação relativa de recursos/hook phases quando dependências de implantação exigem sequência.' }, { code: 'ApplicationSet', text: 'Gera Applications em escala a partir de clusters, diretórios, listas ou outros generators.' },
    ]},
    { title: 'Supply chain e identidade do pipeline', level: 'Especialista', summary: 'Pipelines maduros tratam identidade, provenance, assinatura, SBOM, policies e isolamento do runner como controles de segurança.', rows: [
      { code: 'OIDC federation', text: 'Troca identidade do workflow por credenciais temporárias no cloud/provider em vez de armazenar access keys long-lived.' }, { code: 'permissions:', text: 'Restrinja GITHUB_TOKEN e permissões do job ao mínimo necessário.' }, { code: 'Provenance / SBOM', text: 'Registre como o artefato foi produzido e quais componentes contém.' }, { code: 'Policy before deploy', text: 'Valide assinatura, origem e restrições antes do artefato alcançar produção.' },
    ]},
  ],
};

const en: Record<string, Block[]> = {
  terraform: [
    { title: 'Declarative paradigm and basic lifecycle', level: 'Fundamentals', summary: 'Terraform describes desired state and calculates how to reach it; it is not an imperative script of ordered steps.', rows: [
      { code: 'terraform init', text: 'Initializes providers, modules, and the backend. Run it after changing backend configuration or dependencies.' }, { code: 'terraform fmt -check && terraform validate', text: 'Standardizes HCL formatting and validates configuration before planning.' }, { code: 'terraform plan -out=tfplan', text: 'Calculates and saves a plan so the reviewed artifact is the one later applied.' }, { code: 'terraform apply tfplan', text: 'Applies exactly the saved plan. In CI this reduces the gap between review and execution.' },
    ]},
    { title: 'Modules and composition', level: 'Intermediate', summary: 'Use modules to encapsulate cohesive patterns behind small interfaces. The root module composes child modules.', rows: [
      { code: 'module "network" { source = "./modules/network" ... }', text: 'Invokes a local child module. Variables are inputs; outputs form the external interface.' }, { code: 'module "vpc" { source = "git::https://...//modules/vpc?ref=v1.4.0" }', text: 'Pin versions/tags for remote modules to preserve reproducibility.' }, { code: 'output "subnet_ids" { value = module.network.subnet_ids }', text: 'Propagates only the outputs consumers require without exposing the full implementation.' }, { code: 'Principle', text: 'Avoid giant modules. Prefer cohesive units with one responsibility and explicit composition in the root module.' },
    ]},
    { title: 'Workspaces and isolation', level: 'Advanced', summary: 'Workspaces separate state for the same configuration. They are useful but do not replace architectural isolation when environments differ substantially.', rows: [
      { code: 'terraform workspace list', text: 'Lists workspaces and marks the active one.' }, { code: 'terraform workspace new dev', text: 'Creates another logical state instance for the same configuration.' }, { code: 'terraform workspace select prod', text: 'Switches the state instance used by the root module.' }, { code: 'Avoid when', text: 'Production and development use very different accounts, backends, policies, topologies, or lifecycles. Separate root modules are clearer in that case.' },
    ]},
    { title: 'State file: best practices', level: 'Advanced', summary: 'State is a critical part of Terraform control. Treat it as sensitive and operationally essential data.', rows: [
      { code: 'Remote backend', text: 'Centralize state; enable locking when supported; use encryption, versioning, and strict access controls.' }, { code: 'terraform state pull > backup.tfstate', text: 'Exports a copy of current state. Useful before troubleshooting or state operations.' }, { code: 'Never commit terraform.tfstate to Git', text: 'State can contain IDs, endpoints, and sensitive data; Git storage also introduces concurrency and corruption risks.' }, { code: 'One state boundary per blast radius', text: 'Separate states when components have distinct lifecycles, ownership, or operational impact.' },
    ]},
    { title: 'Drift and state recovery', level: 'Expert', summary: 'Safe recovery requires distinguishing configuration, Terraform state, and real infrastructure. Preserve evidence before modifying state.', rows: [
      { code: 'terraform plan -refresh-only', text: 'Shows changes needed only to reconcile state with externally changed infrastructure. Review before applying.' }, { code: 'terraform import aws_s3_bucket.logs my-bucket', text: 'Associates an existing resource with a Terraform address when it exists outside state.' }, { code: 'import { to = aws_s3_bucket.logs id = "my-bucket" }', text: 'Declarative import form suited to reviewable workflows.' }, { code: 'moved { from = aws_instance.old to = module.compute.aws_instance.main }', text: 'Preserves resource identity during refactoring and avoids unnecessary destroy/create operations.' }, { code: 'terraform state rm <address>', text: 'Makes Terraform forget a resource without destroying it. Use only when that is deliberately the intended outcome.' }, { code: 'Recovery sequence', text: 'Stop concurrent applies → back up/pull state → run plan → identify missing/stale addresses → use import/refresh/moved as appropriate → run plan again → only then apply.' },
    ]},
  ],
  ansible: [
    { title: 'Inventory, playbooks, and idempotency', level: 'Fundamentals', summary: 'Playbooks describe state/actions across host groups; prefer purpose-built idempotent modules over shell commands when an equivalent module exists.', rows: [
      { code: 'ansible all -m ping', text: 'Validates basic connectivity, authentication, and module execution.' }, { code: 'ansible-playbook site.yml --syntax-check', text: 'Validates syntax before execution.' }, { code: 'ansible-playbook site.yml --check --diff', text: 'Simulates changes and shows diffs when modules support those modes.' }, { code: 'Idempotency', text: 'A second run should converge to the same state without reporting a change when nothing needs to change.' },
    ]},
    { title: 'Roles, handlers, and variables', level: 'Intermediate', summary: 'Roles organize reuse, handlers avoid unnecessary restarts, and variable precedence must be deliberate.', rows: [
      { code: 'roles/<role>/{tasks,handlers,templates,defaults,vars}', text: 'Standard structure of a reusable role.' }, { code: 'notify: restart nginx', text: 'Notifies the handler only when the task reports changed.' }, { code: 'ansible-inventory -i inventory.yml --host web01', text: 'Shows effective variables for a host and helps investigate precedence.' }, { code: 'Rule of thumb', text: 'Use defaults for overrideable values; avoid scattering overrides across many layers without documentation.' },
    ]},
    { title: 'Secrets and privilege', level: 'Advanced', summary: 'Vault protects content at rest; become should be scoped tightly; Vault is not a complete runtime secret-management system.', rows: [
      { code: 'ansible-vault encrypt group_vars/prod/vault.yml', text: 'Encrypts a sensitive file stored in the repository.' }, { code: 'ansible-playbook site.yml --ask-vault-pass', text: 'Prompts for the Vault secret interactively; automation should use a secure credential source.' }, { code: 'become: true', text: 'Elevates privilege for a task/play. Restrict scope and target user whenever possible.' }, { code: 'no_log: true', text: 'Reduces sensitive-data leakage in output but also makes troubleshooting harder; apply it narrowly.' },
    ]},
    { title: 'Execution at scale', level: 'Advanced', summary: 'Control blast radius and concurrency when one change reaches hundreds or thousands of hosts.', rows: [
      { code: 'serial: 10', text: 'Runs the play in batches of 10 hosts, useful for rolling changes.' }, { code: 'max_fail_percentage: 10', text: 'Can stop the rollout when failures exceed the defined threshold.' }, { code: 'ansible-playbook site.yml --limit canary', text: 'Applies to a small subset first to validate real behavior.' }, { code: 'strategy: free', text: 'Allows hosts to progress independently; use only when ordering among hosts is unimportant.' },
    ]},
    { title: 'Expert troubleshooting', level: 'Expert', summary: 'Failures often come from host-specific context: inventory, facts, privileges, interpreter, OS, dependencies, or connectivity.', rows: [
      { code: 'ansible-playbook site.yml --limit web17 -vvv', text: 'Reproduces the failure only on the problematic host with high verbosity.' }, { code: 'ansible web17 -m setup', text: 'Collects facts to compare OS, interfaces, memory, and other host characteristics.' }, { code: 'ansible-inventory --graph && ansible-inventory --host web17', text: 'Confirms group membership and effective variables.' }, { code: 'always changed', text: 'Look for shell/command without changed_when, nondeterministic templates, timestamps, or non-idempotent module usage.' }, { code: 'unreachable', text: 'Separate transport/authentication failures from module failures. Test SSH/WinRM, user, key, bastion, and become.' },
    ]},
  ],
  helm: [
    { title: 'Chart structure and release lifecycle', level: 'Fundamentals', summary: 'A chart is the package; a release is one installation. Values parameterize templates that render Kubernetes manifests.', rows: [
      { code: 'helm create myapp', text: 'Creates the initial chart structure.' }, { code: 'helm lint ./myapp', text: 'Runs basic structural checks.' }, { code: 'helm template myapp ./myapp -f values-dev.yaml', text: 'Renders manifests locally without changing the cluster.' }, { code: 'helm upgrade --install myapp ./myapp -n app --create-namespace', text: 'Idempotently installs or upgrades a release.' },
    ]},
    { title: 'Templates and environment values', level: 'Intermediate', summary: 'Keep one common chart and small values overlays. Avoid duplicating entire charts per environment.', rows: [
      { code: 'values.yaml + values-prod.yaml', text: 'Defaults stay in the chart; the environment file should contain only differences.' }, { code: '{{ include "myapp.fullname" . }}', text: 'Helpers centralize names/labels and reduce divergence.' }, { code: 'values.schema.json', text: 'Can validate value types and fields before rendering.' }, { code: 'Secrets', text: 'Do not store plaintext secrets in Git. Integrate with a secret manager, SOPS/Sealed Secrets/External Secrets according to the platform model.' },
    ]},
    { title: 'Dependencies, hooks, and upgrades', level: 'Advanced', summary: 'Subcharts, hooks, and immutable resources add lifecycle complexity that must be managed explicitly.', rows: [
      { code: 'helm dependency update ./myapp', text: 'Resolves and downloads dependencies declared in Chart.yaml.' }, { code: 'helm history myapp -n app', text: 'Lists release revisions for diagnosis and rollback.' }, { code: 'helm rollback myapp 7 -n app', text: 'Reverts to a previous revision. In GitOps, align Git desired state so reconciliation does not immediately reverse the rollback.' }, { code: 'helm get manifest myapp -n app', text: 'Shows manifests associated with the release and supports comparison with expected output.' },
    ]},
    { title: 'Troubleshooting and GitOps', level: 'Expert', summary: 'Distinguish rendering errors, Kubernetes API errors, and GitOps divergence.', rows: [
      { code: 'helm template --debug ...', text: 'Diagnoses values and templates without depending on the cluster.' }, { code: 'helm status myapp -n app', text: 'Shows current release state and associated resources.' }, { code: 'kubectl get events -n app --sort-by=.lastTimestamp', text: 'When Helm applied manifests but the workload failed, continue with Kubernetes events and workload state.' }, { code: 'Argo CD', text: 'In GitOps, do not use manual helm upgrade as normal operation. The reconciler should apply versioned desired state from Git.' },
    ]},
  ],
  cicd: [
    { title: 'CI: feedback and quality', level: 'Fundamentals', summary: 'A pull request should run fast, deterministic validation before merge.', rows: [
      { code: 'lint → typecheck → unit tests → build', text: 'Order checks to fail early and save runner time.' }, { code: 'Artifact', text: 'The build result that will be promoted. Avoid rebuilding the same commit differently for each environment.' }, { code: 'Cache', text: 'Use cache for dependencies/build acceleration, but do not make it the only source of a required artifact.' },
    ]},
    { title: 'CD and promotion', level: 'Intermediate', summary: 'Build once, promote many: the same digest moves through dev, staging, and production; configuration changes, not the binary.', rows: [
      { code: 'sha-<commit> / image@sha256:...', text: 'Immutable tags/digests provide traceability and predictable rollback.' }, { code: 'Environment approvals', text: 'Use gates for critical environments when the risk model requires human review.' }, { code: 'Rollback', text: 'Promote a known artifact again or revert GitOps configuration; avoid manually “fixing” production without recording desired state.' },
    ]},
    { title: 'GitOps with Argo CD', level: 'Advanced', summary: 'Git stores desired state; Argo CD compares it with the cluster and reconciles differences.', rows: [
      { code: 'automated.prune: true', text: 'Allows resources removed from desired state to be deleted. Enable it with a clear understanding of the risk.' }, { code: 'automated.selfHeal: true', text: 'Reverts manual cluster drift when the application becomes OutOfSync.' }, { code: 'Sync waves', text: 'Control relative ordering of resources/hook phases when deployment dependencies require sequencing.' }, { code: 'ApplicationSet', text: 'Generates Applications at scale from clusters, directories, lists, or other generators.' },
    ]},
    { title: 'Supply chain and pipeline identity', level: 'Expert', summary: 'Mature pipelines treat identity, provenance, signing, SBOMs, policy, and runner isolation as security controls.', rows: [
      { code: 'OIDC federation', text: 'Exchanges workflow identity for temporary cloud/provider credentials instead of storing long-lived access keys.' }, { code: 'permissions:', text: 'Restrict GITHUB_TOKEN and job permissions to the minimum required.' }, { code: 'Provenance / SBOM', text: 'Record how an artifact was produced and which components it contains.' }, { code: 'Policy before deploy', text: 'Validate signature, origin, and policy restrictions before an artifact reaches production.' },
    ]},
  ],
};

export function AutomationIacReference({ articleSlug }: ReferenceProps) {
  const { locale, t } = useLanguage();
  const blocks = (locale === 'en' ? en : pt)[articleSlug] ?? [];
  if (!blocks.length) return null;

  const title = articleSlug === 'terraform' ? t('Guia prático de Terraform', 'Practical Terraform guide')
    : articleSlug === 'ansible' ? t('Guia prático de Ansible', 'Practical Ansible guide')
      : articleSlug === 'helm' ? t('Guia prático de Helm', 'Practical Helm guide')
        : t('Guia prático de CI/CD e GitOps', 'Practical CI/CD and GitOps guide');

  return (
    <section className="article-section" id="automation-iac-reference">
      <h2>{title}</h2>
      <p className="section-summary">{t('Referência operacional progressiva do nível básico ao especialista, com foco em decisões reais, troubleshooting e boas práticas.', 'Progressive operational reference from fundamentals to expert level, focused on real decisions, troubleshooting, and best practices.')}</p>
      <div className="command-group-list">{blocks.map((block) => <section className="command-group" key={block.title}><div className="reference-level">{block.level}</div><h3>{block.title}</h3><p>{block.summary}</p><div className="command-table">{block.rows.map((row) => <div className="command-row" key={`${block.title}-${row.code}`}><code>{row.code}</code><p>{row.text}</p></div>)}</div></section>)}</div>
      <p className="technical-source-note">{t('Conteúdo baseado em documentação oficial do Helm, HashiCorp Terraform, Ansible, GitHub Actions e Argo CD. Operações destrutivas de state, prune e rollout devem ser revisadas no contexto do ambiente antes da execução.', 'Content based on official Helm, HashiCorp Terraform, Ansible, GitHub Actions, and Argo CD documentation. Destructive state, prune, and rollout operations must be reviewed in the context of the target environment before execution.')}</p>
    </section>
  );
}
