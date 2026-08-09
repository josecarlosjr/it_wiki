'use client';

import { TopicDiagram } from './topic-diagram';
import { awsServiceDiagrams } from '@/content/aws-diagrams';
import { useLanguage } from './language-provider';

const roleRowsPt = [
  ['EC2', 'IAM role via Instance Profile', 'Associe a role à instância. A aplicação usa credenciais temporárias entregues pelo metadata service; evite access keys no filesystem.'],
  ['Lambda', 'Execution Role', 'Configure na função. Essa role define quais APIs AWS o código da Lambda pode chamar.'],
  ['ECS', 'Task Role', 'Configure no task definition para permissões da aplicação. Não confunda com Task Execution Role, usada pelo ECS/Fargate para ações operacionais.'],
  ['EKS', 'EKS Pod Identity ou IRSA', 'Associe IAM por workload/ServiceAccount. Evite conceder permissões S3 da aplicação ao node role.'],
  ['CI/CD externo', 'AssumeRole via OIDC/STS', 'O pipeline autentica no IdP/OIDC e assume uma role temporária. Evite chaves AWS de longa duração.'],
];
const roleRowsEn = [
  ['EC2', 'IAM role via Instance Profile', 'Attach the role to the instance. The application receives temporary credentials from the metadata service; avoid access keys on the filesystem.'],
  ['Lambda', 'Execution Role', 'Configure it on the function. This role defines which AWS APIs the Lambda code can call.'],
  ['ECS', 'Task Role', 'Configure it in the task definition for application permissions. Do not confuse it with the Task Execution Role used by ECS/Fargate for operational actions.'],
  ['EKS', 'EKS Pod Identity or IRSA', 'Associate IAM with the workload/ServiceAccount. Avoid granting application S3 permissions to the node role.'],
  ['External CI/CD', 'AssumeRole via OIDC/STS', 'The pipeline authenticates through OIDC and assumes a temporary role. Avoid long-lived AWS access keys.'],
];

const s3PolicyExample = `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::my-app-bucket/app/*"
  }]
}`;

const rdsPt = [
  'DB subnet group em pelo menos duas AZs quando a arquitetura exigir Multi-AZ.', 'Instâncias de aplicação e RDS em subnets privadas quando não houver necessidade de exposição pública.', 'Security Group do RDS permitindo a porta do engine a partir do Security Group da aplicação, em vez de CIDRs amplos.', 'Backups automáticos, snapshots, janela de manutenção e estratégia de restore testada.', 'Multi-AZ para alta disponibilidade; Read Replicas para escala de leitura — são objetivos diferentes.', 'Secrets Manager ou mecanismo equivalente para credenciais; IAM DB Authentication quando suportado e apropriado.',
];
const rdsEn = [
  'Use a DB subnet group spanning at least two Availability Zones when the architecture requires Multi-AZ.', 'Place application instances and RDS in private subnets when public exposure is not required.', 'Allow the database engine port from the application Security Group instead of broad CIDR ranges.', 'Configure automated backups, snapshots, maintenance windows, and a tested restore strategy.', 'Use Multi-AZ for availability and failover; use Read Replicas for read scaling — they solve different problems.', 'Use Secrets Manager or an equivalent mechanism for credentials; consider IAM DB Authentication when supported and appropriate.',
];

