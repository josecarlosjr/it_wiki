import type { DiagramSpec, InterviewVisual } from './diagrams';

const exact: Record<string, string> = {
  'Fundamentos': 'Fundamentals', 'Intermediário': 'Intermediate', 'Avançado': 'Advanced', 'Especialista': 'Expert',
  'Cliente': 'Client', 'Clientes': 'Clients', 'estado': 'state', 'executa': 'runs', 'verifica': 'checks', 'rota': 'route', 'tráfego': 'traffic',
  'Segurança': 'Security', 'Rede': 'Network', 'Dados': 'Data', 'Aplicação': 'Application', 'Aplicações': 'Applications',
  'Requisição': 'Request', 'Resposta': 'Response', 'Resultado': 'Result', 'Entrada': 'Input', 'Saída': 'Output',
  'Sim': 'Yes', 'Não': 'No', 'sim': 'yes', 'não': 'no', 'falha': 'failure', 'Falha': 'Failure',
  'Fonte': 'Source', 'Destino': 'Destination', 'Usuário': 'User', 'Identidade': 'Identity', 'Autorização': 'Authorization', 'Autenticação': 'Authentication',
  'Internet': 'Internet', 'On-premises': 'On-premises', 'Produção': 'Production', 'Desenvolvimento': 'Development', 'Staging': 'Staging',
  'Maioria necessária': 'Required majority', 'Quorum = 2 de 3': 'Quorum = 2 of 3', 'Uma cópia por node': 'One copy per node',
  'Réplicas intercambiáveis': 'Interchangeable replicas', 'Identidade / storage estável': 'Stable identity / storage',
  'Requisito do workload': 'Workload requirement', 'readinessProbe falha': 'readinessProbe fails', 'Pod não pronto': 'Pod not ready',
  'Endpoints encontrados': 'Endpoints found', 'Pod labels correspondem?': 'Do Pod labels match?', 'Pods existem e estão Ready?': 'Do Pods exist and are they Ready?',
  'Arquivo removido': 'Deleted file', 'Processo': 'Process', 'Descritor': 'Descriptor', 'Filesystem': 'Filesystem',
  'Espaço livre': 'Free space', 'Inodes livres': 'Free inodes', 'Conexão': 'Connection', 'Socket': 'Socket',
  'Build': 'Build', 'Imagem final': 'Final image', 'Imagem': 'Image', 'Container': 'Container', 'Volume': 'Volume',
  'Código fonte': 'Source code', 'Artefato': 'Artifact', 'Registro': 'Registry', 'Política': 'Policy',
  'Roteamento': 'Routing', 'Tabela de rotas': 'Route table', 'Firewall': 'Firewall', 'Túnel VPN': 'VPN tunnel',
  'Rede local': 'Local network', 'Rede remota': 'Remote network', 'Gateway': 'Gateway', 'Pacote': 'Packet',
  'Permissão': 'Permission', 'Credencial temporária': 'Temporary credential', 'Role da aplicação': 'Application role',
  'Bucket privado': 'Private bucket', 'Acesso privado': 'Private access', 'Subnets privadas': 'Private subnets', 'Subnets públicas': 'Public subnets',
  'Banco primário': 'Primary database', 'Banco standby': 'Standby database', 'Replicação': 'Replication', 'Failover': 'Failover',
  'Fila': 'Queue', 'Consumidor': 'Consumer', 'Produtor': 'Producer', 'Tópico': 'Topic', 'Mensagem': 'Message',
  'Estado desejado': 'Desired state', 'Estado atual': 'Live state', 'Reconciliação': 'Reconciliation', 'Aprovação': 'Approval',
  'Plano': 'Plan', 'Aplicar': 'Apply', 'Validação': 'Validation', 'Mudança': 'Change', 'Mudanças': 'Changes',
  'Inventário': 'Inventory', 'Hosts': 'Hosts', 'Variáveis': 'Variables', 'Execução': 'Execution',
};

