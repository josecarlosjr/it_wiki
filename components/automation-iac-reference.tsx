type ReferenceProps = { articleSlug: string };

type Row = { code: string; text: string };

type Block = { title: string; level: string; summary: string; rows: Row[] };

const terraformBlocks: Block[] = [
  {
    title: 'Paradigma declarativo e ciclo básico', level: 'Fundamentos',
    summary: 'Terraform descreve o estado desejado e calcula como chegar até ele; não é um script imperativo de passos.',
    rows: [
      { code: 'terraform init', text: 'Inicializa providers, modules e backend. Execute após alterar backend ou dependências.' },
      { code: 'terraform fmt -check && terraform validate', text: 'Padroniza HCL e valida a configuração antes do plan.' },
      { code: 'terraform plan -out=tfplan', text: 'Calcula o plano e o grava para que a revisão corresponda ao artefato posteriormente aplicado.' },
      { code: 'terraform apply tfplan', text: 'Aplica exatamente o plano salvo. Em CI reduz a janela entre revisão e execução.' },
    ],
  },
  {
    title: 'Módulos e composição', level: 'Intermediário',
    summary: 'Use módulos para encapsular padrões com interfaces pequenas. O root module compõe child modules.',
    rows: [
      { code: 'module "network" { source = "./modules/network" ... }', text: 'Invoca um child module local. Variables são entradas; outputs formam a interface de saída.' },
      { code: 'module "vpc" { source = "git::https://...//modules/vpc?ref=v1.4.0" }', text: 'Em módulos remotos, fixe versões/tags para reprodutibilidade.' },
      { code: 'output "subnet_ids" { value = module.network.subnet_ids }', text: 'Propaga saídas necessárias sem expor toda a implementação do módulo.' },
      { code: 'Princípio', text: 'Evite módulos gigantes. Prefira unidades coesas por responsabilidade e composição explícita no root module.' },
    ],
  },
  {
    title: 'Workspaces e isolamento', level: 'Avançado',
    summary: 'Workspaces separam state para a mesma configuração. São úteis, mas não substituem isolamento arquitetural quando ambientes divergem muito.',
    rows: [
      { code: 'terraform workspace list', text: 'Lista workspaces e indica o atual.' },
      { code: 'terraform workspace new dev', text: 'Cria outro state lógico para a mesma configuração.' },
      { code: 'terraform workspace select prod', text: 'Troca a instância de state usada pelo root module.' },
      { code: 'Evite quando', text: 'Prod/dev usam contas, backends, políticas, topologias ou ciclos de vida muito diferentes. Nesse caso, root modules separados são mais explícitos.' },
    ],
  },
  {
    title: 'State file: melhores práticas', level: 'Avançado',
    summary: 'O state é parte crítica do sistema de controle do Terraform. Trate-o como dado sensível e operacionalmente indispensável.',
    rows: [
      { code: 'Remote backend', text: 'Centralize o state; habilite locking quando suportado; use criptografia, versionamento e controles de acesso.' },
      { code: 'terraform state pull > backup.tfstate', text: 'Exporta uma cópia do state atual. Útil antes de troubleshooting ou operações de state.' },
      { code: 'Nunca versionar terraform.tfstate no Git', text: 'O state pode conter IDs, endpoints e dados sensíveis; também cria risco de concorrência e corrupção.' },
      { code: 'Uma state boundary por blast radius', text: 'Separe states quando componentes tiverem ciclos de vida, ownership ou impacto operacional distintos.' },
    ],
  },
  {
    title: 'Drift e recuperação de state', level: 'Especialista',
    summary: 'Recuperação segura exige distinguir configuração, state e infraestrutura real. Preserve evidências antes de alterar state.',
    rows: [
      { code: 'terraform plan -refresh-only', text: 'Mostra mudanças necessárias apenas para atualizar o state com alterações externas. Revise antes de aplicar.' },
      { code: 'terraform import aws_s3_bucket.logs my-bucket', text: 'Associa um recurso existente ao endereço do Terraform quando ele existe fora do state.' },
      { code: 'import { to = aws_s3_bucket.logs id = "my-bucket" }', text: 'Forma declarativa de import, adequada a workflows revisáveis.' },
      { code: 'moved { from = aws_instance.old to = module.compute.aws_instance.main }', text: 'Preserva identidade durante refatoração e evita destroy/create desnecessário.' },
      { code: 'terraform state rm <address>', text: 'Faz Terraform esquecer um recurso sem destruí-lo. Use apenas quando essa for deliberadamente a intenção.' },
      { code: 'Sequência de recuperação', text: 'Pare applies concorrentes → faça backup/state pull → rode plan → identifique missing/stale addresses → import/refresh/moved conforme o caso → rode plan novamente → só então apply.' },
    ],
  },
];

