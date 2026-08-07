import { TopicDiagram } from './topic-diagram';
import { awsServiceDiagrams } from '@/content/aws-diagrams';

const roleRows = [
  ['EC2', 'IAM role via Instance Profile', 'Associe a role à instância. A aplicação usa credenciais temporárias entregues pelo metadata service; evite access keys no filesystem.'],
  ['Lambda', 'Execution Role', 'Configure na função. Essa role define quais APIs AWS o código da Lambda pode chamar.'],
  ['ECS', 'Task Role', 'Configure no task definition para permissões da aplicação. Não confunda com Task Execution Role, usada pelo ECS/Fargate para ações operacionais.'],
  ['EKS', 'EKS Pod Identity ou IRSA', 'Associe IAM por workload/ServiceAccount. Evite conceder permissões S3 da aplicação ao node role.'],
  ['CI/CD externo', 'AssumeRole via OIDC/STS', 'O pipeline autentica no IdP/OIDC e assume uma role temporária. Evite chaves AWS de longa duração.'],
];

const s3PolicyExample = `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::my-app-bucket/app/*"
  }]
}`;

const rdsChecklist = [
  'DB subnet group em pelo menos duas AZs quando a arquitetura exigir Multi-AZ.',
  'Instâncias de aplicação e RDS em subnets privadas quando não houver necessidade de exposição pública.',
  'Security Group do RDS permitindo a porta do engine a partir do Security Group da aplicação, em vez de CIDRs amplos.',
  'Backups automáticos, snapshots, janela de manutenção e estratégia de restore testada.',
  'Multi-AZ para alta disponibilidade; Read Replicas para escala de leitura — são objetivos diferentes.',
  'Secrets Manager ou mecanismo equivalente para credenciais; IAM DB Authentication quando suportado e apropriado.',
];

const vpcCases = [
  {
    title: 'Internet → aplicação privada',
    text: 'Internet Gateway recebe tráfego em recursos públicos, tipicamente um ALB. O ALB encaminha para targets em subnets privadas. Security Groups restringem a comunicação entre as camadas.',
  },
  {
    title: 'Aplicação privada → Internet',
    text: 'Para IPv4, workloads em subnets privadas normalmente usam rota default para NAT Gateway em subnet pública, que por sua vez usa Internet Gateway. NAT não é necessário para destinos acessados por VPC Endpoint adequado.',
  },
  {
    title: 'VPC ↔ VPC',
    text: 'VPC Peering funciona bem para conexões diretas e não transitivas. Em topologias com muitas VPCs, Transit Gateway reduz o número de relações ponto a ponto e centraliza roteamento.',
  },
  {
    title: 'VPC ↔ on-premises',
    text: 'AWS Site-to-Site VPN usa IPsec sobre a Internet. Direct Connect fornece conectividade dedicada. Transit Gateway pode concentrar VPN, Direct Connect e múltiplas VPCs.',
  },
  {
    title: 'Usuário remoto → VPC',
    text: 'AWS Client VPN fornece acesso remoto baseado em cliente. É diferente de Site-to-Site VPN, que conecta redes/gateways.',
  },
];

const messagingCases = [
  ['SQS', 'Fila durável, pull-based, buffering, retry, workers assíncronos e DLQ.'],
  ['SNS', 'Pub/sub e fan-out para múltiplos subscribers, incluindo SQS, Lambda e endpoints suportados.'],
  ['SNS + SQS', 'Cada consumidor recebe sua própria fila; bom para fan-out durável e ritmos de consumo independentes.'],
];

function DiagramSection({ id, title, children, diagramKey }: { id: string; title: string; children: React.ReactNode; diagramKey: keyof typeof awsServiceDiagrams }) {
  return (
    <section className="article-section" id={id}>
      <h2>{title}</h2>
      {children}
      <TopicDiagram spec={awsServiceDiagrams[diagramKey]} />
    </section>
  );
}

