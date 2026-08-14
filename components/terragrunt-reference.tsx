'use client';

import { useState } from 'react';
import { getTerragruntDiagram } from '@/content/terragrunt-diagram';
import { useLanguage } from './language-provider';
import { TopicDiagram } from './topic-diagram';

const rootExample = `# live/root.hcl
remote_state {
  backend = "s3"
  config = {
    bucket         = "company-terraform-state"
    key            = "\${path_relative_to_include()}/terraform.tfstate"
    region         = "eu-west-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

inputs = {
  environment = "prod"
  region      = "eu-west-1"
}`;

const unitExample = `# live/prod/eks/terragrunt.hcl
include "root" {
  path = find_in_parent_folders("root.hcl")
}

terraform {
  source = "git::https://github.com/company/iac-modules.git//eks?ref=v2.3.0"
}

dependency "vpc" {
  config_path = "../vpc"
}

inputs = {
  vpc_id       = dependency.vpc.outputs.vpc_id
  subnet_ids   = dependency.vpc.outputs.private_subnet_ids
  cluster_name = "prod-eks"
}`;

const commandsExample = `# uma unit
terragrunt plan
terragrunt apply

# todas as units descobertas, respeitando dependências
terragrunt run --all plan
terragrunt run --all apply

# visualizar dependências / depurar config
terragrunt dag graph
terragrunt render --json`;