const ansibleBlocks: Block[] = [
  {
    title: 'Inventory, playbooks e idempotência', level: 'Fundamentos',
    summary: 'Playbooks descrevem estado/ações sobre grupos de hosts; módulos devem ser preferidos a shell commands quando há módulo idempotente equivalente.',
    rows: [
      { code: 'ansible all -m ping', text: 'Valida conectividade básica, autenticação e execução de módulo.' },
      { code: 'ansible-playbook site.yml --syntax-check', text: 'Valida sintaxe antes da execução.' },
      { code: 'ansible-playbook site.yml --check --diff', text: 'Simula mudanças e mostra diffs quando os módulos suportam esse modo.' },
      { code: 'Idempotência', text: 'Rodar novamente deve convergir para o mesmo estado sem reportar mudança quando nada precisa mudar.' },
    ],
  },
  {
    title: 'Roles, handlers e variáveis', level: 'Intermediário',
    summary: 'Roles organizam reutilização; handlers evitam reinícios desnecessários; precedência de variáveis precisa ser deliberada.',
    rows: [
      { code: 'roles/<role>/{tasks,handlers,templates,defaults,vars}', text: 'Estrutura padrão de uma role reutilizável.' },
      { code: 'notify: restart nginx', text: 'Notifica handler apenas quando a task retorna changed.' },
      { code: 'ansible-inventory -i inventory.yml --host web01', text: 'Mostra as variáveis efetivas de um host e ajuda a investigar precedence.' },
      { code: 'Regra prática', text: 'Use defaults para valores substituíveis; evite espalhar overrides em muitas camadas sem documentação.' },
    ],
  },
  {
    title: 'Segredos e privilégio', level: 'Avançado',
    summary: 'Vault protege conteúdo em repouso; become deve ser restrito; não confunda Vault com um sistema completo de secret management em runtime.',
    rows: [
      { code: 'ansible-vault encrypt group_vars/prod/vault.yml', text: 'Criptografa arquivo sensível no repositório.' },
      { code: 'ansible-playbook site.yml --ask-vault-pass', text: 'Solicita segredo de Vault interativamente; em automação prefira integração segura com fonte de credenciais.' },
      { code: 'become: true', text: 'Eleva privilégio para a task/play. Restrinja o escopo e o usuário quando possível.' },
      { code: 'no_log: true', text: 'Reduz vazamento de dados sensíveis no output, mas também dificulta troubleshooting; use de forma focada.' },
    ],
  },
  {
    title: 'Execução em escala', level: 'Avançado',
    summary: 'Controle blast radius e concorrência quando a mesma mudança atinge centenas ou milhares de hosts.',
    rows: [
      { code: 'serial: 10', text: 'Executa o play em lotes de 10 hosts, útil para rolling changes.' },
      { code: 'max_fail_percentage: 10', text: 'Pode interromper o rollout quando falhas ultrapassam o limite definido.' },
      { code: 'ansible-playbook site.yml --limit canary', text: 'Aplica primeiro em um subconjunto para validar comportamento real.' },
      { code: 'strategy: free', text: 'Permite hosts progredirem de forma independente; use somente quando a ordem entre hosts não importa.' },
    ],
  },
  {
    title: 'Troubleshooting especializado', level: 'Especialista',
    summary: 'Falhas geralmente vêm de contexto diferente por host: inventory, facts, privileges, interpreter, SO, dependências ou conectividade.',
    rows: [
      { code: 'ansible-playbook site.yml --limit web17 -vvv', text: 'Reproduz somente no host problemático com verbosity elevada.' },
      { code: 'ansible web17 -m setup', text: 'Coleta facts para comparar SO, interfaces, memória e outras características.' },
      { code: 'ansible-inventory --graph && ansible-inventory --host web17', text: 'Confirma membership de grupos e variáveis efetivas.' },
      { code: 'changed sempre', text: 'Procure shell/command sem changed_when, templates não determinísticos, timestamps e módulos usados de forma não idempotente.' },
      { code: 'unreachable', text: 'Separe erro de transporte/autenticação de erro do módulo. Teste SSH/WinRM, usuário, chave, bastion e become.' },
    ],
  },
];

