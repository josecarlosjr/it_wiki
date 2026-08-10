'use client';

import type { ReactNode } from 'react';
import { getKubernetesDeepDiveDiagram, type KubernetesDeepDiveDiagramKey } from '@/content/kubernetes-deep-dive-diagrams';
import { useLanguage } from './language-provider';
import { TopicDiagram } from './topic-diagram';

const serviceExample = `apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 8080`;

const nodePortExample = `spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30080`;

const loadBalancerExample = `spec:
  type: LoadBalancer
  selector:
    app: api
  ports:
  - port: 443
    targetPort: 8443`;

const headlessExample = `apiVersion: v1
kind: Service
metadata:
  name: db
spec:
  clusterIP: None
  selector:
    app: db
  ports:
  - port: 5432`;

const portsExample = `containers:
- name: api
  image: example/api:1.0
  ports:
  - name: http
    containerPort: 8080
---
spec:
  ports:
  - port: 80
    targetPort: http`;

const replicaSetExample = `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: web }
    spec:
      containers:
      - name: web
        image: nginx:1.27`;

const deploymentExample = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
      - name: api
        image: example/api:2.0`;

const statefulSetExample = `apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db
spec:
  serviceName: db
  replicas: 3
  selector:
    matchLabels: { app: db }
  template:
    metadata:
      labels: { app: db }
    spec:
      containers:
      - name: db
        image: postgres:17
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: [ReadWriteOnce]
      resources:
        requests: { storage: 20Gi }`;

const daemonSetExample = `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-agent
spec:
  selector:
    matchLabels: { app: node-agent }
  template:
    metadata:
      labels: { app: node-agent }
    spec:
      containers:
      - name: agent
        image: example/agent:1.0`;

const affinityExample = `affinity:
  podAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 50
      podAffinityTerm:
        topologyKey: kubernetes.io/hostname
        labelSelector:
          matchLabels:
            app: cache`;

const antiAffinityExample = `affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
    - topologyKey: kubernetes.io/hostname
      labelSelector:
        matchLabels:
          app: web`;

const nodeAffinityExample = `affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
      - matchExpressions:
        - key: disktype
          operator: In
          values: [ssd]`;

const startupExample = `startupProbe:
  httpGet:
    path: /startup
    port: 8080
  periodSeconds: 5
  failureThreshold: 30`;

const readinessExample = `readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
  failureThreshold: 2`;

const livenessExample = `livenessProbe:
  httpGet:
    path: /live
    port: 8080
  periodSeconds: 10
  failureThreshold: 3`;

const volumeExample = `spec:
  volumes:
  - name: scratch
    emptyDir: {}
  containers:
  - name: worker
    image: example/worker:1.0
    volumeMounts:
    - name: scratch
      mountPath: /work`;

const pvExample = `apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-data
spec:
  capacity: { storage: 20Gi }
  accessModes: [ReadWriteOnce]
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:
    path: /data # lab only`;

const pvcExample = `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: fast
  resources:
    requests:
      storage: 20Gi`;

const storageClassExample = `apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: csi.example.com
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer`;

const rbacExample = `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: app
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-pod-reader
  namespace: app
subjects:
- kind: ServiceAccount
  name: api
  namespace: app
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-reader`;

const cniCommands = `kubectl get nodes -o wide
kubectl get pods -A -o wide
kubectl get pods -n kube-system
kubectl get networkpolicy -A`;

const podNetworkExample = `# Example at cluster bootstrap (value depends on your CNI)
kubeadm init --pod-network-cidr=10.244.0.0/16

# Do not edit status.podIP manually.
# Existing-cluster CIDR migration is CNI/provider specific.`;

const kubeProxyCommands = `kubectl -n kube-system get ds kube-proxy
kubectl -n kube-system get configmap kube-proxy -o yaml
kubectl get svc,endpointslice -A`;