const phrases: Array<[RegExp, string]> = [
  [/\bArquitetura básica do Kubernetes\b/g, 'Basic Kubernetes architecture'],
  [/\bCaminho de tráfego e readiness\b/g, 'Traffic path and readiness'],
  [/\bControl plane altamente disponível com etcd em quorum\b/g, 'Highly available control plane with etcd quorum'],
  [/\bPipeline de segurança de uma requisição à API\b/g, 'API request security pipeline'],
  [/\bEscolha do controlador de workload\b/g, 'Choosing a workload controller'],
  [/\bFalha de readiness sem reinício automático\b/g, 'Readiness failure without automatic restart'],
  [/\bTroubleshooting de Service sem endpoints\b/g, 'Troubleshooting a Service with no endpoints'],
  [/\bQuorum do etcd com três membros\b/g, 'etcd quorum with three members'],
  [/\bImagem, container, filesystem e volume\b/g, 'Image, container, filesystem, and volume'],
  [/\bMulti-stage build: builder separado da imagem final\b/g, 'Multi-stage build: builder separated from final image'],
  [/\bIsolamento de container no Linux\b/g, 'Linux container isolation'],
  [/\bSupply chain de uma imagem de produção\b/g, 'Production image supply chain'],
  [/\bProcesso Linux, descritores e interfaces virtuais do kernel\b/g, 'Linux processes, descriptors, and virtual kernel interfaces'],
  [/\bInodes e blocos: dois limites diferentes\b/g, 'Inodes and blocks: two different limits'],
  [/\bComunicação entre duas redes\b/g, 'Communication between two networks'],
  [/\bVPN site-to-site\b/gi, 'Site-to-site VPN'],
  [/\bPortas e protocolos\b/g, 'Ports and protocols'],
  [/\bArquitetura segura em camadas\b/g, 'Layered secure architecture'],
  [/\bZero Trust\b/g, 'Zero Trust'],
  [/\bestado desejado\b/gi, 'desired state'], [/\bestado vivo\b/gi, 'live state'], [/\bestado atual\b/gi, 'live state'],
  [/\baplicação\b/gi, 'application'], [/\baplicações\b/gi, 'applications'], [/\bsegurança\b/gi, 'security'], [/\brede\b/gi, 'network'],
  [/\btráfego\b/gi, 'traffic'], [/\bserviço\b/gi, 'service'], [/\bserviços\b/gi, 'services'], [/\brecurso\b/gi, 'resource'], [/\brecursos\b/gi, 'resources'],
  [/\bpermissões\b/gi, 'permissions'], [/\bpermissão\b/gi, 'permission'], [/\bidentidade\b/gi, 'identity'], [/\bpolítica\b/gi, 'policy'], [/\bpolíticas\b/gi, 'policies'],
  [/\bprivado\b/gi, 'private'], [/\bprivada\b/gi, 'private'], [/\bpúblico\b/gi, 'public'], [/\bpública\b/gi, 'public'],
  [/\brequisição\b/gi, 'request'], [/\bresposta\b/gi, 'response'], [/\bverifica\b/gi, 'checks'], [/\bexecuta\b/gi, 'runs'],
  [/\bfalha\b/gi, 'failure'], [/\bfalhas\b/gi, 'failures'], [/\bcontrole\b/gi, 'control'], [/\bdados\b/gi, 'data'],
  [/\barmazenamento\b/gi, 'storage'], [/\broteamento\b/gi, 'routing'], [/\bconectividade\b/gi, 'connectivity'], [/\bconexão\b/gi, 'connection'],
  [/\bprodução\b/gi, 'production'], [/\bambiente\b/gi, 'environment'], [/\bambientes\b/gi, 'environments'], [/\bresultado\b/gi, 'result'],
  [/\bfonte\b/gi, 'source'], [/\bdestino\b/gi, 'destination'], [/\bentrada\b/gi, 'input'], [/\bsaída\b/gi, 'output'],
];

export function technicalTextEn(value: string) {
  if (exact[value]) return exact[value];
  let result = value;
  for (const [pattern, replacement] of phrases) result = result.replace(pattern, replacement);
  return result;
}

export function localizeDiagram(spec: DiagramSpec, locale: 'pt' | 'en'): DiagramSpec {
  if (locale === 'pt') return spec;
  return {
    ...spec,
    title: technicalTextEn(spec.title),
    description: technicalTextEn(spec.description),
    nodes: spec.nodes.map((node) => ({ ...node, label: technicalTextEn(node.label) })),
    edges: spec.edges.map((edge) => ({ ...edge, label: edge.label ? technicalTextEn(edge.label) : undefined })),
  };
}

export function localizeVisual(visual: InterviewVisual | undefined, locale: 'pt' | 'en'): InterviewVisual | undefined {
  if (!visual || locale === 'pt') return visual;
  return { answer: interviewAnswerEn[visual.answer] ?? technicalTextEn(visual.answer), diagram: localizeDiagram(visual.diagram, locale) };
}