const helmBlocks: Block[] = [
  {
    title: 'Estrutura de chart e ciclo de release', level: 'Fundamentos',
    summary: 'Chart é o pacote; release é uma instalação. Values parametrizam templates que geram manifests Kubernetes.',
    rows: [
      { code: 'helm create myapp', text: 'Cria a estrutura inicial de um chart.' },
      { code: 'helm lint ./myapp', text: 'Executa verificações estruturais básicas.' },
      { code: 'helm template myapp ./myapp -f values-dev.yaml', text: 'Renderiza manifests localmente sem alterar o cluster.' },
      { code: 'helm upgrade --install myapp ./myapp -n app --create-namespace', text: 'Idempotentemente instala ou atualiza uma release.' },
    ],
  },
  {
    title: 'Templates e values por ambiente', level: 'Intermediário',
    summary: 'Mantenha um chart comum e overlays pequenos de values. Evite duplicar charts inteiros por ambiente.',
    rows: [
      { code: 'values.yaml + values-prod.yaml', text: 'Valores default ficam no chart; arquivo de ambiente deve conter apenas diferenças.' },
      { code: '{{ include "myapp.fullname" . }}', text: 'Helpers centralizam nomes/labels e reduzem divergências.' },
      { code: 'values.schema.json', text: 'Pode validar tipos e campos de values antes da renderização.' },
      { code: 'Secrets', text: 'Não mantenha secrets em plaintext no Git. Integre com secret manager, SOPS/Sealed Secrets/External Secrets conforme o modelo da plataforma.' },
    ],
  },
  {
    title: 'Dependências, hooks e upgrades', level: 'Avançado',
    summary: 'Subcharts, hooks e recursos imutáveis aumentam a complexidade do lifecycle e precisam ser tratados explicitamente.',
    rows: [
      { code: 'helm dependency update ./myapp', text: 'Resolve e baixa dependências declaradas no Chart.yaml.' },
      { code: 'helm history myapp -n app', text: 'Lista revisões da release para diagnóstico e rollback.' },
      { code: 'helm rollback myapp 7 -n app', text: 'Reverte para revisão anterior. Em GitOps, alinhe o Git ao estado desejado para evitar reconciliação de volta.' },
      { code: 'helm get manifest myapp -n app', text: 'Mostra os manifests associados à release e ajuda a comparar com o que era esperado.' },
    ],
  },
  {
    title: 'Troubleshooting e GitOps', level: 'Especialista',
    summary: 'Diferencie erro de renderização, erro da API do Kubernetes e divergência GitOps.',
    rows: [
      { code: 'helm template --debug ...', text: 'Diagnostica valores e templates sem depender do cluster.' },
      { code: 'helm status myapp -n app', text: 'Mostra estado atual e recursos associados à release.' },
      { code: 'kubectl get events -n app --sort-by=.lastTimestamp', text: 'Quando o Helm aplicou manifests mas o workload falhou, prossiga para eventos e estado Kubernetes.' },
      { code: 'Argo CD', text: 'Em GitOps, não use helm upgrade manual como rotina. O reconciliador deve aplicar o estado versionado no Git.' },
    ],
  },
];

