import type { DiagramSpec, InterviewVisual } from './diagrams';

type Catalog = {
  sections: Record<string, DiagramSpec>;
  interviews: Record<string, InterviewVisual>;
};

const src = {
  iamRoles: { label: 'AWS IAM — Roles', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' },
  s3Access: { label: 'Amazon S3 — Access management', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-management.html' },
  s3Endpoints: { label: 'Amazon VPC — Gateway endpoints for S3', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html' },
  rdsMultiAz: { label: 'Amazon RDS — Multi-AZ deployments', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' },
  rdsIam: { label: 'Amazon RDS — IAM database authentication', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html' },
  lambdaRole: { label: 'AWS Lambda — Execution role', url: 'https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html' },
  lambdaVpc: { label: 'AWS Lambda — VPC networking', url: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html' },
  eksIam: { label: 'Amazon EKS — IAM roles for service accounts', url: 'https://docs.aws.amazon.com/eks/latest/userguide/iam-roles-for-service-accounts.html' },
  eksPodIdentity: { label: 'Amazon EKS — Pod Identity', url: 'https://docs.aws.amazon.com/eks/latest/userguide/pod-identities.html' },
  ecsRoles: { label: 'Amazon ECS — IAM roles for tasks', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html' },
  ecsExecution: { label: 'Amazon ECS — Task execution IAM role', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html' },
  sns: { label: 'Amazon SNS — Developer Guide', url: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html' },
  sqs: { label: 'Amazon SQS — Developer Guide', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' },
  sqsDlq: { label: 'Amazon SQS — Dead-letter queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' },
  vpc: { label: 'Amazon VPC — How Amazon VPC works', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html' },
  peering: { label: 'Amazon VPC — VPC Peering', url: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html' },
  tgw: { label: 'AWS Transit Gateway — How it works', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/how-transit-gateways-work.html' },
  siteVpn: { label: 'AWS Site-to-Site VPN — How it works', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/how_it_works.html' },
  clientVpn: { label: 'AWS Client VPN — What is Client VPN?', url: 'https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html' },
  dx: { label: 'AWS Direct Connect — User Guide', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' },
  nat: { label: 'Amazon VPC — NAT gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' },
  igw: { label: 'Amazon VPC — Internet gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' },
  sgNacl: { label: 'Amazon VPC — Security groups and NACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/infrastructure-security.html' },
};

export const awsServiceDiagrams: Record<string, DiagramSpec> = {
  iam: {
    title: 'IAM: principal assume role e recebe credenciais temporárias',
    description: 'Uma role contém uma trust policy que define quem pode assumi-la e permission policies que definem o que as credenciais temporárias podem fazer. Aplicações devem usar roles associadas ao runtime em vez de access keys estáticas.',
    width: 1050, height: 370,
    nodes: [
      { id: 'principal', label: 'Principal\nEC2 · Lambda · ECS · Pod · IdP', x: 25, y: 135, width: 190, kind: 'client' },
      { id: 'trust', label: 'Trust policy\nQuem pode assumir?', x: 265, y: 55, kind: 'security' },
      { id: 'sts', label: 'AWS STS\nAssumeRole', x: 265, y: 215, kind: 'control' },
      { id: 'role', label: 'IAM Role', x: 505, y: 135, kind: 'security' },
      { id: 'creds', label: 'Credenciais\ntemporárias', x: 710, y: 55, kind: 'data' },
      { id: 'resource', label: 'AWS API / Resource', x: 865, y: 215, kind: 'workload' },
      { id: 'policy', label: 'Permission policy\nO que pode fazer?', x: 710, y: 215, kind: 'security' },
    ],
    edges: [
      { from: 'principal', to: 'trust', label: 'identidade' },
      { from: 'principal', to: 'sts', label: 'assume', animated: true },
      { from: 'trust', to: 'role' },
      { from: 'sts', to: 'role' },
      { from: 'role', to: 'creds', animated: true },
      { from: 'role', to: 'policy' },
      { from: 'creds', to: 'resource', label: 'signed API call', animated: true },
      { from: 'policy', to: 'resource', label: 'authorize' },
    ], sources: [src.iamRoles],
  },
  s3: {
    title: 'S3 privado com IAM role e VPC endpoint',
    description: 'O workload recebe credenciais temporárias por uma IAM role. A identity policy concede as ações S3 necessárias; a bucket policy pode restringir principals/condições e é essencial em cenários cross-account. Um Gateway VPC Endpoint permite acesso privado ao S3 sem NAT/Internet Gateway.',
    width: 1120, height: 440,
    nodes: [
      { id: 'app', label: 'Workload\nEC2 · Lambda · ECS · EKS', x: 25, y: 175, width: 190, kind: 'workload' },
      { id: 'role', label: 'IAM Role\nleast privilege', x: 265, y: 70, kind: 'security' },
      { id: 'identity', label: 'Identity policy\ns3:GetObject etc.', x: 500, y: 45, kind: 'security' },
      { id: 'endpoint', label: 'S3 Gateway\nVPC Endpoint', x: 500, y: 235, kind: 'network' },
      { id: 'bucket', label: 'Private S3 Bucket', x: 790, y: 175, kind: 'data' },
      { id: 'bucketpolicy', label: 'Bucket policy\nresource policy', x: 790, y: 45, kind: 'security' },
      { id: 'kms', label: 'KMS key\n(optional SSE-KMS)', x: 940, y: 315, kind: 'security' },
    ],
    edges: [
      { from: 'app', to: 'role', label: 'runtime association' },
      { from: 'role', to: 'identity', label: 'permissions' },
      { from: 'app', to: 'endpoint', label: 'private route', animated: true },
      { from: 'endpoint', to: 'bucket', animated: true },
      { from: 'identity', to: 'bucket', label: 'allow actions' },
      { from: 'bucketpolicy', to: 'bucket', label: 'resource constraints' },
      { from: 'bucket', to: 'kms', label: 'encrypt/decrypt' },
    ], sources: [src.s3Access, src.s3Endpoints, src.iamRoles],
  },
  rds: {
    title: 'RDS Multi-AZ em subnets privadas',
    description: 'A aplicação acessa o endpoint RDS em subnets privadas. Em Multi-AZ, a AWS mantém uma réplica standby em outra AZ para alta disponibilidade. Read Replica é uma funcionalidade distinta, usada principalmente para escalar leituras.',
    width: 1120, height: 430,
    nodes: [
      { id: 'app', label: 'Application\nprivate subnets', x: 25, y: 165, kind: 'workload' },
      { id: 'sgapp', label: 'App Security Group', x: 235, y: 165, kind: 'security' },
      { id: 'rdsendpoint', label: 'RDS endpoint', x: 450, y: 165, kind: 'network' },
      { id: 'primary', label: 'Primary DB\nAZ-A', x: 680, y: 75, kind: 'data' },
      { id: 'standby', label: 'Standby DB\nAZ-B', x: 680, y: 255, kind: 'data' },
      { id: 'sgrds', label: 'DB Security Group\nallow from App SG', x: 885, y: 165, width: 205, kind: 'security' },
    ],
    edges: [
      { from: 'app', to: 'sgapp' }, { from: 'sgapp', to: 'rdsendpoint', label: 'DB port', animated: true },
      { from: 'rdsendpoint', to: 'primary', animated: true }, { from: 'primary', to: 'standby', label: 'synchronous standby', animated: true },
      { from: 'sgrds', to: 'primary', label: 'network policy' }, { from: 'sgrds', to: 'standby', label: 'network policy' },
    ], sources: [src.rdsMultiAz, src.rdsIam],
  },
  lambda: {
    title: 'Lambda: event source, execution role e VPC opcional',
    description: 'A execution role autoriza a função a chamar APIs AWS. Ao conectar Lambda a uma VPC, a função ganha acesso aos recursos privados dessa VPC; saída para Internet precisa ser projetada, por exemplo via NAT, enquanto VPC endpoints podem fornecer acesso privado a serviços AWS suportados.',
    width: 1120, height: 420,
    nodes: [
      { id: 'event', label: 'Event source\nAPI · S3 · SQS · EventBridge', x: 20, y: 160, width: 205, kind: 'client' },
      { id: 'fn', label: 'Lambda Function', x: 290, y: 160, kind: 'workload' },
      { id: 'role', label: 'Execution Role', x: 290, y: 45, kind: 'security' },
      { id: 'private', label: 'Private VPC resource\nRDS / internal API', x: 535, y: 70, width: 190, kind: 'data' },
      { id: 'endpoint', label: 'VPC Endpoint', x: 535, y: 250, kind: 'network' },
      { id: 'awsapi', label: 'AWS Service API', x: 800, y: 250, kind: 'control' },
      { id: 'nat', label: 'NAT Gateway\nfor Internet egress', x: 800, y: 70, kind: 'network' },
      { id: 'internet', label: 'Internet API', x: 980, y: 70, width: 120, kind: 'network' },
    ],
    edges: [
      { from: 'event', to: 'fn', animated: true }, { from: 'role', to: 'fn', label: 'credentials' },
      { from: 'fn', to: 'private', label: 'ENI/VPC path' }, { from: 'fn', to: 'endpoint', animated: true },
      { from: 'endpoint', to: 'awsapi', animated: true }, { from: 'fn', to: 'nat' }, { from: 'nat', to: 'internet', animated: true },
    ], sources: [src.lambdaRole, src.lambdaVpc],
  },
  ecs: {
    title: 'ECS/Fargate: execution role versus task role',
    description: 'A task execution role é usada pelo ECS/Fargate para operações de infraestrutura como pull de imagem e envio de logs. A task role é entregue ao código da aplicação dentro do task e deve conter permissões de negócio, por exemplo acesso a S3 ou SQS.',
    width: 1100, height: 410,
    nodes: [
      { id: 'service', label: 'ECS Service', x: 25, y: 160, kind: 'control' },
      { id: 'task', label: 'ECS Task / Fargate', x: 260, y: 160, kind: 'workload' },
      { id: 'execrole', label: 'Task Execution Role', x: 485, y: 45, kind: 'security' },
      { id: 'taskrole', label: 'Task Role', x: 485, y: 245, kind: 'security' },
      { id: 'ecrlogs', label: 'ECR / CloudWatch Logs', x: 750, y: 45, width: 190, kind: 'control' },
      { id: 'business', label: 'S3 / SQS / DynamoDB\napplication APIs', x: 750, y: 245, width: 200, kind: 'data' },
      { id: 'alb', label: 'ALB', x: 955, y: 160, width: 100, kind: 'network' },
    ],
    edges: [
      { from: 'service', to: 'task', animated: true }, { from: 'execrole', to: 'task' }, { from: 'taskrole', to: 'task' },
      { from: 'execrole', to: 'ecrlogs', label: 'pull/logs' }, { from: 'taskrole', to: 'business', label: 'app permissions', animated: true },
      { from: 'alb', to: 'task', label: 'traffic', animated: true },
    ], sources: [src.ecsRoles, src.ecsExecution],
  },
  eks: {
    title: 'EKS: managed control plane, data plane e IAM por workload',
    description: 'O EKS gerencia o Kubernetes control plane. Pods executam em EC2 managed node groups ou Fargate. Permissões AWS da aplicação devem ser entregues ao Pod por EKS Pod Identity ou IRSA, evitando concentrar acesso de aplicação no node IAM role.',
    width: 1140, height: 470,
    nodes: [
      { id: 'kubectl', label: 'kubectl / CI', x: 25, y: 185, kind: 'client' },
      { id: 'api', label: 'EKS managed\nKubernetes API', x: 245, y: 75, kind: 'control' },
      { id: 'nodes', label: 'Managed Node Group\nor Fargate', x: 245, y: 285, kind: 'workload' },
      { id: 'pod', label: 'Application Pod', x: 500, y: 285, kind: 'workload' },
      { id: 'sa', label: 'Service Account /\nPod Identity association', x: 500, y: 75, width: 195, kind: 'security' },
      { id: 'role', label: 'Workload IAM Role', x: 760, y: 75, kind: 'security' },
      { id: 's3', label: 'S3 / SQS / AWS API', x: 960, y: 75, width: 155, kind: 'data' },
      { id: 'nodeRole', label: 'Node IAM Role\nnode infrastructure only', x: 760, y: 285, width: 195, kind: 'security' },
    ],
    edges: [
      { from: 'kubectl', to: 'api', animated: true }, { from: 'api', to: 'nodes', label: 'desired state' }, { from: 'nodes', to: 'pod' },
      { from: 'sa', to: 'pod', label: 'identity' }, { from: 'sa', to: 'role' }, { from: 'role', to: 's3', label: 'temporary credentials', animated: true },
      { from: 'nodeRole', to: 'nodes', label: 'node operations' },
    ], sources: [src.eksPodIdentity, src.eksIam],
  },
  messaging: {
    title: 'SNS + SQS: fan-out assíncrono e consumidores independentes',
    description: 'SNS publica uma mensagem para múltiplas subscriptions. Filas SQS desacoplam cada consumidor, absorvem picos e permitem retries. Uma DLQ recebe mensagens que excedem a política de redrive configurada.',
    width: 1120, height: 450,
    nodes: [
      { id: 'publisher', label: 'Publisher', x: 25, y: 180, kind: 'client' },
      { id: 'sns', label: 'SNS Topic', x: 220, y: 180, kind: 'network' },
      { id: 'q1', label: 'SQS Queue A', x: 470, y: 70, kind: 'data' },
      { id: 'q2', label: 'SQS Queue B', x: 470, y: 260, kind: 'data' },
      { id: 'c1', label: 'Consumer A', x: 720, y: 70, kind: 'workload' },
      { id: 'c2', label: 'Consumer B', x: 720, y: 260, kind: 'workload' },
      { id: 'dlq', label: 'Dead-letter Queue', x: 930, y: 165, kind: 'data' },
    ],
    edges: [
      { from: 'publisher', to: 'sns', label: 'publish', animated: true }, { from: 'sns', to: 'q1', label: 'subscription', animated: true },
      { from: 'sns', to: 'q2', label: 'subscription', animated: true }, { from: 'q1', to: 'c1', label: 'poll', animated: true },
      { from: 'q2', to: 'c2', label: 'poll', animated: true }, { from: 'q1', to: 'dlq', label: 'redrive after failures' },
      { from: 'q2', to: 'dlq', label: 'redrive after failures' },
    ], sources: [src.sns, src.sqs, src.sqsDlq],
  },
  vpcInternet: {
    title: 'VPC: subnets públicas e privadas com entrada e saída controladas',
    description: 'Uma subnet é pública quando sua route table possui rota para um Internet Gateway e o recurso possui endereçamento/configuração compatível. Workloads privados podem iniciar conexões IPv4 para a Internet via NAT Gateway em subnet pública, sem aceitar conexões de entrada iniciadas pela Internet.',
    width: 1160, height: 460,
    nodes: [
      { id: 'internet', label: 'Internet', x: 20, y: 185, kind: 'network' },
      { id: 'igw', label: 'Internet Gateway', x: 190, y: 185, kind: 'network' },
      { id: 'alb', label: 'Public ALB\npublic subnet', x: 405, y: 65, kind: 'network' },
      { id: 'nat', label: 'NAT Gateway\npublic subnet', x: 405, y: 285, kind: 'network' },
      { id: 'app', label: 'App / ECS / EKS\nprivate subnet', x: 680, y: 185, kind: 'workload' },
      { id: 'rds', label: 'RDS\nprivate DB subnets', x: 920, y: 65, kind: 'data' },
      { id: 'endpoint', label: 'VPC Endpoint\nS3 / AWS APIs', x: 920, y: 285, kind: 'network' },
    ],
    edges: [
      { from: 'internet', to: 'igw', bidirectional: true, animated: true }, { from: 'igw', to: 'alb', label: 'inbound HTTPS' },
      { from: 'alb', to: 'app', label: 'private target', animated: true }, { from: 'app', to: 'rds', label: 'DB traffic' },
      { from: 'app', to: 'nat', label: 'Internet egress' }, { from: 'nat', to: 'igw', animated: true },
      { from: 'app', to: 'endpoint', label: 'private AWS API', animated: true },
    ], sources: [src.vpc, src.igw, src.nat],
  },
  vpcHybrid: {
    title: 'Conectividade híbrida: VPCs, Transit Gateway, VPN e Direct Connect',
    description: 'Para múltiplas VPCs e redes on-premises, Transit Gateway pode atuar como hub de roteamento. Site-to-Site VPN fornece túneis IPsec sobre a Internet; Direct Connect fornece conectividade dedicada. Rotas de ida e retorno e CIDRs não sobrepostos continuam essenciais.',
    width: 1180, height: 490,
    nodes: [
      { id: 'vpcA', label: 'VPC A\n10.10.0.0/16', x: 25, y: 65, kind: 'network' },
      { id: 'vpcB', label: 'VPC B\n10.20.0.0/16', x: 25, y: 315, kind: 'network' },
      { id: 'tgw', label: 'Transit Gateway', x: 365, y: 190, kind: 'control' },
      { id: 'vpn', label: 'Site-to-Site VPN\n2 IPsec tunnels', x: 625, y: 75, kind: 'security' },
      { id: 'dx', label: 'Direct Connect', x: 625, y: 305, kind: 'network' },
      { id: 'cgw', label: 'Customer Gateway /\nOn-prem router', x: 880, y: 190, width: 195, kind: 'network' },
      { id: 'lan', label: 'On-prem network\n172.16.0.0/16', x: 1000, y: 365, width: 155, kind: 'data' },
    ],
    edges: [
      { from: 'vpcA', to: 'tgw', label: 'TGW attachment', animated: true }, { from: 'vpcB', to: 'tgw', label: 'TGW attachment', animated: true },
      { from: 'tgw', to: 'vpn', label: 'VPN attachment' }, { from: 'tgw', to: 'dx', label: 'DX path' },
      { from: 'vpn', to: 'cgw', label: 'IPsec/BGP', bidirectional: true, animated: true }, { from: 'dx', to: 'cgw', label: 'private connectivity', bidirectional: true },
      { from: 'cgw', to: 'lan', bidirectional: true },
    ], sources: [src.tgw, src.siteVpn, src.dx],
  },
  vpn: {
    title: 'AWS Site-to-Site VPN: dois túneis entre AWS e customer gateway',
    description: 'Uma Site-to-Site VPN conecta o customer gateway on-premises a um Virtual Private Gateway ou Transit Gateway. A conexão inclui dois túneis para redundância; BGP é usado quando a configuração dinâmica é selecionada e o equipamento suporta.',
    width: 1060, height: 410,
    nodes: [
      { id: 'lan', label: 'On-prem network', x: 20, y: 160, kind: 'data' },
      { id: 'cgw', label: 'Customer Gateway\nrouter/firewall', x: 225, y: 160, kind: 'network' },
      { id: 'tun1', label: 'IPsec Tunnel 1', x: 485, y: 70, kind: 'security' },
      { id: 'tun2', label: 'IPsec Tunnel 2', x: 485, y: 255, kind: 'security' },
      { id: 'awsGw', label: 'VGW or Transit Gateway', x: 735, y: 160, width: 195, kind: 'control' },
      { id: 'vpc', label: 'AWS VPC', x: 950, y: 160, width: 90, kind: 'network' },
    ],
    edges: [
      { from: 'lan', to: 'cgw', bidirectional: true }, { from: 'cgw', to: 'tun1', label: 'IPsec/BGP', bidirectional: true, animated: true },
      { from: 'cgw', to: 'tun2', label: 'IPsec/BGP', bidirectional: true, animated: true }, { from: 'tun1', to: 'awsGw' }, { from: 'tun2', to: 'awsGw' },
      { from: 'awsGw', to: 'vpc', label: 'route tables', bidirectional: true },
    ], sources: [src.siteVpn],
  },
};

const aws: Catalog = {
  sections: {
    fundamentos: awsServiceDiagrams.iam,
    arquitetura: awsServiceDiagrams.rds,
    'rede-seguranca': awsServiceDiagrams.vpcInternet,
    especialista: awsServiceDiagrams.vpcHybrid,
  },
  interviews: {
    'Qual é a diferença entre Security Group e Network ACL?': {
      answer: 'Security Groups são firewalls virtuais stateful associados a recursos/ENIs: tráfego de resposta é permitido pelo estado da conexão. Network ACLs são filtros stateless associados à subnet, com regras de entrada e saída avaliadas separadamente. Em arquiteturas comuns, Security Groups expressam regras entre workloads; NACLs oferecem uma camada adicional no limite da subnet.',
      diagram: {
        title: 'Security Group versus Network ACL',
        description: 'NACL atua no limite da subnet; Security Group atua junto à interface/recurso. A natureza stateful versus stateless muda como regras de retorno são tratadas.',
        width: 980, height: 340,
        nodes: [
          { id: 'client', label: 'Client', x: 25, y: 115, kind: 'client' },
          { id: 'nacl', label: 'Network ACL\nstateless · subnet', x: 245, y: 115, kind: 'security' },
          { id: 'subnet', label: 'Subnet', x: 470, y: 115, kind: 'network' },
          { id: 'sg', label: 'Security Group\nstateful · ENI/resource', x: 650, y: 115, width: 190, kind: 'security' },
          { id: 'instance', label: 'Workload', x: 865, y: 115, width: 90, kind: 'workload' },
        ],
        edges: [
          { from: 'client', to: 'nacl', label: 'inbound rule' }, { from: 'nacl', to: 'subnet' }, { from: 'subnet', to: 'sg' }, { from: 'sg', to: 'instance', label: 'stateful allow', animated: true },
        ], sources: [src.sgNacl],
      },
    },
    'Como projetar uma aplicação altamente disponível em duas AZs?': {
      answer: 'Distribua a camada de entrada e de aplicação em pelo menos duas AZs, usando um load balancer e capacidade saudável em ambas. Para banco relacional, RDS Multi-AZ pode fornecer standby em outra AZ. Evite dependência de um único NAT Gateway ou componente zonal quando o requisito exigir tolerância à falha de AZ e teste failover, health checks e recuperação.',
      diagram: {
        title: 'Aplicação Multi-AZ com ALB, compute e RDS Multi-AZ',
        description: 'O tráfego entra por um ALB e pode ser atendido por workloads em duas AZs; o banco mantém primary e standby em AZs distintas.',
        width: 1080, height: 430,
        nodes: [
          { id: 'internet', label: 'Clients', x: 20, y: 170, kind: 'client' }, { id: 'alb', label: 'Application Load Balancer', x: 210, y: 170, width: 190, kind: 'network' },
          { id: 'appA', label: 'App AZ-A', x: 470, y: 70, kind: 'workload' }, { id: 'appB', label: 'App AZ-B', x: 470, y: 270, kind: 'workload' },
          { id: 'dbA', label: 'RDS Primary\nAZ-A', x: 760, y: 70, kind: 'data' }, { id: 'dbB', label: 'RDS Standby\nAZ-B', x: 760, y: 270, kind: 'data' },
        ],
        edges: [
          { from: 'internet', to: 'alb', animated: true }, { from: 'alb', to: 'appA', animated: true }, { from: 'alb', to: 'appB', animated: true },
          { from: 'appA', to: 'dbA' }, { from: 'appB', to: 'dbA' }, { from: 'dbA', to: 'dbB', label: 'Multi-AZ standby', animated: true },
        ], sources: [src.rdsMultiAz],
      },
    },
    'Quando usar SQS em vez de comunicação síncrona?': {
      answer: 'Use SQS quando produtor e consumidor não precisam concluir a mesma transação em tempo real e você quer desacoplamento, buffering, retries e capacidade de absorver picos. O produtor confirma o envio à fila e o consumidor processa de forma independente. Para fan-out para vários consumidores, SNS pode publicar para múltiplas filas SQS.',
      diagram: awsServiceDiagrams.messaging,
    },
  },
};

const extras: Record<string, InterviewVisual> = {
  'Onde colocar uma IAM role para uma aplicação acessar um S3 bucket?': {
    answer: 'Depende do runtime. Em EC2, associe uma IAM role através de um instance profile. Em Lambda, configure a execution role da função. Em ECS, coloque as permissões S3 na task role do task definition; a task execution role é para operações do ECS como ECR/logs. Em EKS, associe uma role ao workload com EKS Pod Identity ou IRSA. A role deve ter uma identity policy least-privilege; bucket policy é usada para controles adicionais e normalmente é necessária junto com a permissão do principal em acesso cross-account. Não distribua access keys estáticas dentro do código ou container.',
    diagram: awsServiceDiagrams.s3,
  },
  'Qual é a diferença entre IAM role, IAM policy e bucket policy no S3?': {
    answer: 'IAM role é uma identidade assumível. Identity policies anexadas à role descrevem ações permitidas para as credenciais dessa role. Bucket policy é uma resource-based policy anexada ao próprio bucket e pode conceder ou restringir acesso por principal, origem, organização, VPC endpoint e outras condições. Em cross-account, normalmente é preciso autorização tanto no lado do principal quanto no recurso.',
    diagram: awsServiceDiagrams.iam,
  },
  'Qual é a diferença entre RDS Multi-AZ e Read Replica?': {
    answer: 'Multi-AZ é principalmente uma estratégia de disponibilidade e failover: mantém standby em outra AZ conforme o modo de implantação. Read Replica é usada principalmente para escalar leituras e pode ter replicação assíncrona, conforme engine/configuração. Uma read replica não deve ser tratada automaticamente como substituto conceitual do standby Multi-AZ.',
    diagram: awsServiceDiagrams.rds,
  },
  'Como uma Lambda em subnet privada acessa RDS, S3 e a Internet?': {
    answer: 'A Lambda conectada à VPC acessa RDS pela rede privada e Security Groups. Para S3, prefira um Gateway VPC Endpoint quando adequado. Para destinos públicos na Internet, subnets associadas à função precisam de uma rota de saída adequada, tipicamente via NAT Gateway em subnet pública; colocar a função em uma subnet pública não fornece automaticamente um endereço IP público à função.',
    diagram: awsServiceDiagrams.lambda,
  },
  'Qual é a diferença entre ECS task role e task execution role?': {
    answer: 'Task execution role é consumida pelo ECS/Fargate para ações de infraestrutura como baixar imagens do ECR e publicar logs, dependendo da configuração. Task role fornece credenciais ao código executado dentro dos containers e deve carregar permissões de negócio como acessar S3, SQS ou DynamoDB.',
    diagram: awsServiceDiagrams.ecs,
  },
  'Como conceder acesso a S3 para um Pod no EKS sem usar credenciais estáticas?': {
    answer: 'Associe uma IAM role ao workload usando EKS Pod Identity ou IRSA. A policy S3 fica na role específica da aplicação, enquanto o Pod recebe credenciais temporárias. Evite colocar a permissão de negócio no node role, porque isso amplia o blast radius para outros Pods executados no node.',
    diagram: awsServiceDiagrams.eks,
  },
  'Quando usar SNS, SQS ou SNS mais SQS?': {
    answer: 'SQS fornece fila durável e pull-based para desacoplar um produtor de um consumidor ou grupo de workers. SNS é publish/subscribe e distribui mensagens para múltiplas subscriptions. Combine SNS + SQS para fan-out durável quando cada consumidor precisa de sua própria fila, ritmo de consumo, retry e DLQ.',
    diagram: awsServiceDiagrams.messaging,
  },
  'Como conectar uma VPC AWS à rede on-premises?': {
    answer: 'Para conectividade criptografada sobre a Internet, use AWS Site-to-Site VPN com Customer Gateway e VGW ou Transit Gateway. Para conectividade dedicada, Direct Connect é a opção principal, muitas vezes combinada com VPN para requisitos específicos. Em ambientes com várias VPCs, Transit Gateway pode centralizar attachments e roteamento. Em todos os casos valide CIDRs sem overlap, rotas de ida e volta, propagação/BGP, Security Groups/NACLs, DNS híbrido e MTU.',
    diagram: awsServiceDiagrams.vpcHybrid,
  },
  'Como funciona AWS Site-to-Site VPN e por que existem dois túneis?': {
    answer: 'A conexão Site-to-Site VPN estabelece dois túneis IPsec entre o Customer Gateway e o lado AWS, que pode ser VGW ou Transit Gateway. Os dois túneis fornecem redundância para manutenção ou falha de um caminho. Quando roteamento dinâmico é usado, BGP anuncia prefixos conforme a configuração. O equipamento on-premises deve ser configurado para usar ambos os túneis quando suportado.',
    diagram: awsServiceDiagrams.vpn,
  },
  'Quando usar VPC Peering, Transit Gateway, VPN ou Direct Connect?': {
    answer: 'VPC Peering é uma conexão privada direta entre duas VPCs e não oferece roteamento transitivo. Transit Gateway é um hub para conectar muitas VPCs e redes externas com tabelas de rota próprias. Site-to-Site VPN conecta redes usando IPsec sobre a Internet. Direct Connect fornece um caminho de rede dedicado entre instalações e AWS. A decisão depende de escala, topologia, latência, throughput, custo, redundância e requisitos de criptografia.',
    diagram: awsServiceDiagrams.vpcHybrid,
  },
};

const extraQuestions = Object.keys(extras);

export function getAwsSectionDiagram(articleSlug: string, sectionId: string) {
  return articleSlug === 'aws' ? aws.sections[sectionId] : undefined;
}

export function getAwsInterviewVisual(articleSlug: string, question: string) {
  if (articleSlug !== 'aws') return undefined;
  return aws.interviews[question] ?? extras[question];
}

export function getAwsExtraQuestions(articleSlug: string) {
  return articleSlug === 'aws' ? extraQuestions : [];
}
