import type { DiagramNodeKind, DiagramSpec } from './diagrams';

type Locale = 'pt' | 'en';
type Bi = { pt: string; en: string };
type BiNode = { id: string; label: Bi; x: number; y: number; width?: number; height?: number; kind?: DiagramNodeKind };
type BiEdge = { from: string; to: string; label?: Bi; animated?: boolean; bidirectional?: boolean };
type BiDiagram = { title: Bi; description: Bi; width?: number; height?: number; nodes: BiNode[]; edges: BiEdge[]; sources: { label: string; url: string }[] };

const s = {
  service: { label: 'Kubernetes — Service', url: 'https://kubernetes.io/docs/concepts/services-networking/service/' },
  vip: { label: 'Kubernetes — Virtual IPs and Service Proxies', url: 'https://kubernetes.io/docs/reference/networking/virtual-ips/' },
  workloads: { label: 'Kubernetes — Workloads', url: 'https://kubernetes.io/docs/concepts/workloads/' },
  deployment: { label: 'Kubernetes — Deployments', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/' },
  stateful: { label: 'Kubernetes — StatefulSets', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/' },
  daemon: { label: 'Kubernetes — DaemonSet', url: 'https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/' },
  affinity: { label: 'Kubernetes — Assigning Pods to Nodes', url: 'https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/' },
  probes: { label: 'Kubernetes — Probes', url: 'https://kubernetes.io/docs/concepts/workloads/pods/probes/' },
  pv: { label: 'Kubernetes — Persistent Volumes', url: 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/' },
  sc: { label: 'Kubernetes — Storage Classes', url: 'https://kubernetes.io/docs/concepts/storage/storage-classes/' },
  reclaim: { label: 'Kubernetes — PV Reclaim Policy', url: 'https://kubernetes.io/docs/tasks/administer-cluster/change-pv-reclaim-policy/' },
  finalizers: { label: 'Kubernetes — Finalizers', url: 'https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/' },
  rbac: { label: 'Kubernetes — RBAC', url: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/' },
  networking: { label: 'Kubernetes — Cluster Networking', url: 'https://kubernetes.io/docs/concepts/cluster-administration/networking/' },
  cni: { label: 'Kubernetes — Network Plugins', url: 'https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/' },
  kubelet: { label: 'Kubernetes — Node Components', url: 'https://kubernetes.io/docs/concepts/overview/components/#node-components' },
  kubeletAuth: { label: 'Kubernetes — Kubelet authentication/authorization', url: 'https://kubernetes.io/docs/reference/access-authn-authz/kubelet-authn-authz/' },
  certs: { label: 'Kubernetes — Certificates and CSRs', url: 'https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/' },
  certManager: { label: 'cert-manager — Certificate resource', url: 'https://cert-manager.io/docs/usage/certificate/' },
  istio: { label: 'Istio — Mutual TLS', url: 'https://istio.io/latest/docs/tasks/security/authentication/mtls-migration/' },
};

const b = (pt: string, en: string): Bi => ({ pt, en });
const n = (id: string, pt: string, en: string, x: number, y: number, kind: DiagramNodeKind = 'workload', width?: number): BiNode => ({ id, label: b(pt, en), x, y, kind, width });
const e = (from: string, to: string, pt?: string, en?: string, animated = false): BiEdge => ({ from, to, label: pt && en ? b(pt, en) : undefined, animated });

const diagrams: Record<string, BiDiagram> = {
  clusterip: {
    title: b('Service ClusterIP', 'ClusterIP Service'),
    description: b('ClusterIP fornece um VIP interno estável. kube-proxy ou um dataplane equivalente redireciona o tráfego do Service para endpoints prontos.', 'ClusterIP provides a stable internal VIP. kube-proxy or an equivalent dataplane redirects Service traffic to ready endpoints.'),
    width: 820, height: 300,
    nodes: [n('client','Pod cliente','Client Pod',30,110,'client'), n('svc','ClusterIP\n10.96.10.20:80','ClusterIP\n10.96.10.20:80',255,110,'network',190), n('p1','Pod A\n10.244.1.7:8080','Pod A\n10.244.1.7:8080',570,45), n('p2','Pod B\n10.244.2.9:8080','Pod B\n10.244.2.9:8080',570,175)],
    edges: [e('client','svc','Service port 80','Service port 80',true), e('svc','p1','targetPort 8080','targetPort 8080',true), e('svc','p2','targetPort 8080','targetPort 8080',true)], sources:[s.service,s.vip],
  },
  nodeport: {
    title:b('Service NodePort','NodePort Service'), description:b('NodePort expõe a mesma porta em cada Node e também cria a funcionalidade de ClusterIP subjacente.','NodePort exposes the same port on each Node and also includes the underlying ClusterIP behavior.'), width:860,height:310,
    nodes:[n('ext','Cliente externo','External client',25,115,'client'),n('node','NodeIP:30080','NodeIP:30080',235,115,'network',180),n('svc','ClusterIP:80','ClusterIP:80',470,115,'network',160),n('pod','Pod:8080','Pod:8080',700,115)], edges:[e('ext','node','TCP 30080','TCP 30080',true),e('node','svc','NodePort → Service','NodePort → Service',true),e('svc','pod','targetPort 8080','targetPort 8080',true)],sources:[s.service,s.vip],
  },
  loadbalancer: {
    title:b('Service LoadBalancer','LoadBalancer Service'),description:b('Um controlador de cloud ou implementação externa provisiona o load balancer. Dependendo da integração, o tráfego pode usar NodePort ou encaminhar diretamente para endpoints.','A cloud controller or external implementation provisions the load balancer. Depending on the integration, traffic can use NodePort or route directly to endpoints.'),width:900,height:310,
    nodes:[n('internet','Internet','Internet',20,115,'client'),n('lb','External Load Balancer\n203.0.113.20:443','External Load Balancer\n203.0.113.20:443',205,105,'network',230),n('svc','Service\nLoadBalancer','Service\nLoadBalancer',500,110,'network',175),n('pods','Ready Pods','Ready Pods',740,110)],edges:[e('internet','lb','HTTPS','HTTPS',true),e('lb','svc','provider datapath','provider datapath',true),e('svc','pods','EndpointSlices','EndpointSlices',true)],sources:[s.service],
  },
  headless: {
    title:b('Headless Service: descoberta sem VIP','Headless Service: discovery without a VIP'),description:b('Com clusterIP: None não existe VIP nem balanceamento de Service. O DNS retorna os endereços dos endpoints e o cliente escolhe diretamente um Pod.','With clusterIP: None there is no Service VIP or Service load balancing. DNS returns endpoint addresses and the client connects directly to a Pod.'),width:900,height:330,
    nodes:[n('client','Cliente','Client',20,125,'client'),n('dns','CoreDNS\nsvc → Pod IPs','CoreDNS\nsvc → Pod IPs',210,125,'network',190),n('p1','Pod 0\n10.244.1.10','Pod 0\n10.244.1.10',525,45),n('p2','Pod 1\n10.244.2.11','Pod 1\n10.244.2.11',525,145),n('p3','Pod 2\n10.244.3.12','Pod 2\n10.244.3.12',525,245)],edges:[e('client','dns','DNS query','DNS query',true),e('dns','p1','A/AAAA','A/AAAA'),e('dns','p2','A/AAAA','A/AAAA'),e('dns','p3','A/AAAA','A/AAAA')],sources:[s.service],
  },
  ports: {
    title:b('containerPort, Service port e targetPort','containerPort, Service port, and targetPort'),description:b('containerPort documenta a porta usada pelo container; Service port é a porta do VIP; targetPort é a porta para a qual o Service encaminha no endpoint. containerPort não publica o Pod sozinho.','containerPort documents the container port; Service port is the VIP port; targetPort is the endpoint destination port. containerPort does not expose the Pod by itself.'),width:900,height:300,
    nodes:[n('client','Cliente :80','Client :80',20,105,'client'),n('svc','Service\nport: 80','Service\nport: 80',235,105,'network'),n('target','targetPort: 8080','targetPort: 8080',475,105,'decision',180),n('container','Container\ncontainerPort: 8080','Container\ncontainerPort: 8080',715,105,'workload',180)],edges:[e('client','svc','connect','connect',true),e('svc','target','map','map',true),e('target','container','destination','destination',true)],sources:[s.service],
  },
  replicaset: {
    title:b('ReplicaSet: manter N Pods','ReplicaSet: keep N Pods'),description:b('O ReplicaSet compara o número desejado de réplicas com os Pods que correspondem ao selector e cria ou remove Pods para convergir.','A ReplicaSet compares the desired replica count with Pods matching its selector and creates or removes Pods to converge.'),width:860,height:310,
    nodes:[n('rs','ReplicaSet\nreplicas: 3','ReplicaSet\nreplicas: 3',25,110,'control'),n('p1','Pod A','Pod A',300,35),n('p2','Pod B','Pod B',300,120),n('p3','Pod C','Pod C',300,205),n('fail','Pod B deleted','Pod B deleted',555,120,'security'),n('new','Pod D created','Pod D created',720,120)],edges:[e('rs','p1','reconcile','reconcile'),e('rs','p2','reconcile','reconcile'),e('rs','p3','reconcile','reconcile'),e('p2','fail','failure/delete','failure/delete'),e('fail','new','ReplicaSet replaces','ReplicaSet replaces',true)],sources:[s.workloads],
  },
  deployment: {
    title:b('Deployment → ReplicaSet → Pods','Deployment → ReplicaSet → Pods'),description:b('Deployment administra ReplicaSets e implementa rollout/rollback declarativo. Em um update, um novo ReplicaSet cresce enquanto o anterior diminui conforme a estratégia.','A Deployment manages ReplicaSets and declarative rollout/rollback. During an update, a new ReplicaSet scales up while the previous one scales down according to strategy.'),width:930,height:330,
    nodes:[n('dep','Deployment\nimage v2','Deployment\nimage v2',25,120,'control'),n('old','ReplicaSet v1\nscale down','ReplicaSet v1\nscale down',285,45,'control'),n('new','ReplicaSet v2\nscale up','ReplicaSet v2\nscale up',285,195,'control'),n('p1','v1 Pod','v1 Pod',610,45),n('p2','v2 Pod A','v2 Pod A',610,175),n('p3','v2 Pod B','v2 Pod B',760,175)],edges:[e('dep','old','old revision','old revision'),e('dep','new','new revision','new revision',true),e('old','p1'),e('new','p2'),e('new','p3')],sources:[s.deployment],
  },
  statefulset: {
    title:b('StatefulSet: identidade e storage estáveis','StatefulSet: stable identity and storage'),description:b('Cada réplica recebe ordinal, DNS previsível e pode receber um PVC próprio por volumeClaimTemplates. Um headless Service é comum para descoberta direta.','Each replica gets an ordinal, predictable DNS, and can receive its own PVC via volumeClaimTemplates. A headless Service is commonly used for direct discovery.'),width:980,height:360,
    nodes:[n('sts','StatefulSet\nweb','StatefulSet\nweb',20,130,'control'),n('svc','Headless Service','Headless Service',235,35,'network'),n('p0','web-0','web-0',470,35),n('p1','web-1','web-1',470,145),n('p2','web-2','web-2',470,255),n('v0','PVC data-web-0','PVC data-web-0',720,35,'data'),n('v1','PVC data-web-1','PVC data-web-1',720,145,'data'),n('v2','PVC data-web-2','PVC data-web-2',720,255,'data')],edges:[e('sts','p0'),e('sts','p1'),e('sts','p2'),e('svc','p0','DNS','DNS'),e('svc','p1','DNS','DNS'),e('svc','p2','DNS','DNS'),e('p0','v0','mount','mount'),e('p1','v1','mount','mount'),e('p2','v2','mount','mount')],sources:[s.stateful,s.service,s.pv],
  },
  daemonset: {
    title:b('DaemonSet: um Pod por Node elegível','DaemonSet: one Pod per eligible Node'),description:b('DaemonSet cria uma instância do daemon em cada Node elegível, útil para agentes de logs, monitoramento, storage e componentes de rede.','DaemonSet creates one daemon instance on each eligible Node, useful for logging, monitoring, storage, and networking agents.'),width:900,height:320,
    nodes:[n('ds','DaemonSet','DaemonSet',25,115,'control'),n('n1','Node 1\nagent Pod','Node 1\nagent Pod',285,35),n('n2','Node 2\nagent Pod','Node 2\nagent Pod',285,125),n('n3','Node 3\nagent Pod','Node 3\nagent Pod',285,215),n('new','New Node','New Node',610,125,'network'),n('agent','New agent Pod','New agent Pod',760,125)],edges:[e('ds','n1'),e('ds','n2'),e('ds','n3'),e('new','agent','DaemonSet schedules','DaemonSet schedules',true)],sources:[s.daemon],
  },
  affinity: {
    title:b('Pod affinity: co-localizar workloads','Pod affinity: co-locate workloads'),description:b('Inter-pod affinity usa labels de outros Pods e topologyKey para preferir ou exigir que workloads relacionados fiquem no mesmo domínio topológico.','Inter-pod affinity uses labels on other Pods and a topologyKey to prefer or require related workloads to share a topology domain.'),width:900,height:320,
    nodes:[n('app','New API Pod','New API Pod',20,115,'client'),n('sched','Scheduler','Scheduler',235,115,'control'),n('n1','Node A\ncache Pod','Node A\ncache Pod',500,45,'workload'),n('n2','Node B\n(no cache)','Node B\n(no cache)',500,190,'workload'),n('choice','Affinity → Node A','Affinity → Node A',735,115,'decision')],edges:[e('app','sched'),e('sched','n1','matches app=cache','matches app=cache'),e('sched','n2','lower/no match','lower/no match'),e('n1','choice','same topology','same topology',true)],sources:[s.affinity],
  },
  antiaffinity: {
    title:b('Pod anti-affinity: espalhar réplicas','Pod anti-affinity: spread replicas'),description:b('Anti-affinity evita ou desencoraja que Pods com labels correspondentes compartilhem o mesmo node, zone ou outro topologyKey.','Anti-affinity prevents or discourages Pods with matching labels from sharing the same node, zone, or other topologyKey.'),width:900,height:330,
    nodes:[n('replicas','3 replicas\napp=web','3 replicas\napp=web',20,120,'control'),n('n1','Node A\nweb-1','Node A\nweb-1',310,30),n('n2','Node B\nweb-2','Node B\nweb-2',310,130),n('n3','Node C\nweb-3','Node C\nweb-3',310,230),n('failure','Node A fails','Node A fails',650,30,'security'),n('survive','2 replicas remain','2 replicas remain',735,170,'decision')],edges:[e('replicas','n1','spread','spread'),e('replicas','n2','spread','spread'),e('replicas','n3','spread','spread'),e('n1','failure'),e('n2','survive'),e('n3','survive')],sources:[s.affinity],
  },
  nodeaffinity: {
    title:b('Node affinity: selecionar Nodes por labels','Node affinity: select Nodes by labels'),description:b('required é uma restrição rígida; preferred apenas influencia o score. IgnoredDuringExecution significa que uma mudança posterior no label não expulsa automaticamente o Pod.','required is a hard constraint; preferred only influences scoring. IgnoredDuringExecution means a later label change does not automatically evict the Pod.'),width:920,height:330,
    nodes:[n('pod','Pod\nneeds disktype=ssd','Pod\nneeds disktype=ssd',20,120,'client'),n('sched','Scheduler','Scheduler',245,120,'control'),n('ssd','Node A\ndisktype=ssd','Node A\ndisktype=ssd',500,45),n('hdd','Node B\ndisktype=hdd','Node B\ndisktype=hdd',500,200),n('bind','Bind Pod → Node A','Bind Pod → Node A',735,120,'decision')],edges:[e('pod','sched'),e('sched','ssd','required match','required match',true),e('sched','hdd','filtered','filtered'),e('ssd','bind')],sources:[s.affinity],
  },
  startup: {
    title:b('Startup probe: proteger inicialização lenta','Startup probe: protect slow startup'),description:b('Enquanto startupProbe não tiver sucesso, liveness e readiness não começam. Se a startupProbe exceder seu limite de falhas, o container é reiniciado.','Until startupProbe succeeds, liveness and readiness do not begin. If startupProbe exceeds its failure threshold, the container is restarted.'),width:860,height:300,
    nodes:[n('start','Container starts','Container starts',20,105,'workload'),n('probe','startupProbe','startupProbe',230,105,'decision'),n('ok','Startup succeeds','Startup succeeds',455,40,'workload'),n('fail','Threshold exceeded','Threshold exceeded',455,180,'security'),n('normal','Enable liveness + readiness','Enable liveness + readiness',665,40,'control'),n('restart','Restart container','Restart container',665,180,'control')],edges:[e('start','probe'),e('probe','ok','success','success'),e('probe','fail','failure','failure'),e('ok','normal'),e('fail','restart')],sources:[s.probes],
  },
  readiness: {
    title:b('Readiness probe: controlar tráfego','Readiness probe: control traffic'),description:b('Falha de readiness marca o endpoint como não pronto; o processo continua executando e pode voltar a receber tráfego quando a probe recuperar.','A readiness failure marks the endpoint not ready; the process keeps running and can receive traffic again when the probe recovers.'),width:860,height:300,
    nodes:[n('k','kubelet','kubelet',20,105,'control'),n('probe','readinessProbe','readinessProbe',220,105,'decision'),n('pod','Pod Running\nNotReady','Pod Running\nNotReady',440,105),n('slice','EndpointSlice\nready=false','EndpointSlice\nready=false',650,105,'data')],edges:[e('k','probe','check','check'),e('probe','pod','fails','fails'),e('pod','slice','remove from normal traffic','remove from normal traffic',true)],sources:[s.probes],
  },
  liveness: {
    title:b('Liveness probe: recuperar processo travado','Liveness probe: recover a stuck process'),description:b('Quando a livenessProbe falha além do threshold, kubelet mata o container e aplica a restartPolicy. Não use liveness para dependências externas transitórias.','When livenessProbe fails beyond its threshold, kubelet kills the container and applies restartPolicy. Do not use liveness for transient external dependencies.'),width:860,height:300,
    nodes:[n('k','kubelet','kubelet',20,105,'control'),n('probe','livenessProbe','livenessProbe',220,105,'decision'),n('bad','Process unhealthy','Process unhealthy',440,105,'security'),n('kill','Kill container','Kill container',640,105,'control'),n('new','Restarted container','Restarted container',730,205)],edges:[e('k','probe'),e('probe','bad','threshold reached','threshold reached'),e('bad','kill',undefined,undefined,true),e('kill','new','restartPolicy','restartPolicy',true)],sources:[s.probes],
  },
  volume: {
    title:b('Volume: storage ligado ao ciclo de vida do Pod','Volume: storage attached to Pod lifecycle'),description:b('Um Pod pode montar volumes como emptyDir, ConfigMap, Secret ou volumes CSI. emptyDir sobrevive a restart do container, mas é removido quando o Pod deixa o Node.','A Pod can mount volumes such as emptyDir, ConfigMap, Secret, or CSI volumes. emptyDir survives container restarts but is removed when the Pod leaves the Node.'),width:860,height:300,
    nodes:[n('pod','Pod','Pod',20,105,'workload'),n('c1','Container A','Container A',240,40),n('c2','Container B','Container B',240,180),n('vol','emptyDir Volume','emptyDir Volume',520,105,'data'),n('delete','Pod deleted → volume gone','Pod deleted → volume gone',700,105,'security',150)],edges:[e('pod','c1'),e('pod','c2'),e('c1','vol','mount','mount'),e('c2','vol','mount','mount'),e('vol','delete','Pod lifecycle','Pod lifecycle')],sources:[s.pv],
  },
  pv: {
    title:b('PersistentVolume: recurso de storage do cluster','PersistentVolume: cluster storage resource'),description:b('PV representa capacidade de storage com access modes, capacity, StorageClass e reclaimPolicy. Seu ciclo de vida é independente de um Pod individual.','A PV represents storage capacity with access modes, capacity, StorageClass, and reclaimPolicy. Its lifecycle is independent of any individual Pod.'),width:850,height:290,
    nodes:[n('backend','Storage backend\nEBS / Ceph / NFS / CSI','Storage backend\nEBS / Ceph / NFS / CSI',20,100,'data',210),n('pv','PersistentVolume\n10Gi · RWO','PersistentVolume\n10Gi · RWO',310,100,'data',210),n('claim','Bound claim','Bound claim',590,100,'control')],edges:[e('backend','pv','provisioned as','provisioned as',true),e('pv','claim','bind','bind',true)],sources:[s.pv],
  },
  pvc: {
    title:b('PersistentVolumeClaim: pedido de storage','PersistentVolumeClaim: storage request'),description:b('PVC solicita capacidade, access modes e opcionalmente StorageClass. O control plane encontra ou provisiona um PV compatível e cria o binding.','A PVC requests capacity, access modes, and optionally a StorageClass. The control plane finds or provisions a compatible PV and binds it.'),width:880,height:300,
    nodes:[n('pod','Pod','Pod',20,105,'workload'),n('pvc','PVC\n5Gi · RWO','PVC\n5Gi · RWO',230,105,'data'),n('bind','PV/PVC Binder','PV/PVC Binder',455,105,'control'),n('pv','PV\n10Gi · RWO','PV\n10Gi · RWO',690,105,'data')],edges:[e('pod','pvc','claimName','claimName'),e('pvc','bind','request','request',true),e('bind','pv','compatible bind','compatible bind',true)],sources:[s.pv],
  },
  deletepvc: {
    title:b('O que acontece ao deletar o PVC?','What happens when the PVC is deleted?'),description:b('Com reclaimPolicy Delete, o PV dinâmico e normalmente o storage externo são removidos após as proteções/finalizers. Com Retain, o PV fica Released e os dados exigem recuperação/reuso manual.','With reclaimPolicy Delete, the dynamically provisioned PV and normally the external storage are removed after protection/finalizer handling. With Retain, the PV becomes Released and data requires manual recovery/reuse.'),width:940,height:330,
    nodes:[n('del','kubectl delete pvc','kubectl delete pvc',20,120,'client'),n('policy','PV reclaimPolicy','PV reclaimPolicy',245,120,'decision'),n('delete','Delete\nPV + backend removed','Delete\nPV + backend removed',515,40,'security',210),n('retain','Retain\nPV → Released','Retain\nPV → Released',515,200,'data',210),n('manual','Manual recovery / reuse','Manual recovery / reuse',760,200,'control')],edges:[e('del','policy'),e('policy','delete','Delete','Delete'),e('policy','retain','Retain','Retain'),e('retain','manual')],sources:[s.reclaim,s.finalizers],
  },
  deletepv: {
    title:b('O que acontece ao deletar o PV?','What happens when the PV is deleted?'),description:b('Se o PV ainda estiver em uso, pv-protection impede remoção imediata e o objeto fica Terminating. Depois que deixa de estar em uso, a exclusão pode completar; o efeito no backend depende do provisionador e reclaim/finalizers.','If the PV is still in use, pv-protection prevents immediate removal and the object remains Terminating. After it is no longer in use, deletion can complete; backend behavior depends on the provisioner and reclaim/finalizer handling.'),width:940,height:330,
    nodes:[n('del','kubectl delete pv','kubectl delete pv',20,120,'client'),n('used','PV in use?','PV in use?',245,120,'decision'),n('term','Terminating\npv-protection','Terminating\npv-protection',505,40,'security'),n('free','Not in use','Not in use',505,200,'data'),n('done','Delete completes','Delete completes',745,120,'control')],edges:[e('del','used'),e('used','term','yes','yes'),e('used','free','no','no'),e('term','done','after release','after release'),e('free','done')],sources:[s.finalizers,s.pv],
  },
  storageclass: {
    title:b('StorageClass: provisionamento dinâmico','StorageClass: dynamic provisioning'),description:b('StorageClass seleciona provisioner e parâmetros. Um PVC que referencia a classe aciona provisionamento dinâmico; WaitForFirstConsumer pode adiar binding para considerar o Node/zone do Pod.','A StorageClass selects a provisioner and parameters. A PVC referencing the class triggers dynamic provisioning; WaitForFirstConsumer can delay binding so Pod node/zone placement is considered.'),width:950,height:320,
    nodes:[n('pvc','PVC\nstorageClassName: fast','PVC\nstorageClassName: fast',20,110,'data',210),n('sc','StorageClass fast\nCSI provisioner','StorageClass fast\nCSI provisioner',285,110,'control',210),n('csi','CSI Provisioner','CSI Provisioner',560,110,'control'),n('backend','Cloud / SAN storage','Cloud / SAN storage',780,110,'data')],edges:[e('pvc','sc','requests class','requests class'),e('sc','csi','provision','provision',true),e('csi','backend','create volume','create volume',true)],sources:[s.sc],
  },
  rbac: {
    title:b('RBAC: sujeito → binding → permissões','RBAC: subject → binding → permissions'),description:b('Role/ClusterRole define regras aditivas; RoleBinding/ClusterRoleBinding associa essas regras a User, Group ou ServiceAccount. Least privilege exige resources e verbs específicos.','Role/ClusterRole defines additive rules; RoleBinding/ClusterRoleBinding associates those rules with a User, Group, or ServiceAccount. Least privilege requires specific resources and verbs.'),width:950,height:320,
    nodes:[n('sa','ServiceAccount\napi','ServiceAccount\napi',20,110,'client'),n('binding','RoleBinding','RoleBinding',240,110,'control'),n('role','Role\npods: get,list','Role\npods: get,list',470,110,'security',190),n('api','kube-apiserver','kube-apiserver',720,110,'control'),n('pod','Pods resource','Pods resource',825,220,'data')],edges:[e('sa','binding','subject','subject'),e('binding','role','roleRef','roleRef'),e('role','api','authorize','authorize',true),e('api','pod','allowed verbs','allowed verbs')],sources:[s.rbac],
  },
  cni: {
    title:b('CNI: criar a rede do Pod','CNI: create Pod networking'),description:b('kubelet solicita ao container runtime o Pod sandbox; o runtime chama plugins CNI para criar interface, atribuir IP, instalar rotas e aplicar recursos suportados pelo plugin.','kubelet asks the container runtime for a Pod sandbox; the runtime invokes CNI plugins to create interfaces, assign IPs, install routes, and apply capabilities supported by the plugin.'),width:960,height:320,
    nodes:[n('k','kubelet','kubelet',20,110,'control'),n('cri','Container Runtime\nCRI','Container Runtime\nCRI',230,110,'control',190),n('cni','CNI plugin\nIPAM + routes','CNI plugin\nIPAM + routes',490,110,'network',190),n('veth','veth / interface\nPod IP','veth / interface\nPod IP',745,40,'network',180),n('route','Node routes / dataplane','Node routes / dataplane',745,200,'network',180)],edges:[e('k','cri','create sandbox','create sandbox'),e('cri','cni','ADD','ADD',true),e('cni','veth','interface + IP','interface + IP'),e('cni','route','routes/policy','routes/policy')],sources:[s.cni,s.networking],
  },
  podnetwork: {
    title:b('Como alterar a rede primária dos Pods','How to change the primary Pod network'),description:b('O Pod IP não é editado diretamente. A faixa vem do CNI/IPAM e deve ser coerente com Pod CIDRs e rotas do cluster. Alterar a faixa em cluster existente é operação dependente do CNI e geralmente exige migração/recriação de Pods ou do cluster.','A Pod IP is not edited directly. The range comes from CNI/IPAM and must align with cluster Pod CIDRs and routes. Changing the range in an existing cluster is CNI-specific and generally requires migration/recreation of Pods or the cluster.'),width:990,height:330,
    nodes:[n('cfg','Cluster / CNI config\nPod CIDR','Cluster / CNI config\nPod CIDR',20,110,'control',210),n('ipam','CNI IPAM','CNI IPAM',300,110,'network'),n('pods','New Pods\nnew IP range','New Pods\nnew IP range',520,110,'workload',190),n('routes','Routes / policies / peers','Routes / policies / peers',760,110,'network',200),n('warn','Do not edit Pod IP manually','Do not edit Pod IP manually',520,230,'security',210)],edges:[e('cfg','ipam','configure','configure'),e('ipam','pods','allocate','allocate',true),e('pods','routes','must be routable','must be routable'),e('ipam','warn','provider-specific migration','provider-specific migration')],sources:[s.networking,s.cni],
  },
  kubeproxy: {
    title:b('kube-proxy: Service VIP → Endpoint','kube-proxy: Service VIP → Endpoint'),description:b('kube-proxy observa Services e EndpointSlices e programa o dataplane do Node. Em Linux, nftables é a direção moderna; IPVS está deprecated desde Kubernetes 1.35. Algumas CNIs substituem kube-proxy por dataplanes próprios.','kube-proxy watches Services and EndpointSlices and programs the node dataplane. On Linux, nftables is the modern direction; IPVS has been deprecated since Kubernetes 1.35. Some CNIs replace kube-proxy with their own dataplane.'),width:970,height:330,
    nodes:[n('api','API Server\nService + EndpointSlice','API Server\nService + EndpointSlice',20,105,'control',210),n('kp','kube-proxy','kube-proxy',290,105,'control'),n('kernel','Kernel dataplane\niptables / nftables','Kernel dataplane\niptables / nftables',505,105,'network',210),n('vip','ClusterIP:80','ClusterIP:80',760,35,'network'),n('pod','PodIP:8080','PodIP:8080',760,190,'workload')],edges:[e('api','kp','watch','watch',true),e('kp','kernel','sync rules','sync rules'),e('vip','kernel','packet','packet',true),e('kernel','pod','DNAT / forward','DNAT / forward',true)],sources:[s.vip],
  },
  kubelet: {
    title:b('kubelet: agente do Node','kubelet: node agent'),description:b('kubelet observa PodSpecs atribuídos ao Node, coordena o runtime via CRI, monta volumes, executa probes e publica status. Ele não agenda Pods; o scheduler escolhe o Node.','kubelet watches PodSpecs assigned to the Node, coordinates the runtime through CRI, mounts volumes, runs probes, and publishes status. It does not schedule Pods; the scheduler chooses the Node.'),width:1010,height:350,
    nodes:[n('api','API Server','API Server',20,120,'control'),n('k','kubelet','kubelet',230,120,'control'),n('cri','Container Runtime\nCRI','Container Runtime\nCRI',480,35,'control'),n('vol','Volumes / CSI','Volumes / CSI',480,130,'data'),n('probe','Probes','Probes',480,225,'decision'),n('pod','Pod containers','Pod containers',750,35,'workload'),n('status','Pod / Node status','Pod / Node status',750,190,'data')],edges:[e('api','k','PodSpec','PodSpec',true),e('k','cri','start/stop','start/stop'),e('cri','pod'),e('k','vol','mount','mount'),e('k','probe','execute','execute'),e('probe','pod'),e('k','status','report','report'),e('status','api','status update','status update')],sources:[s.kubelet,s.kubeletAuth,s.probes],
  },
  tls: {
    title:b('TLS/mTLS entre Pods com certificados de workload','Pod-to-Pod TLS/mTLS with workload certificates'),description:b('Use uma CA/Issuer controlada para emitir e renovar certificados, valide SANs estáveis do Service e distribua somente o trust bundle necessário. Para mTLS, ambos os lados apresentam certificados. Evite chaves privadas em imagens e rotação manual.','Use a controlled CA/Issuer to issue and renew certificates, validate stable Service SANs, and distribute only the required trust bundle. With mTLS, both sides present certificates. Avoid private keys baked into images and manual rotation.'),width:1040,height:370,
    nodes:[n('ca','CA / Issuer\nautomated rotation','CA / Issuer\nautomated rotation',410,20,'security',220),n('a','Pod A\nclient cert + key\nCA bundle','Pod A\nclient cert + key\nCA bundle',30,180,'workload',210),n('svc','Service DNS\napi.default.svc','Service DNS\napi.default.svc',410,180,'network',220),n('b','Pod B\nserver cert + key\nSAN=api.default.svc','Pod B\nserver cert + key\nSAN=api.default.svc',770,180,'workload',230),n('policy','NetworkPolicy / authz\nleast privilege','NetworkPolicy / authz\nleast privilege',410,290,'security',220)],edges:[e('ca','a','issue client identity','issue client identity'),e('ca','b','issue server identity','issue server identity'),e('a','svc','TLS / mTLS','TLS / mTLS',true),e('svc','b','encrypted channel','encrypted channel',true),e('policy','svc','restrict peers','restrict peers')],sources:[s.certs,s.certManager,s.istio],
  },
};

function resolveText(value: Bi, locale: Locale) { return value[locale]; }

export type KubernetesDeepDiveDiagramKey = keyof typeof diagrams;

export function getKubernetesDeepDiveDiagram(key: KubernetesDeepDiveDiagramKey, locale: Locale): DiagramSpec {
  const spec = diagrams[key];
  return {
    title: resolveText(spec.title, locale),
    description: resolveText(spec.description, locale),
    width: spec.width,
    height: spec.height,
    nodes: spec.nodes.map((node) => ({ ...node, label: resolveText(node.label, locale) })),
    edges: spec.edges.map((edge) => ({ ...edge, label: edge.label ? resolveText(edge.label, locale) : undefined })),
    sources: spec.sources,
  };
}