const cicdBlocks: Block[] = [
  {
    title: 'CI: feedback e qualidade', level: 'Fundamentos',
    summary: 'Pull request deve executar validações rápidas e determinísticas antes do merge.',
    rows: [
      { code: 'lint → typecheck → unit tests → build', text: 'Ordene checks para falhar cedo e economizar tempo de runner.' },
      { code: 'Artifact', text: 'Resultado de build que será promovido. Evite recompilar o mesmo commit de forma diferente por ambiente.' },
      { code: 'Cache', text: 'Use cache para dependências/build, mas não permita que ele seja a única fonte de um artefato necessário.' },
    ],
  },
  {
    title: 'CD e promotion', level: 'Intermediário',
    summary: 'Build once, promote many: o mesmo digest atravessa dev, staging e produção; muda configuração, não binário.',
    rows: [
      { code: 'sha-<commit> / image@sha256:...', text: 'Tags/digests imutáveis dão rastreabilidade e rollback previsível.' },
      { code: 'Environment approvals', text: 'Use gates para ambientes críticos quando o modelo de risco exigir revisão humana.' },
      { code: 'Rollback', text: 'Promova novamente um artefato conhecido ou reverta a configuração GitOps; não tente “consertar” produção manualmente sem registrar o desired state.' },
    ],
  },
  {
    title: 'GitOps com Argo CD', level: 'Avançado',
    summary: 'Git contém o estado desejado; Argo CD compara com o cluster e reconcilia diferenças.',
    rows: [
      { code: 'automated.prune: true', text: 'Permite remover recursos que saíram do desired state. Habilite com entendimento do risco.' },
      { code: 'automated.selfHeal: true', text: 'Reverte drift manual no cluster quando o estado fica OutOfSync.' },
      { code: 'Sync waves', text: 'Controlam ordenação relativa de recursos/hook phases quando dependências de implantação exigem sequência.' },
      { code: 'ApplicationSet', text: 'Gera Applications em escala a partir de clusters, diretórios, listas ou outros generators.' },
    ],
  },
  {
    title: 'Supply chain e identidade do pipeline', level: 'Especialista',
    summary: 'Pipelines maduros tratam identidade, provenance, assinatura, SBOM, policies e isolamento do runner como controles de segurança.',
    rows: [
      { code: 'OIDC federation', text: 'Troca identidade do workflow por credenciais temporárias no cloud/provider em vez de armazenar access keys long-lived.' },
      { code: 'permissions:', text: 'Restrinja GITHUB_TOKEN e permissões do job ao mínimo necessário.' },
      { code: 'Provenance / SBOM', text: 'Registre como o artefato foi produzido e quais componentes contém.' },
      { code: 'Policy before deploy', text: 'Valide assinatura, origem e restrições antes do artefato alcançar produção.' },
    ],
  },
];

function blocksFor(slug: string) {
  if (slug === 'terraform') return terraformBlocks;
  if (slug === 'ansible') return ansibleBlocks;
  if (slug === 'helm') return helmBlocks;
  if (slug === 'cicd') return cicdBlocks;
  return [];
}

export function AutomationIacReference({ articleSlug }: ReferenceProps) {
  const blocks = blocksFor(articleSlug);
  if (!blocks.length) return null;

  const title = articleSlug === 'terraform' ? 'Guia prático de Terraform'
    : articleSlug === 'ansible' ? 'Guia prático de Ansible'
      : articleSlug === 'helm' ? 'Guia prático de Helm'
        : 'Guia prático de CI/CD e GitOps';

  return (
    <section className="article-section" id="automation-iac-reference">
      <h2>{title}</h2>
      <p className="section-summary">Referência operacional progressiva do nível básico ao especialista, com foco em decisões reais, troubleshooting e boas práticas.</p>
      <div className="command-group-list">
        {blocks.map((block) => (
          <section className="command-group" key={block.title}>
            <div className="reference-level">{block.level}</div>
            <h3>{block.title}</h3>
            <p>{block.summary}</p>
            <div className="command-table">
              {block.rows.map((row) => (
                <div className="command-row" key={`${block.title}-${row.code}`}>
                  <code>{row.code}</code>
                  <p>{row.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="technical-source-note">Conteúdo baseado em documentação oficial do Helm, HashiCorp Terraform, Ansible, GitHub Actions e Argo CD. Operações destrutivas de state, prune e rollout devem ser revisadas no contexto do ambiente antes da execução.</p>
    </section>
  );
}
