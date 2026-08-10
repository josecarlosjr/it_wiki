import type { DiagramSpec } from './diagrams';

const textEn: Record<string, string> = {
  'O hardware físico é abstraído pelo ESXi. Cada VM recebe hardware virtual e executa seu próprio guest OS; vCenter administra hosts e VMs sem ficar no data path normal da aplicação.': 'Physical hardware is abstracted by ESXi. Each VM receives virtual hardware and runs its own guest OS; vCenter manages hosts and VMs without sitting in the normal application data path.',
  'vMotion move uma VM em execução entre hosts; DRS decide placement e rebalanceamento; HA reage à falha de um host reiniciando VMs nos hosts sobreviventes.': 'vMotion moves a running VM between hosts; DRS decides placement and rebalancing; HA reacts to a host failure by restarting VMs on surviving hosts.',
  'A VM chega à rede física através de vNIC, port group, virtual switch e uplink. O I/O de disco percorre VMDK, datastore, stack de storage e múltiplos paths até o array.': 'A VM reaches the physical network through its vNIC, port group, virtual switch, and uplink. Disk I/O traverses the VMDK, datastore, storage stack, and multiple paths to the storage array.',
  'Uma aplicação lenta deve ser investigada por camadas: guest, VM, ESXi e infraestrutura física. CPU Ready, ballooning/swapping, storage latency e drops ajudam a localizar contenção fora do guest OS.': 'A slow application should be investigated by layers: guest, VM, ESXi, and physical infrastructure. CPU Ready, ballooning/swapping, storage latency, and drops help locate contention outside the guest OS.',
  'Um SLI mede comportamento observado. O SLO define a meta. O error budget transforma a diferença entre objetivo e realidade em um mecanismo operacional para decidir risco, alertas e ritmo de mudanças.': 'An SLI measures observed behavior. The SLO defines the target. The error budget turns the gap between target and reality into an operational mechanism for deciding risk, alerts, and the pace of change.',
  'Aplicações e infraestrutura produzem sinais; o OpenTelemetry Collector recebe, processa e exporta telemetria para um ou mais backends sem acoplar cada workload diretamente a cada fornecedor.': 'Applications and infrastructure produce signals; the OpenTelemetry Collector receives, processes, and exports telemetry to one or more backends without coupling every workload directly to every vendor.',
  'Uma investigação madura começa pelo impacto observável ao utilizador, usa RED para localizar o serviço degradado, traces para encontrar a dependência crítica e USE/infra telemetry para validar a causa física ou lógica.': 'A mature investigation starts from observable user impact, uses RED to locate the degraded service, traces to find the critical dependency, and USE/infrastructure telemetry to validate the physical or logical cause.',
  'Observability across a VMware virtualized stack': 'Observability across a VMware virtualized stack',
  'O mesmo incidente pode atravessar aplicação, guest OS, VM, hypervisor e infraestrutura. Correlacionar sinais dessas camadas evita atribuir ao guest um problema que está no scheduler, memória, storage ou rede do ESXi.': 'The same incident can cross the application, guest OS, VM, hypervisor, and infrastructure layers. Correlating signals across those layers prevents attributing to the guest a problem actually caused by ESXi scheduling, memory, storage, or networking.',
  'Snapshot permanece dependente da VM e do datastore. Backup cria uma cópia independente em outro domínio de proteção.': 'A snapshot remains dependent on the VM and datastore. A backup creates an independent copy in a separate protection domain.',
  'aplicação': 'application',
  'infraestrutura': 'infrastructure',
};

export function localizeVmwareObservabilityDiagram(spec: DiagramSpec, locale: 'pt' | 'en'): DiagramSpec {
  if (locale !== 'en') return spec;
  const translate = (value: string) => textEn[value] ?? value;
  return {
    ...spec,
    title: translate(spec.title),
    description: translate(spec.description),
    nodes: spec.nodes.map((node) => ({ ...node, label: translate(node.label) })),
    edges: spec.edges.map((edge) => ({ ...edge, label: edge.label ? translate(edge.label) : undefined })),
  };
}
