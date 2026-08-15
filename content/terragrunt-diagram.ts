import type { DiagramSpec } from './diagrams';

type Locale = 'pt' | 'en';

export function getTerragruntDiagram(locale: Locale): DiagramSpec {
  const en = locale === 'en';
  return {
    title: en ? 'Terragrunt: orchestration above Terraform/OpenTofu' : 'Terragrunt: orquestração acima do Terraform/OpenTofu',
    description: en
      ? 'Terragrunt does not replace Terraform/OpenTofu. It organizes reusable modules into independently deployable units, centralizes shared configuration, resolves dependencies, and invokes the IaC engine in the correct order.'
      : 'Terragrunt não substitui Terraform/OpenTofu. Ele organiza módulos reutilizáveis em units implantáveis de forma independente, centraliza configuração compartilhada, resolve dependências e chama o engine de IaC na ordem correta.',
    width: 1080,
    height: 500,
    nodes: [
      { id: 'platform', label: '1. Platform / DevOps\nterragrunt run --all plan', x: 20, y: 40, width: 210, kind: 'client' },
      { id: 'root', label: en ? '2. Shared config\nroot.hcl\nremote_state / provider' : '2. Config comum\nroot.hcl\nremote_state / provider', x: 300, y: 25, width: 220, kind: 'control' },
      { id: 'terragrunt', label: en ? '3. Terragrunt\nIncludes + Inputs\nDependency DAG / Run Queue' : '3. Terragrunt\nIncludes + Inputs\nDAG de dependências / Run Queue', x: 600, y: 30, width: 245, kind: 'control' },
      { id: 'vpc', label: en ? '4a. Unit: VPC\nterragrunt.hcl\nown state' : '4a. Unit: VPC\nterragrunt.hcl\nstate próprio', x: 170, y: 245, width: 190, kind: 'workload' },
      { id: 'eks', label: en ? '4b. Unit: EKS\ndepends on VPC\nown state' : '4b. Unit: EKS\ndepende da VPC\nstate próprio', x: 445, y: 245, width: 190, kind: 'workload' },
      { id: 'app', label: en ? '4c. Unit: App\ndepends on EKS\nown state' : '4c. Unit: App\ndepende do EKS\nstate próprio', x: 720, y: 245, width: 190, kind: 'workload' },
      { id: 'engine', label: '5. Terraform / OpenTofu\nplan → apply', x: 440, y: 390, width: 210, kind: 'control' },
      { id: 'cloud', label: en ? '6. Cloud / Infrastructure\nAWS · Azure · GCP · etc.' : '6. Cloud / Infraestrutura\nAWS · Azure · GCP · etc.', x: 790, y: 390, width: 220, kind: 'data' },
    ],
    edges: [
      { from: 'platform', to: 'terragrunt', label: en ? '1. run command' : '1. executa comando', animated: true },
      { from: 'root', to: 'terragrunt', label: en ? '2. include shared config' : '2. inclui config comum', animated: true },
      { from: 'terragrunt', to: 'vpc', label: en ? '3. discovers units' : '3. descobre units', animated: true },
      { from: 'terragrunt', to: 'eks', label: en ? '3. builds DAG' : '3. monta DAG', animated: true },
      { from: 'terragrunt', to: 'app', label: en ? '3. builds DAG' : '3. monta DAG', animated: true },
      { from: 'vpc', to: 'eks', label: en ? 'dependency outputs' : 'outputs de dependency', animated: true },
      { from: 'eks', to: 'app', label: en ? 'dependency outputs' : 'outputs de dependency', animated: true },
      { from: 'vpc', to: 'engine', label: en ? '4. invoke engine' : '4. chama engine' },
      { from: 'eks', to: 'engine', label: en ? '4. invoke engine' : '4. chama engine' },
      { from: 'app', to: 'engine', label: en ? '4. invoke engine' : '4. chama engine' },
      { from: 'engine', to: 'cloud', label: en ? '5. provider APIs' : '5. APIs dos providers', animated: true },
    ],
    sources: [
      { label: 'Terragrunt — Overview', url: 'https://docs.terragrunt.com/getting-started/overview/' },
      { label: 'Terragrunt — Includes', url: 'https://docs.terragrunt.com/features/units/includes/' },
      { label: 'Terragrunt — Run Queue', url: 'https://docs.terragrunt.com/features/stacks/run-queue/' },
    ],
  };
}