const vpcPt = [
  ['Internet → aplicação privada', 'Internet Gateway recebe tráfego em recursos públicos, tipicamente um ALB. O ALB encaminha para targets em subnets privadas. Security Groups restringem a comunicação entre as camadas.'],
  ['Aplicação privada → Internet', 'Para IPv4, workloads em subnets privadas normalmente usam rota default para NAT Gateway em subnet pública, que por sua vez usa Internet Gateway. NAT não é necessário para destinos acessados por VPC Endpoint adequado.'],
  ['VPC ↔ VPC', 'VPC Peering funciona bem para conexões diretas e não transitivas. Em topologias com muitas VPCs, Transit Gateway reduz o número de relações ponto a ponto e centraliza roteamento.'],
  ['VPC ↔ on-premises', 'AWS Site-to-Site VPN usa IPsec sobre a Internet. Direct Connect fornece conectividade dedicada. Transit Gateway pode concentrar VPN, Direct Connect e múltiplas VPCs.'],
  ['Usuário remoto → VPC', 'AWS Client VPN fornece acesso remoto baseado em cliente. É diferente de Site-to-Site VPN, que conecta redes/gateways.'],
];
const vpcEn = [
  ['Internet → private application', 'An Internet Gateway provides Internet connectivity to public resources, commonly an ALB. The ALB forwards traffic to targets in private subnets. Security Groups restrict communication between tiers.'],
  ['Private application → Internet', 'For IPv4, workloads in private subnets commonly use a default route to a NAT Gateway in a public subnet, which then uses an Internet Gateway. NAT is unnecessary for destinations reachable through an appropriate VPC Endpoint.'],
  ['VPC ↔ VPC', 'VPC Peering works well for direct, non-transitive connections. With many VPCs, Transit Gateway reduces point-to-point relationships and centralizes routing.'],
  ['VPC ↔ on-premises', 'AWS Site-to-Site VPN uses IPsec over the Internet. Direct Connect provides dedicated connectivity. Transit Gateway can aggregate VPN, Direct Connect, and multiple VPCs.'],
  ['Remote user → VPC', 'AWS Client VPN provides client-based remote access. It solves a different problem from Site-to-Site VPN, which connects networks/gateways.'],
];

const messagingPt = [
  ['SQS', 'Fila durável, pull-based, buffering, retry, workers assíncronos e DLQ.'], ['SNS', 'Pub/sub e fan-out para múltiplos subscribers, incluindo SQS, Lambda e endpoints suportados.'], ['SNS + SQS', 'Cada consumidor recebe sua própria fila; bom para fan-out durável e ritmos de consumo independentes.'],
];
const messagingEn = [
  ['SQS', 'Durable pull-based queue for buffering, retries, asynchronous workers, and DLQs.'], ['SNS', 'Pub/sub and fan-out to multiple subscribers including SQS, Lambda, and supported endpoints.'], ['SNS + SQS', 'Each consumer gets its own queue, enabling durable fan-out and independent consumption rates.'],
];

function DiagramSection({ id, title, children, diagramKey }: { id: string; title: string; children: React.ReactNode; diagramKey: keyof typeof awsServiceDiagrams }) {
  return <section className="article-section" id={id}><h2>{title}</h2>{children}<TopicDiagram spec={awsServiceDiagrams[diagramKey]} /></section>;
}