export function AwsReference() {
  return (
    <>
      <section className="article-section" id="aws-practical-reference">
        <h2>AWS — serviços e casos práticos</h2>
        <p className="section-summary">
          Esta parte complementa os níveis do artigo com cenários de arquitetura, IAM e troubleshooting. Cada serviço possui uma representação visual própria baseada na documentação da AWS.
        </p>
      </section>

      <DiagramSection id="aws-iam" title="IAM Roles: onde colocar e como pensar permissões" diagramKey="iam">
        <p>
          O padrão preferencial para workloads é usar credenciais temporárias de uma IAM role associada ao runtime. A trust policy responde “quem pode assumir esta role?”; permission policies respondem “o que esta role pode fazer?”.
        </p>
        <div className="table-wrap">
          <table className="reference-table">
            <thead><tr><th>Runtime</th><th>Onde colocar a role</th><th>Uso correto</th></tr></thead>
            <tbody>{roleRows.map(([runtime, where, use]) => <tr key={runtime}><td><strong>{runtime}</strong></td><td>{where}</td><td>{use}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="reference-note">
          <strong>Princípio:</strong> a aplicação recebe apenas as ações e resources necessários. Roles de infraestrutura — por exemplo node role do EKS ou execution role do ECS — não devem virar um depósito de permissões de negócio.
        </div>
      </DiagramSection>

      <DiagramSection id="aws-s3" title="S3 Buckets, IAM e acesso privado" diagramKey="s3">
        <p>
          Para uma aplicação ler ou gravar objetos, conceda as ações S3 na IAM role do próprio workload. Bucket policy é uma policy baseada no recurso e complementa o modelo, especialmente para cross-account, negações explícitas, restrições por Organization/VPC Endpoint e outros controles.
        </p>
        <h3>Exemplo mínimo de identity policy</h3>
        <pre className="reference-code"><code>{s3PolicyExample}</code></pre>
        <div className="reference-grid">
          <article className="reference-card"><h3>Bucket privado</h3><p>Mantenha Block Public Access habilitado salvo necessidade deliberada e revisada. Prefira acesso autenticado por IAM.</p></article>
          <article className="reference-card"><h3>VPC Endpoint</h3><p>S3 Gateway Endpoint permite que workloads na VPC acessem S3 sem atravessar NAT Gateway ou Internet Gateway.</p></article>
          <article className="reference-card"><h3>SSE-KMS</h3><p>Quando usar uma KMS key gerenciada pelo cliente, o principal precisa também das permissões KMS compatíveis com a operação.</p></article>
          <article className="reference-card"><h3>Cross-account</h3><p>Valide autorização no principal e no recurso. Uma bucket policy pode confiar explicitamente na role da outra conta.</p></article>
        </div>
      </DiagramSection>

      <DiagramSection id="aws-rds" title="Amazon RDS: disponibilidade, segurança e operação" diagramKey="rds">
        <ul className="knowledge-list">{rdsChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="reference-note">
          <strong>Falha comum em entrevistas:</strong> Multi-AZ não é sinônimo de Read Replica. Multi-AZ trata disponibilidade/failover; Read Replica é principalmente escala de leitura, conforme engine e configuração.
        </div>
      </DiagramSection>

      <DiagramSection id="aws-lambda" title="AWS Lambda: execution role, eventos e VPC" diagramKey="lambda">
        <div className="reference-grid">
          <article className="reference-card"><h3>Execution Role</h3><p>Permite que o código chame APIs como S3, SQS, DynamoDB, CloudWatch e outras. Use least privilege.</p></article>
          <article className="reference-card"><h3>Event sources</h3><p>API Gateway, S3, SQS, EventBridge e outros serviços podem invocar ou alimentar a função por modelos diferentes.</p></article>
          <article className="reference-card"><h3>Lambda em VPC</h3><p>Use quando precisa acessar RDS, caches ou endpoints privados. Internet egress precisa de arquitetura de saída; subnet pública isoladamente não resolve.</p></article>
          <article className="reference-card"><h3>Falhas assíncronas</h3><p>Projete retries, idempotência e destinos/DLQ conforme o modelo de invocação para não duplicar efeitos de negócio.</p></article>
        </div>
      </DiagramSection>

      <DiagramSection id="aws-ecs" title="Amazon ECS e Fargate" diagramKey="ecs">
        <p>
          ECS administra tasks e services. Fargate remove a gestão direta de instâncias EC2 para os tasks compatíveis. Separe rigorosamente <strong>Task Role</strong> — permissões do código — de <strong>Task Execution Role</strong> — operações feitas pelo ECS/Fargate em nome do task.
        </p>
        <div className="command-block">
          <div><code>taskRoleArn</code><span>S3, SQS, DynamoDB e demais APIs chamadas pela aplicação.</span></div>
          <div><code>executionRoleArn</code><span>ECR image pull, CloudWatch Logs e outras integrações operacionais previstas na configuração.</span></div>
        </div>
      </DiagramSection>

      <DiagramSection id="aws-eks" title="Amazon EKS: Kubernetes gerenciado e IAM por Pod" diagramKey="eks">
        <p>
          EKS gerencia o control plane. O data plane pode usar managed node groups, self-managed nodes ou Fargate conforme o desenho. Para acesso AWS do workload, use EKS Pod Identity ou IRSA e associe uma role específica à aplicação.
        </p>
        <div className="reference-note">
          <strong>Anti-pattern:</strong> conceder <code>s3:*</code> ao node IAM role para que um único Pod acesse S3. Isso aumenta o blast radius. Dê a permissão ao Pod/workload.
        </div>
      </DiagramSection>

      <DiagramSection id="aws-messaging" title="SNS, SQS, fan-out e DLQ" diagramKey="messaging">
        <div className="table-wrap">
          <table className="reference-table"><thead><tr><th>Padrão</th><th>Quando usar</th></tr></thead><tbody>{messagingCases.map(([name, use]) => <tr key={name}><td><strong>{name}</strong></td><td>{use}</td></tr>)}</tbody></table>
        </div>
        <p>
          Consumers de SQS devem ser idempotentes porque retries e redelivery fazem parte do modelo. Configure visibility timeout, retention, redrive policy e DLQ de acordo com o tempo real de processamento e a estratégia de recuperação.
        </p>
      </DiagramSection>

      <DiagramSection id="aws-vpc-internet" title="VPC: comunicação com redes externas" diagramKey="vpcInternet">
        <div className="reference-grid">{vpcCases.slice(0, 2).map((item) => <article className="reference-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        <h3>Checklist de troubleshooting</h3>
        <ol className="network-checklist">
          {[
            'Verifique a route table associada à subnet e a rota efetivamente escolhida para o destino.',
            'Confirme Internet Gateway/NAT Gateway/VPC Endpoint e se o componente está na subnet/estado correto.',
            'Valide Security Groups e, quando aplicável, Network ACLs nas duas direções.',
            'Cheque DNS, endereçamento, portas e o listener real do destino.',
            'Use VPC Flow Logs e logs do componente para distinguir DROP de ausência de rota ou falha de aplicação.',
          ].map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}
        </ol>
      </DiagramSection>

      <DiagramSection id="aws-vpc-hybrid" title="VPC: comunicação entre VPCs e redes internas/on-premises" diagramKey="vpcHybrid">
        <div className="reference-grid">{vpcCases.slice(2).map((item) => <article className="reference-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        <div className="reference-note">
          <strong>Antes de configurar:</strong> confirme CIDRs não sobrepostos, modelo de roteamento, necessidade de transitive routing, requisitos de criptografia, throughput, latência, redundância, DNS híbrido e ownership das rotas on-premises.
        </div>
      </DiagramSection>

      <DiagramSection id="aws-vpn" title="AWS VPN: Site-to-Site VPN e Client VPN" diagramKey="vpn">
        <p>
          <strong>Site-to-Site VPN</strong> conecta uma rede on-premises à AWS por túneis IPsec e usa Customer Gateway no lado do cliente. O lado AWS pode ser Virtual Private Gateway ou Transit Gateway. A conexão fornece dois túneis para redundância. <strong>AWS Client VPN</strong> resolve outro problema: acesso remoto de usuários/clientes a redes autorizadas.
        </p>
        <div className="reference-grid">
          <article className="reference-card"><h3>Routing</h3><p>Use rotas estáticas ou BGP conforme a configuração suportada. Valide sempre ida e retorno.</p></article>
          <article className="reference-card"><h3>Redundância</h3><p>Configure o customer gateway para utilizar os dois túneis quando possível; não trate o segundo túnel como decoração.</p></article>
          <article className="reference-card"><h3>Transit Gateway</h3><p>É indicado quando VPN precisa alcançar várias VPCs e o desenho pede roteamento centralizado.</p></article>
          <article className="reference-card"><h3>Observabilidade</h3><p>Monitore estado dos túneis, BGP, rotas anunciadas, métricas e logs disponíveis antes de investigar camadas superiores.</p></article>
        </div>
      </DiagramSection>
    </>
  );
}
