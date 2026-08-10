import type { DiagramSpec, InterviewVisual } from './diagrams';

const sources = {
  vsphereHa: { label: 'Broadcom — vSphere HA', url: 'https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-availability.html' },
  vmotion: { label: 'Broadcom — vMotion', url: 'https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vcenter-and-host-management-8-0/migrating-virtual-machines-host-management.html' },
  networking: { label: 'Broadcom — vSphere Networking', url: 'https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-networking-8-0.html' },
  storage: { label: 'Broadcom — vSphere Storage', url: 'https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-storage-8-0.html' },
  performance: { label: 'Broadcom — vSphere Monitoring and Performance', url: 'https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vsphere-monitoring-and-performance-8-0.html' },
  otelSignals: { label: 'OpenTelemetry — Signals', url: 'https://opentelemetry.io/docs/concepts/signals/' },
  otelCollector: { label: 'OpenTelemetry — Collector', url: 'https://opentelemetry.io/docs/collector/' },
  otelTraces: { label: 'OpenTelemetry — Traces', url: 'https://opentelemetry.io/docs/concepts/signals/traces/' },
  sreSlo: { label: 'Google SRE — Service Level Objectives', url: 'https://sre.google/sre-book/service-level-objectives/' },
  sreMonitoring: { label: 'Google SRE — Monitoring Distributed Systems', url: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
};

const vmwareSections: Record<string, DiagramSpec> = {
  fundamentos: {
    title: 'VMware virtualization stack',
    description: 'O hardware físico é abstraído pelo ESXi. Cada VM recebe hardware virtual e executa seu próprio guest OS; vCenter administra hosts e VMs sem ficar no data path normal da aplicação.',
    width: 1040,
    height: 520,
    nodes: [
      { id: 'vcenter', label: 'vCenter Server\nmanagement plane', x: 30, y: 55, width: 190, kind: 'control' },
      { id: 'vm1', label: 'VM 1\nApp + Guest OS', x: 300, y: 45, width: 185, height: 72, kind: 'workload' },
      { id: 'vm2', label: 'VM 2\nApp + Guest OS', x: 540, y: 45, width: 185, height: 72, kind: 'workload' },
      { id: 'vm3', label: 'VM 3\nApp + Guest OS', x: 780, y: 45, width: 185, height: 72, kind: 'workload' },
      { id: 'esxi', label: 'ESXi Hypervisor\nCPU scheduling · memory · I/O', x: 325, y: 185, width: 470, height: 78, kind: 'control' },
      { id: 'vswitch', label: 'vSwitch / vDS', x: 210, y: 315, width: 180, kind: 'network' },
      { id: 'datastore', label: 'Datastore\nVMFS / NFS / vSAN', x: 455, y: 315, width: 205, kind: 'data' },
      { id: 'hardware', label: 'Physical Server\nCPU · RAM · NIC · HBA', x: 725, y: 315, width: 220, kind: 'workload' },
      { id: 'network', label: 'Physical Network', x: 180, y: 425, width: 190, kind: 'network' },
      { id: 'storage', label: 'Physical Storage', x: 470, y: 425, width: 190, kind: 'data' },
    ],
    edges: [
      { from: 'vcenter', to: 'esxi', label: 'manage' },
      { from: 'vm1', to: 'esxi' }, { from: 'vm2', to: 'esxi' }, { from: 'vm3', to: 'esxi' },
      { from: 'esxi', to: 'vswitch' }, { from: 'esxi', to: 'datastore' }, { from: 'esxi', to: 'hardware' },
      { from: 'vswitch', to: 'network' }, { from: 'datastore', to: 'storage' },
    ],
    sources: [sources.networking, sources.storage, sources.performance],
  },
  cluster: {
    title: 'vSphere cluster: HA, DRS and vMotion',
    description: 'vMotion move uma VM em execução entre hosts; DRS decide placement e rebalanceamento; HA reage à falha de um host reiniciando VMs nos hosts sobreviventes.',
    width: 1080,
    height: 500,
    nodes: [
      { id: 'vcenter', label: 'vCenter\nCluster control', x: 430, y: 25, width: 210, kind: 'control' },
      { id: 'drs', label: 'DRS\nplacement / rebalance', x: 120, y: 115, width: 210, kind: 'decision' },
      { id: 'ha', label: 'vSphere HA\nrestart after host failure', x: 750, y: 115, width: 220, kind: 'decision' },
      { id: 'h1', label: 'ESXi 01\nVM A · VM B', x: 95, y: 245, width: 220, height: 72, kind: 'workload' },
      { id: 'h2', label: 'ESXi 02\nVM C', x: 430, y: 245, width: 220, height: 72, kind: 'workload' },
      { id: 'h3', label: 'ESXi 03\nFAILED', x: 765, y: 245, width: 220, height: 72, kind: 'security' },
      { id: 'shared', label: 'Shared Datastore', x: 430, y: 405, width: 220, kind: 'data' },
    ],
    edges: [
      { from: 'vcenter', to: 'drs' }, { from: 'vcenter', to: 'ha' },
      { from: 'drs', to: 'h1', label: 'placement' }, { from: 'drs', to: 'h2', label: 'rebalance' },
      { from: 'h1', to: 'h2', label: 'vMotion', animated: true, bidirectional: true },
      { from: 'h3', to: 'ha', label: 'host failure' }, { from: 'ha', to: 'h2', label: 'restart VM' },
      { from: 'h1', to: 'shared' }, { from: 'h2', to: 'shared' }, { from: 'h3', to: 'shared' },
    ],
    sources: [sources.vsphereHa, sources.vmotion, sources.performance],
  },
  'rede-storage': {
    title: 'VMware network and storage data paths',
    description: 'A VM chega à rede física através de vNIC, port group, virtual switch e uplink. O I/O de disco percorre VMDK, datastore, stack de storage e múltiplos paths até o array.',
    width: 1160,
    height: 500,
    nodes: [
      { id: 'vmnet', label: 'VM\nvNIC', x: 30, y: 75, width: 145, kind: 'workload' },
      { id: 'pg', label: 'Port Group\nVLAN / policy', x: 220, y: 75, width: 170, kind: 'network' },
      { id: 'vds', label: 'vSS / vDS', x: 435, y: 75, width: 160, kind: 'network' },
      { id: 'uplink', label: 'vmnic / Uplink', x: 640, y: 75, width: 170, kind: 'network' },
      { id: 'pswitch', label: 'Physical Switch', x: 855, y: 75, width: 180, kind: 'network' },
      { id: 'network', label: 'External Network', x: 1060, y: 75, width: 90, kind: 'network' },
      { id: 'vmdk', label: 'VM\nVMDK', x: 30, y: 320, width: 145, kind: 'workload' },
      { id: 'ds', label: 'Datastore', x: 220, y: 320, width: 170, kind: 'data' },
      { id: 'stack', label: 'ESXi Storage Stack', x: 435, y: 320, width: 180, kind: 'control' },
      { id: 'patha', label: 'Path A\nHBA / iSCSI', x: 690, y: 255, width: 175, kind: 'network' },
      { id: 'pathb', label: 'Path B\nHBA / iSCSI', x: 690, y: 385, width: 175, kind: 'network' },
      { id: 'array', label: 'Storage Array', x: 970, y: 320, width: 175, kind: 'data' },
    ],
    edges: [
      { from: 'vmnet', to: 'pg' }, { from: 'pg', to: 'vds' }, { from: 'vds', to: 'uplink' }, { from: 'uplink', to: 'pswitch' }, { from: 'pswitch', to: 'network' },
      { from: 'vmdk', to: 'ds' }, { from: 'ds', to: 'stack' }, { from: 'stack', to: 'patha' }, { from: 'stack', to: 'pathb' }, { from: 'patha', to: 'array' }, { from: 'pathb', to: 'array' },
    ],
    sources: [sources.networking, sources.storage],
  },
  especialista: {
    title: 'VMware performance troubleshooting path',
    description: 'Uma aplicação lenta deve ser investigada por camadas: guest, VM, ESXi e infraestrutura física. CPU Ready, ballooning/swapping, storage latency e drops ajudam a localizar contenção fora do guest OS.',
    width: 1120,
    height: 520,
    nodes: [
      { id: 'app', label: 'Application\nlatency / errors', x: 30, y: 205, width: 180, kind: 'client' },
      { id: 'guest', label: 'Guest OS\nCPU · memory · disk · network', x: 255, y: 205, width: 225, kind: 'workload' },
      { id: 'vm', label: 'Virtual Machine\nvCPU · vRAM · VMDK · vNIC', x: 525, y: 205, width: 235, kind: 'workload' },
      { id: 'cpu', label: 'ESXi CPU Scheduler\nCPU Ready / Co-Stop', x: 830, y: 35, width: 240, kind: 'control' },
      { id: 'mem', label: 'ESXi Memory\nBalloon / Swap', x: 830, y: 155, width: 240, kind: 'control' },
      { id: 'io', label: 'ESXi Storage\nGAVG / KAVG / DAVG', x: 830, y: 275, width: 240, kind: 'data' },
      { id: 'net', label: 'ESXi Network\nDrops / throughput', x: 830, y: 395, width: 240, kind: 'network' },
    ],
    edges: [
      { from: 'app', to: 'guest' }, { from: 'guest', to: 'vm' },
      { from: 'vm', to: 'cpu' }, { from: 'vm', to: 'mem' }, { from: 'vm', to: 'io' }, { from: 'vm', to: 'net' },
    ],
    sources: [sources.performance, sources.storage, sources.networking],
  },
};

const observabilitySections: Record<string, DiagramSpec> = {
  fundamentos: {
    title: 'One request, multiple observability signals',
    description: 'Metrics, logs and traces describe the same distributed request from different perspectives. Shared context makes those signals useful together rather than as isolated telemetry silos.',
    width: 1120,
    height: 480,
    nodes: [
      { id: 'user', label: 'User Request', x: 25, y: 90, width: 150, kind: 'client' },
      { id: 'front', label: 'Frontend', x: 235, y: 90, width: 165, kind: 'workload' },
      { id: 'api', label: 'API', x: 470, y: 90, width: 165, kind: 'workload' },
      { id: 'pay', label: 'Payment Service', x: 705, y: 90, width: 175, kind: 'workload' },
      { id: 'db', label: 'Database', x: 950, y: 90, width: 145, kind: 'data' },
      { id: 'metrics', label: 'Metrics\nrate · errors · latency', x: 170, y: 300, width: 220, kind: 'data' },
      { id: 'logs', label: 'Logs\nevents + context', x: 450, y: 300, width: 220, kind: 'data' },
      { id: 'traces', label: 'Distributed Trace\ntrace ID + spans', x: 730, y: 300, width: 220, kind: 'data' },
      { id: 'corr', label: 'Correlation\nsame request / same context', x: 470, y: 405, width: 260, kind: 'decision' },
    ],
    edges: [
      { from: 'user', to: 'front', animated: true }, { from: 'front', to: 'api', animated: true }, { from: 'api', to: 'pay', animated: true }, { from: 'pay', to: 'db', animated: true },
      { from: 'front', to: 'metrics' }, { from: 'api', to: 'logs' }, { from: 'pay', to: 'traces' },
      { from: 'metrics', to: 'corr' }, { from: 'logs', to: 'corr' }, { from: 'traces', to: 'corr' },
    ],
    sources: [sources.otelSignals, sources.otelTraces],
  },
  'sli-slo': {
    title: 'SLI → SLO → error budget → action loop',
    description: 'Um SLI mede comportamento observado. O SLO define a meta. O error budget transforma a diferença entre objetivo e realidade em um mecanismo operacional para decidir risco, alertas e ritmo de mudanças.',
    width: 1050,
    height: 470,
    nodes: [
      { id: 'ux', label: 'User Experience', x: 40, y: 180, width: 175, kind: 'client' },
      { id: 'sli', label: 'SLI\navailability · latency · correctness', x: 270, y: 180, width: 230, kind: 'data' },
      { id: 'slo', label: 'SLO\ntarget over time window', x: 555, y: 180, width: 210, kind: 'decision' },
      { id: 'budget', label: 'Error Budget\nremaining reliability margin', x: 820, y: 180, width: 210, kind: 'data' },
      { id: 'healthy', label: 'Budget healthy\ncontinue controlled delivery', x: 670, y: 340, width: 240, kind: 'workload' },
      { id: 'burn', label: 'Budget burning\nalert / reliability work', x: 300, y: 340, width: 235, kind: 'security' },
    ],
    edges: [
      { from: 'ux', to: 'sli' }, { from: 'sli', to: 'slo' }, { from: 'slo', to: 'budget' },
      { from: 'budget', to: 'healthy', label: 'within objective' }, { from: 'budget', to: 'burn', label: 'burn rate high' },
      { from: 'healthy', to: 'sli', label: 'measure again' }, { from: 'burn', to: 'sli', label: 'measure again' },
    ],
    sources: [sources.sreSlo, sources.sreMonitoring],
  },
  instrumentacao: {
    title: 'OpenTelemetry telemetry pipeline',
    description: 'Aplicações e infraestrutura produzem sinais; o OpenTelemetry Collector recebe, processa e exporta telemetria para um ou mais backends sem acoplar cada workload diretamente a cada fornecedor.',
    width: 1120,
    height: 500,
    nodes: [
      { id: 'apps', label: 'Applications\nSDK / auto-instrumentation', x: 30, y: 75, width: 220, kind: 'workload' },
      { id: 'infra', label: 'Infrastructure\nhosts · containers · network', x: 30, y: 285, width: 220, kind: 'workload' },
      { id: 'receivers', label: 'Collector Receivers\nOTLP · Prometheus · logs', x: 340, y: 75, width: 230, kind: 'network' },
      { id: 'processors', label: 'Processors\nbatch · sample · enrich · filter', x: 340, y: 210, width: 230, kind: 'control' },
      { id: 'exporters', label: 'Exporters\nOTLP · vendor backends', x: 340, y: 345, width: 230, kind: 'network' },
      { id: 'metrics', label: 'Metrics Backend', x: 700, y: 55, width: 190, kind: 'data' },
      { id: 'logs', label: 'Logs Backend', x: 700, y: 210, width: 190, kind: 'data' },
      { id: 'traces', label: 'Trace Backend', x: 700, y: 365, width: 190, kind: 'data' },
      { id: 'ops', label: 'Dashboards · Alerts\nInvestigation', x: 940, y: 210, width: 165, height: 72, kind: 'decision' },
    ],
    edges: [
      { from: 'apps', to: 'receivers' }, { from: 'infra', to: 'receivers' },
      { from: 'receivers', to: 'processors' }, { from: 'processors', to: 'exporters' },
      { from: 'exporters', to: 'metrics' }, { from: 'exporters', to: 'logs' }, { from: 'exporters', to: 'traces' },
      { from: 'metrics', to: 'ops' }, { from: 'logs', to: 'ops' }, { from: 'traces', to: 'ops' },
    ],
    sources: [sources.otelCollector, sources.otelSignals],
  },
  especialista: {
    title: 'From user symptom to root-cause hypothesis',
    description: 'Uma investigação madura começa pelo impacto observável ao utilizador, usa RED para localizar o serviço degradado, traces para encontrar a dependência crítica e USE/infra telemetry para validar a causa física ou lógica.',
    width: 1120,
    height: 500,
    nodes: [
      { id: 'symptom', label: 'User symptom\n"checkout is slow"', x: 25, y: 205, width: 190, kind: 'client' },
      { id: 'red', label: 'Service signals\nRate · Errors · Duration', x: 260, y: 205, width: 220, kind: 'data' },
      { id: 'trace', label: 'Trace slow request\nfind critical span', x: 525, y: 205, width: 215, kind: 'data' },
      { id: 'dep', label: 'Dependency\nservice / database / queue', x: 785, y: 205, width: 225, kind: 'decision' },
      { id: 'use', label: 'Resource signals\nUtilization · Saturation · Errors', x: 760, y: 350, width: 250, kind: 'data' },
      { id: 'logs', label: 'Logs · events · changes\nconfiguration / deployment', x: 485, y: 350, width: 235, kind: 'data' },
      { id: 'root', label: 'Root-cause hypothesis\nvalidate before remediation', x: 175, y: 350, width: 250, kind: 'decision' },
    ],
    edges: [
      { from: 'symptom', to: 'red' }, { from: 'red', to: 'trace' }, { from: 'trace', to: 'dep' },
      { from: 'dep', to: 'use' }, { from: 'use', to: 'logs' }, { from: 'logs', to: 'root' }, { from: 'root', to: 'red', label: 'verify recovery' },
    ],
    sources: [sources.sreMonitoring, sources.otelTraces, sources.otelSignals],
  },
};

export const vmwareObservabilityIntegrated: DiagramSpec = {
  title: 'Observability across a VMware virtualized stack',
  description: 'O mesmo incidente pode atravessar aplicação, guest OS, VM, hypervisor e infraestrutura. Correlacionar sinais dessas camadas evita atribuir ao guest um problema que está no scheduler, memória, storage ou rede do ESXi.',
  width: 1140,
  height: 560,
  nodes: [
    { id: 'user', label: 'User\nlatency / errors', x: 25, y: 225, width: 160, kind: 'client' },
    { id: 'app', label: 'Application\nmetrics · logs · traces', x: 225, y: 225, width: 210, kind: 'workload' },
    { id: 'guest', label: 'Guest OS\nCPU · RAM · disk · network', x: 475, y: 225, width: 220, kind: 'workload' },
    { id: 'cpu', label: 'ESXi CPU\nCPU Ready', x: 760, y: 35, width: 185, kind: 'control' },
    { id: 'mem', label: 'ESXi Memory\nBalloon / Swap', x: 760, y: 150, width: 185, kind: 'control' },
    { id: 'storage', label: 'ESXi Storage\nGAVG / KAVG / DAVG', x: 760, y: 265, width: 185, kind: 'data' },
    { id: 'network', label: 'ESXi Network\nDrops / throughput', x: 760, y: 380, width: 185, kind: 'network' },
    { id: 'telemetry', label: 'Telemetry Pipeline\ncollect · enrich · correlate', x: 965, y: 225, width: 165, height: 72, kind: 'data' },
    { id: 'root', label: 'Root Cause\napplication or infrastructure?', x: 465, y: 455, width: 245, height: 72, kind: 'decision' },
  ],
  edges: [
    { from: 'user', to: 'app' }, { from: 'app', to: 'guest' },
    { from: 'guest', to: 'cpu' }, { from: 'guest', to: 'mem' }, { from: 'guest', to: 'storage' }, { from: 'guest', to: 'network' },
    { from: 'cpu', to: 'telemetry' }, { from: 'mem', to: 'telemetry' }, { from: 'storage', to: 'telemetry' }, { from: 'network', to: 'telemetry' },
    { from: 'app', to: 'telemetry', label: 'app telemetry' }, { from: 'telemetry', to: 'root' },
  ],
  sources: [sources.performance, sources.otelCollector, sources.sreMonitoring],
};

const vmwareInterviews: Record<string, InterviewVisual> = {
  'Qual é a diferença entre HA, DRS e vMotion?': {
    answer: 'vMotion é o mecanismo de migração ao vivo de uma VM entre hosts compatíveis. DRS usa informação de recursos e regras do cluster para recomendar ou automatizar placement e rebalanceamento, podendo acionar migrações. vSphere HA é um mecanismo de disponibilidade: quando um host falha, as VMs afetadas são reiniciadas em hosts sobreviventes; isso não é uma migração ao vivo.',
    diagram: vmwareSections.cluster,
  },
  'Por que snapshot não substitui backup?': {
    answer: 'Snapshot preserva um ponto de estado ligado à cadeia de discos da própria VM e é adequado para operações temporárias como manutenção e rollback controlado. Ele não fornece independência de falha do datastore, retenção externa, cópia isolada ou política de recuperação equivalente a backup. Manter snapshots por longos períodos também aumenta a cadeia de delta e pode afetar operações e desempenho.',
    diagram: {
      title: 'Snapshot chain versus independent backup',
      description: 'Snapshot permanece dependente da VM e do datastore. Backup cria uma cópia independente em outro domínio de proteção.',
      width: 960, height: 390,
      nodes: [
        { id: 'vm', label: 'Virtual Machine', x: 40, y: 140, width: 180, kind: 'workload' },
        { id: 'base', label: 'Base VMDK', x: 290, y: 70, width: 170, kind: 'data' },
        { id: 'snap', label: 'Snapshot Delta', x: 290, y: 210, width: 170, kind: 'data' },
        { id: 'ds', label: 'Same Datastore\nsame failure domain', x: 530, y: 140, width: 210, kind: 'data' },
        { id: 'backup', label: 'Independent Backup\nseparate repository', x: 790, y: 140, width: 145, height: 72, kind: 'security' },
      ],
      edges: [
        { from: 'vm', to: 'base' }, { from: 'vm', to: 'snap' }, { from: 'base', to: 'ds' }, { from: 'snap', to: 'ds' }, { from: 'ds', to: 'backup', label: 'backup copy' },
      ],
      sources: [sources.storage],
    },
  },
  'O que CPU Ready indica?': {
    answer: 'CPU Ready representa tempo em que a vCPU estava pronta para executar, mas aguardava acesso a CPU física no scheduler do ESXi. Valores elevados podem indicar contenção de CPU, excesso de vCPUs ou pressão de scheduling; por isso devem ser correlacionados com utilização do host, configuração da VM e outras métricas antes de concluir a causa.',
    diagram: vmwareSections.especialista,
  },
};

const observabilityInterviews: Record<string, InterviewVisual> = {
  'Qual é a diferença entre monitoramento e observabilidade?': {
    answer: 'Monitoramento normalmente verifica condições e indicadores conhecidos: disponibilidade, thresholds, dashboards e alertas. Observabilidade é a capacidade de investigar estados internos do sistema a partir da telemetria disponível, inclusive perguntas não previstas previamente. Na prática, monitoramento é parte de uma estratégia de observabilidade; métricas, logs, traces e contexto correlacionável permitem ir do sintoma à causa.',
    diagram: observabilitySections.fundamentos,
  },
  'O que são SLI, SLO e error budget?': {
    answer: 'SLI é uma medida quantitativa do comportamento do serviço, como disponibilidade ou latência. SLO é a meta definida para esse indicador em uma janela de tempo. Error budget é a margem de falha permitida pelo SLO e pode orientar decisões de risco, velocidade de entrega e priorização de trabalho de confiabilidade.',
    diagram: observabilitySections['sli-slo'],
  },
  'Quando usar RED e quando usar USE?': {
    answer: 'RED — Rate, Errors e Duration — é adequado para serviços orientados a requisições e ajuda a localizar impacto no caminho do utilizador. USE — Utilization, Saturation e Errors — é adequado para recursos como CPU, memória, disco, filas e interfaces. Em incidentes reais, RED pode localizar o serviço degradado e USE ajudar a explicar qual recurso está limitando esse serviço.',
    diagram: observabilitySections.especialista,
  },
};

export function getVmwareObservabilitySectionDiagram(articleSlug: string, sectionId: string) {
  if (articleSlug === 'vmware') return vmwareSections[sectionId];
  if (articleSlug === 'observabilidade') return observabilitySections[sectionId];
  return undefined;
}

export function getVmwareObservabilityInterviewVisual(articleSlug: string, question: string) {
  if (articleSlug === 'vmware') return vmwareInterviews[question];
  if (articleSlug === 'observabilidade') return observabilityInterviews[question];
  return undefined;
}