export function AwsReference() {
  const { locale, t } = useLanguage();
  const roleRows = locale === 'en' ? roleRowsEn : roleRowsPt;
  const rdsChecklist = locale === 'en' ? rdsEn : rdsPt;
  const vpcCases = locale === 'en' ? vpcEn : vpcPt;
  const messagingCases = locale === 'en' ? messagingEn : messagingPt;

  return (
    <>
      <section className="article-section" id="aws-practical-reference">
        <h2>{t('AWS — serviços e casos práticos', 'AWS — services and practical cases')}</h2>
        <p className="section-summary">{t('Esta parte complementa os níveis do artigo com cenários de arquitetura, IAM e troubleshooting. Cada serviço possui uma representação visual própria baseada na documentação da AWS.', 'This section complements the article levels with architecture, IAM, and troubleshooting scenarios. Each service has its own visual representation based on AWS documentation.')}</p>
      </section>

      <DiagramSection id="aws-iam" title={t('IAM Roles: onde colocar e como pensar permissões', 'IAM Roles: where to attach them and how to design permissions')} diagramKey="iam">
        <p>{t('O padrão preferencial para workloads é usar credenciais temporárias de uma IAM role associada ao runtime. A trust policy responde “quem pode assumir esta role?”; permission policies respondem “o que esta role pode fazer?”.', 'The preferred workload pattern is to use temporary credentials from an IAM role associated with the runtime. The trust policy answers “who can assume this role?” while permission policies answer “what can this role do?”.')}</p>
        <div className="table-wrap"><table className="reference-table"><thead><tr><th>Runtime</th><th>{t('Onde colocar a role', 'Where to attach the role')}</th><th>{t('Uso correto', 'Correct use')}</th></tr></thead><tbody>{roleRows.map(([runtime, where, use]) => <tr key={runtime}><td><strong>{runtime}</strong></td><td>{where}</td><td>{use}</td></tr>)}</tbody></table></div>
        <div className="reference-note"><strong>{t('Princípio:', 'Principle:')}</strong> {t('a aplicação recebe apenas as ações e resources necessários. Roles de infraestrutura — por exemplo node role do EKS ou execution role do ECS — não devem virar um depósito de permissões de negócio.', 'the application receives only the actions and resources it requires. Infrastructure roles — such as an EKS node role or ECS execution role — should not become a container for application business permissions.')}</div>
      </DiagramSection>

      <DiagramSection id="aws-s3" title={t('S3 Buckets, IAM e acesso privado', 'S3 buckets, IAM, and private access')} diagramKey="s3">
        <p>{t('Para uma aplicação ler ou gravar objetos, conceda as ações S3 na IAM role do próprio workload. Bucket policy é uma policy baseada no recurso e complementa o modelo, especialmente para cross-account, negações explícitas, restrições por Organization/VPC Endpoint e outros controles.', 'For an application to read or write objects, grant S3 actions to the IAM role of the workload itself. A bucket policy is a resource-based policy that complements identity permissions, especially for cross-account access, explicit denies, Organization/VPC Endpoint restrictions, and other controls.')}</p>
        <h3>{t('Exemplo mínimo de identity policy', 'Minimal identity policy example')}</h3><pre className="reference-code"><code>{s3PolicyExample}</code></pre>
        <div className="reference-grid">
          <article className="reference-card"><h3>{t('Bucket privado', 'Private bucket')}</h3><p>{t('Mantenha Block Public Access habilitado salvo necessidade deliberada e revisada. Prefira acesso autenticado por IAM.', 'Keep Block Public Access enabled unless public access is deliberate and reviewed. Prefer IAM-authenticated access.')}</p></article>
          <article className="reference-card"><h3>VPC Endpoint</h3><p>{t('S3 Gateway Endpoint permite que workloads na VPC acessem S3 sem atravessar NAT Gateway ou Internet Gateway.', 'An S3 Gateway Endpoint lets VPC workloads reach S3 without traversing a NAT Gateway or Internet Gateway.')}</p></article>
          <article className="reference-card"><h3>SSE-KMS</h3><p>{t('Quando usar uma KMS key gerenciada pelo cliente, o principal precisa também das permissões KMS compatíveis com a operação.', 'When using a customer-managed KMS key, the principal also needs the KMS permissions required by the operation.')}</p></article>
          <article className="reference-card"><h3>Cross-account</h3><p>{t('Valide autorização no principal e no recurso. Uma bucket policy pode confiar explicitamente na role da outra conta.', 'Validate authorization on both the principal and the resource. A bucket policy can explicitly trust a role from another account.')}</p></article>
        </div>
      </DiagramSection>

      <DiagramSection id="aws-rds" title={t('Amazon RDS: disponibilidade, segurança e operação', 'Amazon RDS: availability, security, and operations')} diagramKey="rds">
        <ul className="knowledge-list">{rdsChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="reference-note"><strong>{t('Falha comum em entrevistas:', 'Common interview mistake:')}</strong> {t('Multi-AZ não é sinônimo de Read Replica. Multi-AZ trata disponibilidade/failover; Read Replica é principalmente escala de leitura, conforme engine e configuração.', 'Multi-AZ is not the same as a Read Replica. Multi-AZ addresses availability/failover; a Read Replica primarily addresses read scaling, depending on the engine and configuration.')}</div>
      </DiagramSection>

      <DiagramSection id="aws-lambda" title={t('AWS Lambda: execution role, eventos e VPC', 'AWS Lambda: execution role, events, and VPC')} diagramKey="lambda">
        <div className="reference-grid">
          <article className="reference-card"><h3>Execution Role</h3><p>{t('Permite que o código chame APIs como S3, SQS, DynamoDB, CloudWatch e outras. Use least privilege.', 'Allows function code to call APIs such as S3, SQS, DynamoDB, CloudWatch, and others. Apply least privilege.')}</p></article>
          <article className="reference-card"><h3>Event sources</h3><p>{t('API Gateway, S3, SQS, EventBridge e outros serviços podem invocar ou alimentar a função por modelos diferentes.', 'API Gateway, S3, SQS, EventBridge, and other services can invoke or feed the function through different event models.')}</p></article>
          <article className="reference-card"><h3>{t('Lambda em VPC', 'Lambda in a VPC')}</h3><p>{t('Use quando precisa acessar RDS, caches ou endpoints privados. Internet egress precisa de arquitetura de saída; subnet pública isoladamente não resolve.', 'Use it when the function must reach RDS, caches, or private endpoints. Internet egress requires an outbound design; placing the function in a public subnet alone does not provide Internet access.')}</p></article>
          <article className="reference-card"><h3>{t('Falhas assíncronas', 'Asynchronous failures')}</h3><p>{t('Projete retries, idempotência e destinos/DLQ conforme o modelo de invocação para não duplicar efeitos de negócio.', 'Design retries, idempotency, and destinations/DLQs according to the invocation model to avoid duplicate business effects.')}</p></article>
        </div>
      </DiagramSection>

      <DiagramSection id="aws-ecs" title="Amazon ECS and Fargate" diagramKey="ecs">
        <p>{t('ECS administra tasks e services. Fargate remove a gestão direta de instâncias EC2 para os tasks compatíveis. Separe rigorosamente Task Role — permissões do código — de Task Execution Role — operações feitas pelo ECS/Fargate em nome do task.', 'ECS manages tasks and services. Fargate removes direct EC2 instance management for compatible tasks. Keep the Task Role — application permissions — strictly separate from the Task Execution Role — operational actions performed by ECS/Fargate on behalf of the task.')}</p>
        <div className="command-block"><div><code>taskRoleArn</code><span>{t('S3, SQS, DynamoDB e demais APIs chamadas pela aplicação.', 'S3, SQS, DynamoDB, and other APIs called by the application.')}</span></div><div><code>executionRoleArn</code><span>{t('ECR image pull, CloudWatch Logs e outras integrações operacionais previstas na configuração.', 'ECR image pulls, CloudWatch Logs, and other configured operational integrations.')}</span></div></div>
      </DiagramSection>

      <DiagramSection id="aws-eks" title={t('Amazon EKS: Kubernetes gerenciado e IAM por Pod', 'Amazon EKS: managed Kubernetes and per-Pod IAM')} diagramKey="eks">
        <p>{t('EKS gerencia o control plane. O data plane pode usar managed node groups, self-managed nodes ou Fargate conforme o desenho. Para acesso AWS do workload, use EKS Pod Identity ou IRSA e associe uma role específica à aplicação.', 'EKS manages the control plane. The data plane can use managed node groups, self-managed nodes, or Fargate depending on the design. For workload access to AWS APIs, use EKS Pod Identity or IRSA and associate a dedicated role with the application.')}</p>
        <div className="reference-note"><strong>Anti-pattern:</strong> {t('conceder s3:* ao node IAM role para que um único Pod acesse S3. Isso aumenta o blast radius. Dê a permissão ao Pod/workload.', 'granting s3:* to the node IAM role so one Pod can access S3. This increases blast radius. Grant the permission to the Pod/workload instead.')}</div>
      </DiagramSection>

      <DiagramSection id="aws-messaging" title={t('SNS, SQS, fan-out e DLQ', 'SNS, SQS, fan-out, and DLQ')} diagramKey="messaging">
        <div className="table-wrap"><table className="reference-table"><thead><tr><th>{t('Padrão', 'Pattern')}</th><th>{t('Quando usar', 'When to use')}</th></tr></thead><tbody>{messagingCases.map(([name, use]) => <tr key={name}><td><strong>{name}</strong></td><td>{use}</td></tr>)}</tbody></table></div>
        <p>{t('Consumers de SQS devem ser idempotentes porque retries e redelivery fazem parte do modelo. Configure visibility timeout, retention, redrive policy e DLQ de acordo com o tempo real de processamento e a estratégia de recuperação.', 'SQS consumers should be idempotent because retries and redelivery are part of the model. Configure visibility timeout, retention, redrive policy, and DLQ according to actual processing time and the recovery strategy.')}</p>
      </DiagramSection>

      <DiagramSection id="aws-vpc-internet" title={t('VPC: comunicação com redes externas', 'VPC: communication with external networks')} diagramKey="vpcInternet">
        <div className="reference-grid">{vpcCases.slice(0, 2).map(([title, text]) => <article className="reference-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
        <h3>{t('Checklist de troubleshooting', 'Troubleshooting checklist')}</h3>
        <ol className="network-checklist">{(locale === 'en' ? [
          'Check the route table associated with the subnet and the route actually selected for the destination.', 'Confirm the Internet Gateway, NAT Gateway, or VPC Endpoint and verify that the component is in the correct subnet/state.', 'Validate Security Groups and, when applicable, Network ACLs in both directions.', 'Check DNS, addressing, ports, and the actual destination listener.', 'Use VPC Flow Logs and component logs to distinguish a DROP from missing routing or an application failure.',
        ] : [
          'Verifique a route table associada à subnet e a rota efetivamente escolhida para o destino.', 'Confirme Internet Gateway/NAT Gateway/VPC Endpoint e se o componente está na subnet/estado correto.', 'Valide Security Groups e, quando aplicável, Network ACLs nas duas direções.', 'Cheque DNS, endereçamento, portas e o listener real do destino.', 'Use VPC Flow Logs e logs do componente para distinguir DROP de ausência de rota ou falha de aplicação.',
        ]).map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol>
      </DiagramSection>

      <DiagramSection id="aws-vpc-hybrid" title={t('VPC: comunicação entre VPCs e redes internas/on-premises', 'VPC: communication across VPCs and internal/on-premises networks')} diagramKey="vpcHybrid">
        <div className="reference-grid">{vpcCases.slice(2).map(([title, text]) => <article className="reference-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="reference-note"><strong>{t('Antes de configurar:', 'Before configuring:')}</strong> {t('confirme CIDRs não sobrepostos, modelo de roteamento, necessidade de transitive routing, requisitos de criptografia, throughput, latência, redundância, DNS híbrido e ownership das rotas on-premises.', 'confirm non-overlapping CIDRs, the routing model, whether transitive routing is required, encryption requirements, throughput, latency, redundancy, hybrid DNS, and ownership of on-premises routes.')}</div>
      </DiagramSection>

      <DiagramSection id="aws-vpn" title="AWS VPN: Site-to-Site VPN and Client VPN" diagramKey="vpn">
        <p>{t('Site-to-Site VPN conecta uma rede on-premises à AWS por túneis IPsec e usa Customer Gateway no lado do cliente. O lado AWS pode ser Virtual Private Gateway ou Transit Gateway. A conexão fornece dois túneis para redundância. AWS Client VPN resolve outro problema: acesso remoto de usuários/clientes a redes autorizadas.', 'Site-to-Site VPN connects an on-premises network to AWS through IPsec tunnels and uses a Customer Gateway on the customer side. The AWS side can use a Virtual Private Gateway or Transit Gateway. The connection provides two tunnels for redundancy. AWS Client VPN solves a different problem: remote client/user access to authorized networks.')}</p>
        <div className="reference-grid">
          <article className="reference-card"><h3>Routing</h3><p>{t('Use rotas estáticas ou BGP conforme a configuração suportada. Valide sempre ida e retorno.', 'Use static routes or BGP according to the supported configuration. Always validate both forward and return paths.')}</p></article>
          <article className="reference-card"><h3>{t('Redundância', 'Redundancy')}</h3><p>{t('Configure o customer gateway para utilizar os dois túneis quando possível; não trate o segundo túnel como decoração.', 'Configure the customer gateway to use both tunnels when possible; do not treat the second tunnel as decorative.')}</p></article>
          <article className="reference-card"><h3>Transit Gateway</h3><p>{t('É indicado quando VPN precisa alcançar várias VPCs e o desenho pede roteamento centralizado.', 'It is appropriate when the VPN must reach multiple VPCs and the design calls for centralized routing.')}</p></article>
          <article className="reference-card"><h3>{t('Observabilidade', 'Observability')}</h3><p>{t('Monitore estado dos túneis, BGP, rotas anunciadas, métricas e logs disponíveis antes de investigar camadas superiores.', 'Monitor tunnel state, BGP, advertised routes, metrics, and available logs before investigating higher layers.')}</p></article>
        </div>
      </DiagramSection>
    </>
  );
}