export function TerragruntReference() {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <section className="article-section" id="terragrunt-reference">
      <h2>Terragrunt</h2>
      <p className="section-summary">
        {t(
          'Terragrunt é uma camada de configuração e orquestração para Terraform/OpenTofu. Ele não substitui o Terraform: ajuda a evitar repetição entre ambientes, organizar states menores, reutilizar módulos e executar unidades dependentes na ordem correta.',
          'Terragrunt is a configuration and orchestration layer for Terraform/OpenTofu. It does not replace Terraform: it helps reduce repetition across environments, organize smaller states, reuse modules, and run dependent units in the correct order.'
        )}
      </p>

      <article className={`terragrunt-card${open ? ' is-expanded' : ''}`}>
        <button className="terragrunt-trigger" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span>
            <small>{t('Avançado', 'Advanced')}</small>
            <strong>{t('Terragrunt: DRY, dependências e múltiplos ambientes', 'Terragrunt: DRY configuration, dependencies, and multiple environments')}</strong>
          </span>
          <span aria-hidden="true">{open ? '−' : '+'}</span>
        </button>

        {open ? (
          <div className="terragrunt-content">
            <div className="reference-note">
              <strong>{t('Modelo mental:', 'Mental model:')}</strong>{' '}
              {t(
                'Terraform/OpenTofu continua sendo o engine que faz plan/apply e fala com os providers. Terragrunt fica acima dele para gerar/reutilizar configuração, organizar units e coordenar a ordem de execução.',
                'Terraform/OpenTofu remains the engine that performs plan/apply and talks to providers. Terragrunt sits above it to generate/reuse configuration, organize units, and coordinate execution order.'
              )}
            </div>

            <TopicDiagram spec={getTerragruntDiagram(locale)} />

            <h3>{t('Quando Terragrunt ajuda', 'When Terragrunt helps')}</h3>
            <ul className="knowledge-list">
              <li>{t('Muitos ambientes/contas/regiões reutilizando os mesmos módulos Terraform.', 'Many environments/accounts/regions reuse the same Terraform modules.')}</li>
              <li>{t('Backend, provider settings, tags e inputs comuns repetidos em muitos root modules.', 'Backend, provider settings, tags, and common inputs are repeated across many root modules.')}</li>
              <li>{t('Infraestrutura dividida em states menores, como VPC, EKS, database e aplicações.', 'Infrastructure is split into smaller states such as VPC, EKS, database, and applications.')}</li>
              <li>{t('Uma unit depende de outputs de outra e a ordem de plan/apply precisa ser conhecida.', 'One unit depends on outputs from another and plan/apply ordering must be known.')}</li>
            </ul>

            <h3>{t('Estrutura fácil de entender', 'Easy-to-understand structure')}</h3>
            <pre className="reference-code"><code>{`iac-modules/
├── vpc/
├── eks/
└── app/

live/
├── root.hcl
├── dev/
│   ├── vpc/terragrunt.hcl
│   ├── eks/terragrunt.hcl
│   └── app/terragrunt.hcl
└── prod/
    ├── vpc/terragrunt.hcl
    ├── eks/terragrunt.hcl
    └── app/terragrunt.hcl`}</code></pre>

            <p>{t(
              'Os módulos contêm os recursos Terraform reutilizáveis. A pasta live contém configurações pequenas por ambiente/unit. Cada unit pode ter seu próprio state e consumir outputs explícitos de outra unit.',
              'Modules contain reusable Terraform resources. The live directory contains small configurations per environment/unit. Each unit can have its own state and consume explicit outputs from another unit.'
            )}</p>

            <h3>root.hcl — {t('configuração compartilhada', 'shared configuration')}</h3>
            <pre className="reference-code"><code>{rootExample}</code></pre>

            <h3>terragrunt.hcl — {t('unit EKS dependente da VPC', 'EKS unit depending on the VPC')}</h3>
            <pre className="reference-code"><code>{unitExample}</code></pre>

            <h3>{t('Comandos principais', 'Key commands')}</h3>
            <pre className="reference-code"><code>{commandsExample}</code></pre>

            <h3>{t('O que acontece no run --all', 'What happens during run --all')}</h3>
            <ol className="istio-numbered-steps">
              <li><span>1</span><p>{t('Terragrunt descobre as units dentro do diretório/stack.', 'Terragrunt discovers the units inside the directory/stack.')}</p></li>
              <li><span>2</span><p>{t('Analisa blocos dependency e constrói um grafo dirigido de dependências.', 'It analyzes dependency blocks and builds a directed dependency graph.')}</p></li>
              <li><span>3</span><p>{t('Para plan/apply, unidades upstream como VPC são processadas antes das dependentes como EKS e App.', 'For plan/apply, upstream units such as VPC are processed before dependents such as EKS and App.')}</p></li>
              <li><span>4</span><p>{t('Em cada unit, Terragrunt prepara a configuração e invoca Terraform/OpenTofu.', 'In each unit, Terragrunt prepares the configuration and invokes Terraform/OpenTofu.')}</p></li>
              <li><span>5</span><p>{t('Terraform/OpenTofu executa o plan/apply real contra os providers e atualiza o state daquela unit.', 'Terraform/OpenTofu performs the actual plan/apply against providers and updates that unit’s state.')}</p></li>
            </ol>

            <h3>{t('Boas práticas', 'Best practices')}</h3>
            <ul className="knowledge-list">
              <li>{t('Mantenha módulos Terraform independentes do Terragrunt sempre que possível; Terragrunt deve orquestrar, não esconder toda a lógica de infraestrutura.', 'Keep Terraform modules independent from Terragrunt where possible; Terragrunt should orchestrate rather than hide all infrastructure logic.')}</li>
              <li>{t('Versione módulos por tag/commit para tornar environments reprodutíveis.', 'Pin modules by tag/commit to make environments reproducible.')}</li>
              <li>{t('Use states pequenos por blast radius e ownership, mas não fragmente tanto que o grafo de dependências se torne impossível de operar.', 'Use smaller states based on blast radius and ownership, but do not fragment so much that the dependency graph becomes difficult to operate.')}</li>
              <li>{t('Revise o DAG antes de run --all apply e limite escopo no CI para evitar alterações em massa acidentais.', 'Review the DAG before run --all apply and limit CI scope to avoid accidental mass changes.')}</li>
              <li>{t('Não use Terragrunt apenas porque existem dois ambientes; a ferramenta agrega valor quando a repetição e a coordenação entre muitas units começam a crescer.', 'Do not use Terragrunt merely because two environments exist; it adds value when repetition and coordination across many units start to grow.')}</li>
            </ul>
          </div>
        ) : null}
      </article>
    </section>
  );
}