const kubeletCommands = `kubectl describe node <node>
kubectl get pod -o wide
journalctl -u kubelet --since "30 min ago"
crictl ps
crictl pods`;

const certManagerExample = `apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: api-server-tls
  namespace: default
spec:
  secretName: api-server-tls
  duration: 24h
  renewBefore: 8h
  dnsNames:
  - api.default.svc
  - api.default.svc.cluster.local
  usages:
  - server auth
  issuerRef:
    name: workload-ca
    kind: Issuer
---
# Mount api-server-tls only in the server Pod.
# For mTLS, issue a separate client certificate with "client auth".`;

function Code({ children }: { children: string }) {
  return <pre className="reference-code"><code>{children}</code></pre>;
}

function MiniTopic({ id, title, diagramKey, children, code }: { id: string; title: string; diagramKey: KubernetesDeepDiveDiagramKey; children: ReactNode; code?: string }) {
  const { locale } = useLanguage();
  return (
    <div className="reference-card" id={id}>
      <h3>{title}</h3>
      {children}
      {code ? <Code>{code}</Code> : null}
      <TopicDiagram spec={getKubernetesDeepDiveDiagram(diagramKey, locale)} />
    </div>
  );
}

export function KubernetesDeepDiveReference() {
  const { locale, t } = useLanguage();
  return (
    <div id="kubernetes-deep-dive">
      <section className="article-section" id="k8s-services">
        <h2>{t('Services, portas e descoberta', 'Services, ports, and discovery')}</h2>
        <p className="section-summary">{t('Service fornece identidade estável sobre Pods efêmeros. O tipo escolhido define onde o Service é alcançável; port e targetPort definem como a conexão chega ao processo.', 'A Service provides stable identity over ephemeral Pods. The selected type defines where the Service is reachable; port and targetPort define how the connection reaches the process.')}</p>
        <div className="reference-grid">
          <MiniTopic id="k8s-clusterip" title="ClusterIP" diagramKey="clusterip" code={serviceExample}><p>{t('Tipo padrão. Cria um VIP interno para comunicação dentro do cluster. Normalmente é o tipo usado atrás de Ingress/Gateway e para comunicação service-to-service.', 'Default type. Creates an internal VIP for in-cluster communication. It is commonly used behind Ingress/Gateway and for service-to-service communication.')}</p></MiniTopic>
          <MiniTopic id="k8s-nodeport" title="NodePort" diagramKey="nodeport" code={nodePortExample}><p>{t('Abre uma porta no endereço dos Nodes e encaminha para o Service. É útil para labs, integrações específicas ou como camada usada por alguns LoadBalancers; raramente é a interface pública preferida diretamente.', 'Opens a port on Node addresses and forwards to the Service. It is useful for labs, specific integrations, or as a layer used by some LoadBalancers; it is rarely the preferred direct public interface.')}</p></MiniTopic>
          <MiniTopic id="k8s-loadbalancer" title="LoadBalancer" diagramKey="loadbalancer" code={loadBalancerExample}><p>{t('Solicita integração com um load balancer externo. Em cloud, o cloud controller/provider normalmente provisiona o recurso; em bare metal é necessária uma implementação compatível.', 'Requests integration with an external load balancer. In cloud environments the provider/controller normally provisions it; bare metal requires a compatible implementation.')}</p></MiniTopic>
          <MiniTopic id="k8s-headless" title="Headless Service" diagramKey="headless" code={headlessExample}><p>{t('Use clusterIP: None quando o cliente precisa descobrir endpoints individuais em vez de um VIP balanceado. É comum com StatefulSets, bancos e protocolos que possuem descoberta/replicação própria.', 'Use clusterIP: None when clients need to discover individual endpoints instead of a load-balanced VIP. This is common with StatefulSets, databases, and protocols with their own discovery/replication.')}</p></MiniTopic>
          <MiniTopic id="k8s-ports" title="containerPort / port / targetPort" diagramKey="ports" code={portsExample}><p>{t('containerPort documenta a porta do container e permite nomes de porta; não abre firewall nem publica a aplicação. Service port é o porto consumido pelo cliente no Service; targetPort aponta para a porta real do endpoint.', 'containerPort documents the container port and enables named ports; it does not open a firewall or expose the application. Service port is consumed by clients on the Service; targetPort points to the actual endpoint port.')}</p></MiniTopic>
        </div>
      </section>

      <section className="article-section" id="k8s-controllers">
        <h2>{t('ReplicaSet, Deployment, StatefulSet e DaemonSet', 'ReplicaSet, Deployment, StatefulSet, and DaemonSet')}</h2>
        <div className="reference-grid">
          <MiniTopic id="k8s-replicaset" title="ReplicaSet" diagramKey="replicaset" code={replicaSetExample}><p>{t('Mantém um número desejado de Pods correspondentes ao selector. Na prática, aplicações normalmente usam Deployment, que administra ReplicaSets e revisões.', 'Maintains a desired number of Pods matching a selector. In practice applications normally use Deployment, which manages ReplicaSets and revisions.')}</p></MiniTopic>
          <MiniTopic id="k8s-deployment" title="Deployment" diagramKey="deployment" code={deploymentExample}><p>{t('Controlador padrão para workloads stateless intercambiáveis. Adiciona rollout, rollback, histórico e estratégias como RollingUpdate sobre ReplicaSets.', 'Standard controller for interchangeable stateless workloads. Adds rollout, rollback, revision history, and strategies such as RollingUpdate on top of ReplicaSets.')}</p></MiniTopic>
          <MiniTopic id="k8s-statefulset" title="StatefulSet" diagramKey="statefulset" code={statefulSetExample}><p>{t('Use quando réplicas precisam de identidade estável, ordem e/ou storage próprio. Os Pods recebem ordinais como db-0 e db-1; volumeClaimTemplates cria claims independentes.', 'Use when replicas require stable identity, ordering, and/or dedicated storage. Pods receive ordinals such as db-0 and db-1; volumeClaimTemplates creates independent claims.')}</p></MiniTopic>
          <MiniTopic id="k8s-daemonset" title="DaemonSet" diagramKey="daemonset" code={daemonSetExample}><p>{t('Garante um Pod em cada Node elegível. Casos típicos: CNI agents, CSI node plugins, log collectors, node exporters e security agents.', 'Ensures one Pod on each eligible Node. Common cases include CNI agents, CSI node plugins, log collectors, node exporters, and security agents.')}</p></MiniTopic>
        </div>
      </section>

      <section className="article-section" id="k8s-scheduling">
        <h2>{t('Affinity, anti-affinity e node affinity', 'Affinity, anti-affinity, and node affinity')}</h2>
        <div className="reference-grid">
          <MiniTopic id="k8s-affinity" title="Pod affinity" diagramKey="affinity" code={affinityExample}><p>{t('Co-localiza Pods baseado em labels de outros Pods e um domínio topológico. Prefira regras preferred quando a co-localização é otimização e não requisito funcional.', 'Co-locates Pods based on labels of other Pods and a topology domain. Prefer preferred rules when co-location is an optimization rather than a functional requirement.')}</p></MiniTopic>
          <MiniTopic id="k8s-anti-affinity" title="Pod anti-affinity" diagramKey="antiaffinity" code={antiAffinityExample}><p>{t('Espalha réplicas para reduzir falha correlacionada. Regras required podem deixar Pods Pending quando não existe topologia suficiente; em clusters grandes, inter-pod affinity/anti-affinity também aumenta custo de scheduling.', 'Spreads replicas to reduce correlated failure. Required rules can leave Pods Pending when topology is insufficient; in large clusters, inter-pod affinity/anti-affinity also increases scheduling cost.')}</p></MiniTopic>
          <MiniTopic id="k8s-node-affinity" title="Node affinity" diagramKey="nodeaffinity" code={nodeAffinityExample}><p>{t('Seleciona Nodes por labels. requiredDuringScheduling... filtra Nodes; preferredDuringScheduling... apenas altera o score. É mais expressivo que nodeSelector.', 'Selects Nodes by labels. requiredDuringScheduling... filters Nodes; preferredDuringScheduling... only changes scoring. It is more expressive than nodeSelector.')}</p></MiniTopic>
        </div>
      </section>

      <section className="article-section" id="k8s-probes">
        <h2>{t('Startup, readiness e liveness probes', 'Startup, readiness, and liveness probes')}</h2>
        <div className="reference-grid">
          <MiniTopic id="k8s-startup" title="startupProbe" diagramKey="startup" code={startupExample}><p>{t('Use para aplicações que podem demorar a inicializar. Enquanto não houver sucesso, liveness/readiness ficam suspensas, evitando matar prematuramente o container.', 'Use it for applications that can take time to initialize. Until it succeeds, liveness/readiness remain suspended, avoiding premature container termination.')}</p></MiniTopic>
          <MiniTopic id="k8s-readiness" title="readinessProbe" diagramKey="readiness" code={readinessExample}><p>{t('Responde: “este container deve receber tráfego agora?”. Falha retira o endpoint do caminho normal, mas não reinicia o container.', 'Answers: “should this container receive traffic now?”. Failure removes the endpoint from the normal traffic path but does not restart the container.')}</p></MiniTopic>
          <MiniTopic id="k8s-liveness" title="livenessProbe" diagramKey="liveness" code={livenessExample}><p>{t('Responde: “o processo está irrecuperavelmente travado e precisa reiniciar?”. Não faça a probe depender de database ou API externa, pois uma falha externa pode provocar restart storm.', 'Answers: “is the process irrecoverably stuck and in need of restart?”. Do not make the probe depend on a database or external API, because an external failure can trigger a restart storm.')}</p></MiniTopic>
        </div>
      </section>

      <section className="article-section" id="k8s-storage">
        <h2>{t('Volumes, PV, PVC e StorageClass', 'Volumes, PVs, PVCs, and StorageClass')}</h2>
        <div className="reference-grid">
          <MiniTopic id="k8s-volume" title="Volume" diagramKey="volume" code={volumeExample}><p>{t('Volume é o mecanismo de montagem no Pod. Alguns volumes são efêmeros; outros apontam para storage persistente. emptyDir existe enquanto o Pod permanece naquele Node.', 'A Volume is the Pod mounting mechanism. Some volumes are ephemeral; others point to persistent storage. emptyDir exists while the Pod remains on that Node.')}</p></MiniTopic>
          <MiniTopic id="k8s-pv" title="PersistentVolume (PV)" diagramKey="pv" code={pvExample}><p>{t('PV é cluster-scoped e representa capacidade de storage. Em produção, prefira CSI/provisionamento apropriado ao provider; hostPath neste exemplo serve apenas para laboratório.', 'A PV is cluster-scoped and represents storage capacity. In production prefer CSI/provider-appropriate provisioning; hostPath in this example is for lab use only.')}</p></MiniTopic>
          <MiniTopic id="k8s-pvc" title="PersistentVolumeClaim (PVC)" diagramKey="pvc" code={pvcExample}><p>{t('PVC é o pedido namespaced feito pela aplicação. O Pod referencia o claim; o binder encontra ou provisiona um PV que satisfaça classe, capacidade e access modes.', 'A PVC is the namespaced storage request made by an application. The Pod references the claim; the binder finds or provisions a PV that satisfies class, capacity, and access modes.')}</p></MiniTopic>
          <MiniTopic id="k8s-delete-pvc" title={t('Deletar o PVC', 'Deleting the PVC')} diagramKey="deletepvc" code={`kubectl get pv,pvc\nkubectl delete pvc data`}><p>{t('Com reclaimPolicy Delete, um volume provisionado dinamicamente tende a ser removido junto com o storage externo após as proteções necessárias. Com Retain, o PV passa a Released e exige ação manual para recuperar/reutilizar os dados.', 'With reclaimPolicy Delete, a dynamically provisioned volume is normally removed together with external storage after the necessary protections. With Retain, the PV moves to Released and requires manual recovery/reuse.')}</p></MiniTopic>
          <MiniTopic id="k8s-delete-pv" title={t('Deletar o PV', 'Deleting the PV')} diagramKey="deletepv" code={`kubectl get pv <pv-name> -o yaml\nkubectl delete pv <pv-name>`}><p>{t('Não trate PV como um arquivo descartável. Se estiver em uso, pv-protection mantém o objeto Terminating. Antes de remover, confirme claim, Pods consumidores, reclaimPolicy, snapshot/backup e comportamento do CSI.', 'Do not treat a PV as a disposable file. If it is in use, pv-protection keeps the object Terminating. Before removal, confirm the claim, consuming Pods, reclaimPolicy, snapshot/backup, and CSI behavior.')}</p></MiniTopic>
          <MiniTopic id="k8s-storageclass" title="StorageClass" diagramKey="storageclass" code={storageClassExample}><p>{t('Define o provisioner CSI e a política de provisionamento. WaitForFirstConsumer é útil para storage zonal porque permite considerar onde o Pod será agendado antes de criar/bindar o volume.', 'Defines the CSI provisioner and provisioning policy. WaitForFirstConsumer is useful for zonal storage because Pod placement can be considered before creating/binding the volume.')}</p></MiniTopic>
        </div>
      </section>

      <section className="article-section" id="k8s-rbac">
        <h2>RBAC</h2>
        <MiniTopic id="k8s-rbac-example" title="Role / ClusterRole / Binding" diagramKey="rbac" code={rbacExample}><p>{t('Role é namespaced; ClusterRole é cluster-scoped e também pode definir regras reutilizadas em namespaces. RoleBinding pode ligar um ClusterRole a sujeitos dentro de um namespace. Permissões são aditivas: desenhe least privilege e evite wildcards.', 'Role is namespaced; ClusterRole is cluster-scoped and can also define reusable namespaced rules. A RoleBinding can bind a ClusterRole to subjects within one namespace. Permissions are additive: design for least privilege and avoid wildcards.')}</p></MiniTopic>
      </section>

      <section className="article-section" id="k8s-networking-deep">
        <h2>{t('CNI, redes dos Pods e kube-proxy', 'CNI, Pod networks, and kube-proxy')}</h2>
        <div className="reference-grid">
          <MiniTopic id="k8s-cni" title="CNI" diagramKey="cni" code={cniCommands}><p>{t('O CNI implementa a rede primária dos Pods. O runtime chama os plugins para interface/IPAM/rotas; NetworkPolicy só funciona quando o dataplane escolhido a implementa. Desde Kubernetes 1.24, gerenciamento do CNI não é responsabilidade direta do kubelet.', 'CNI implements primary Pod networking. The runtime invokes plugins for interfaces/IPAM/routes; NetworkPolicy only works when the selected dataplane implements it. Since Kubernetes 1.24, CNI management is no longer a direct kubelet responsibility.')}</p></MiniTopic>
          <MiniTopic id="k8s-pod-network" title={t('Alterar a rede dos Pods', 'Changing the Pod network')} diagramKey="podnetwork" code={podNetworkExample}><p>{t('Não existe “kubectl set pod-ip”. Para mudar a rede primária, altere a configuração/IPAM do CNI e os CIDRs/rotas de forma coordenada. Em cluster existente, trate isso como migração de rede: procedimentos variam por CNI e frequentemente exigem recriar Pods ou o cluster.', 'There is no “kubectl set pod-ip”. To change the primary network, update CNI/IPAM configuration and CIDRs/routes coherently. On an existing cluster, treat this as a network migration: procedures vary by CNI and frequently require recreating Pods or the cluster.')}</p></MiniTopic>
          <MiniTopic id="k8s-kube-proxy" title="kube-proxy" diagramKey="kubeproxy" code={kubeProxyCommands}><p>{t('Observa Services e EndpointSlices e mantém o dataplane de Service em cada Node. Em Linux, iptables e nftables são implementações relevantes; IPVS está deprecated nas versões atuais. Algumas CNIs e eBPF dataplanes substituem kube-proxy.', 'Watches Services and EndpointSlices and maintains the Service dataplane on each Node. On Linux, iptables and nftables are relevant implementations; IPVS is deprecated in current releases. Some CNIs and eBPF dataplanes replace kube-proxy.')}</p></MiniTopic>
        </div>
      </section>

      <section className="article-section" id="k8s-kubelet">
        <h2>kubelet</h2>
        <MiniTopic id="k8s-kubelet-example" title={t('Agente responsável pelo Node', 'The node agent')} diagramKey="kubelet" code={kubeletCommands}><p>{t('kubelet não escolhe onde o Pod roda; isso é função do scheduler. Depois do binding, kubelet converge o PodSpec naquele Node: cria sandbox/containers via CRI, coordena mounts, executa probes, gerencia lifecycle e atualiza status. O endpoint HTTPS do kubelet também precisa de autenticação/autorização adequadas.', 'kubelet does not choose where a Pod runs; that is the scheduler’s job. After binding, kubelet converges the PodSpec on that Node: creates sandboxes/containers via CRI, coordinates mounts, runs probes, manages lifecycle, and updates status. The kubelet HTTPS endpoint also requires appropriate authentication/authorization.')}</p></MiniTopic>
      </section>

      <section className="article-section" id="k8s-pod-tls">
        <h2>{t('TLS e mTLS entre Pods', 'TLS and mTLS between Pods')}</h2>
        <MiniTopic id="k8s-pod-tls-example" title={t('Certificados de workload com rotação automática', 'Workload certificates with automatic rotation')} diagramKey="tls" code={certManagerExample}>
          <p>{t('Para TLS de aplicação, use o DNS estável do Service no SAN do certificado, uma CA/Issuer controlada e renovação automática. Monte a chave somente no workload que precisa dela e restrinja acesso ao Secret com RBAC. Para mTLS, emita também identidade de cliente e valide ambos os lados.', 'For application TLS, use the stable Service DNS name in the certificate SAN, a controlled CA/Issuer, and automatic renewal. Mount the private key only into the workload that needs it and restrict Secret access with RBAC. For mTLS, also issue a client identity and validate both sides.')}</p>
          <div className="reference-note"><strong>{t('Best practices:', 'Best practices:')}</strong> {t('certificados curtos e renováveis; SAN em vez de confiar apenas em CN; CA raiz protegida e intermediária para emissão; chaves fora da imagem; least privilege no Secret; NetworkPolicy além de TLS; validação de hostname/CA; observabilidade de expiração; e service mesh quando dezenas/centenas de workloads precisam de mTLS e rotação automática.', 'short-lived renewable certificates; SANs instead of relying only on CN; protected root CA with an issuing intermediate; keys outside images; least privilege on Secrets; NetworkPolicy in addition to TLS; hostname/CA validation; expiration monitoring; and a service mesh when tens/hundreds of workloads need mTLS and automatic rotation.')}</div>
          <p>{locale === 'en' ? 'Kubernetes CertificateSigningRequest can integrate with a custom signer, but the built-in Kubernetes signers are not a general-purpose automatic server-certificate service for arbitrary application Pods. cert-manager or a service mesh is usually operationally safer for workload certificate lifecycle.' : 'CertificateSigningRequest pode integrar Kubernetes a um signer customizado, mas os signers built-in não são um serviço genérico de emissão automática de certificados de servidor para qualquer Pod de aplicação. cert-manager ou service mesh normalmente tornam o ciclo de vida dos certificados de workload mais seguro operacionalmente.'}</p>
        </MiniTopic>
      </section>
    </div>
  );
}