export const extraQuestionEn: Record<string, string> = {
  'Como funciona uma VPN site-to-site e o que precisa estar correto para duas redes se comunicarem?': 'How does a site-to-site VPN work, and what must be correct for two networks to communicate?',
  'Como você faria duas redes diferentes se comunicarem?': 'How would you make two different networks communicate?',
  'Quais portas e protocolos de rede você considera essenciais conhecer em uma entrevista?': 'Which network ports and protocols are essential to know in an interview?',
  'Quando usar workspaces e quando separar states/backends?': 'When should you use workspaces, and when should you separate states/backends?',
  'Como recuperar um state perdido ou inconsistente sem destruir recursos?': 'How do you recover a lost or inconsistent Terraform state without destroying resources?',
  'Como investigar drift antes de aplicar mudanças?': 'How do you investigate drift before applying changes?',
  'Como fazer rollout controlado de uma mudança com Ansible?': 'How do you perform a controlled rollout with Ansible?',
  'Como investigar uma task Ansible que sempre retorna changed?': 'How do you investigate an Ansible task that always returns changed?',
  'Como funciona a precedência de variáveis no Ansible?': 'How does Ansible variable precedence work?',
  'O que significa build once, promote many?': 'What does build once, promote many mean?',
  'Como OIDC melhora a segurança de um pipeline CI/CD?': 'How does OIDC improve CI/CD pipeline security?',
  'Como funciona reconciliação em GitOps?': 'How does reconciliation work in GitOps?',
  'Onde colocar uma IAM role para uma aplicação acessar um S3 bucket?': 'Where should you attach an IAM role for an application that needs access to an S3 bucket?',
  'Qual é a diferença entre IAM role, IAM policy e bucket policy no S3?': 'What is the difference between an IAM role, IAM policy, and S3 bucket policy?',
  'Qual é a diferença entre RDS Multi-AZ e Read Replica?': 'What is the difference between RDS Multi-AZ and a Read Replica?',
  'Como uma Lambda em subnet privada acessa RDS, S3 e a Internet?': 'How does a Lambda function in a private subnet access RDS, S3, and the Internet?',
  'Qual é a diferença entre ECS task role e task execution role?': 'What is the difference between an ECS task role and task execution role?',
  'Como conceder acesso a S3 para um Pod no EKS sem usar credenciais estáticas?': 'How do you grant an EKS Pod access to S3 without static credentials?',
  'Quando usar SNS, SQS ou SNS mais SQS?': 'When should you use SNS, SQS, or SNS plus SQS?',
  'Como conectar uma VPC AWS à rede on-premises?': 'How do you connect an AWS VPC to an on-premises network?',
  'Como funciona AWS Site-to-Site VPN e por que existem dois túneis?': 'How does AWS Site-to-Site VPN work, and why are there two tunnels?',
  'Quando usar VPC Peering, Transit Gateway, VPN ou Direct Connect?': 'When should you use VPC Peering, Transit Gateway, VPN, or Direct Connect?',
};

const interviewAnswerEn: Record<string, string> = {
  'Deployment é indicado para réplicas normalmente intercambiáveis de aplicações stateless. StatefulSet oferece identidade estável e ordenação para workloads que precisam preservar identidade ou armazenamento associado. DaemonSet garante que todos, ou um subconjunto selecionado, dos nodes executem uma cópia do Pod.': 'Deployment is suited to normally interchangeable stateless replicas. StatefulSet provides stable identity and ordered lifecycle for workloads that need persistent identity or storage association. DaemonSet ensures every selected node runs a copy of the Pod.',
  'O kubelet marca a condição Ready do container/Pod como não pronta. O endpoint correspondente passa a indicar que não está pronto e deixa de receber tráfego normal por Services que respeitam essa condição. Uma falha de readiness, por si só, não é o mecanismo responsável por reiniciar o container; isso é função da liveness probe quando configurada e falhando.': 'The kubelet marks the container/Pod Ready condition as not ready. Its endpoint is no longer considered ready for normal Service traffic. A readiness failure alone does not restart the container; that behavior belongs to a failing liveness probe when configured.',
  'Comece pelo selector do Service e pelos labels dos Pods. Confirme se os Pods existem, estão no namespace esperado e estão Ready; depois inspecione os EndpointSlices. Se o Service não usa selector, verifique como os endpoints são administrados. Só depois avance para DNS, kube-proxy/CNI ou regras de rede.': 'Start with the Service selector and Pod labels. Confirm that Pods exist in the expected namespace and are Ready, then inspect EndpointSlices. If the Service has no selector, verify how endpoints are managed. Only then move to DNS, kube-proxy/CNI, or network-policy investigation.',
  'O etcd usa consenso Raft e precisa de maioria dos membros para continuar fazendo progresso. Em três membros, o quorum é dois; a perda de um membro ainda preserva maioria, enquanto a perda de dois elimina o quorum e impede o cluster etcd de continuar operações que dependem de consenso. Como o Kubernetes persiste o estado do cluster no etcd, isso afeta diretamente operações do control plane.': 'etcd uses Raft consensus and needs a majority of members to make progress. In a three-member cluster the quorum is two: losing one member preserves a majority, while losing two removes quorum. Because Kubernetes stores cluster state in etcd, control-plane operations are directly affected.',
};
