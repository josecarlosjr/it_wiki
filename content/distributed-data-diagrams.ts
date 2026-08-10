import type { DiagramNodeKind, DiagramSpec } from './diagrams';

export type DiagramLocale = 'pt' | 'en';

type BiText = [pt: string, en: string];
type BiNode = { id: string; label: BiText; x: number; y: number; width?: number; height?: number; kind?: DiagramNodeKind };
type BiEdge = { from: string; to: string; label?: BiText; animated?: boolean; bidirectional?: boolean };
type BiDiagram = { title: BiText; description: BiText; width?: number; height?: number; nodes: BiNode[]; edges: BiEdge[]; sources: { label: string; url: string }[] };

const sources = {
  kafkaDesign: { label: 'Apache Kafka — Design', url: 'https://kafka.apache.org/41/design/design/' },
  kafkaProducer: { label: 'Apache Kafka — Producer configs', url: 'https://kafka.apache.org/41/configuration/producer-configs/' },
  kafkaConsumer: { label: 'Apache Kafka — Consumer configs', url: 'https://kafka.apache.org/41/configuration/consumer-configs/' },
  redisCache: { label: 'Redis — Client-side caching', url: 'https://redis.io/docs/latest/develop/reference/client-side-caching/' },
  redisEviction: { label: 'Redis — Key eviction', url: 'https://redis.io/docs/latest/develop/reference/eviction/' },
  redisSentinel: { label: 'Redis — Sentinel', url: 'https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel/' },
  redisCluster: { label: 'Redis — Cluster specification', url: 'https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/' },
  redisPersistence: { label: 'Redis — Persistence', url: 'https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/' },
  grpcDeadline: { label: 'gRPC — Deadlines', url: 'https://grpc.io/docs/guides/deadlines/' },
  grpcRetry: { label: 'gRPC — Retry', url: 'https://grpc.io/docs/guides/retry/' },
  grpcPerformance: { label: 'gRPC — Performance best practices', url: 'https://grpc.io/docs/guides/performance/' },
  sreCascade: { label: 'Google SRE — Addressing Cascading Failures', url: 'https://sre.google/sre-book/addressing-cascading-failures/' },
  sreBest: { label: 'Google SRE — Production Services Best Practices', url: 'https://sre.google/sre-book/service-best-practices/' },
};

function resolve(spec: BiDiagram, locale: DiagramLocale): DiagramSpec {
  const pick = (value: BiText) => value[locale === 'en' ? 1 : 0];
  return {
    title: pick(spec.title),
    description: pick(spec.description),
    width: spec.width,
    height: spec.height,
    nodes: spec.nodes.map((node) => ({ ...node, label: pick(node.label) })),
    edges: spec.edges.map((edge) => ({ ...edge, label: edge.label ? pick(edge.label) : undefined })),
    sources: spec.sources,
  };
}

const kafka: Record<string, BiDiagram> = {
  fundamentos: {
    title: ['Kafka: topic, partitions e offsets', 'Kafka: topic, partitions, and offsets'],
    description: ['Um topic é dividido em logs ordenados independentes. A chave pode determinar a partition; o offset identifica a posição do evento dentro daquela partition, portanto a ordem global entre partitions não é garantida.', 'A topic is split into independent ordered logs. A key can determine the partition; an offset identifies the record position within that partition, so global ordering across partitions is not guaranteed.'],
    width: 1100, height: 460,
    nodes: [
      { id: 'producer', label: ['Producer\nkey + event', 'Producer\nkey + event'], x: 30, y: 175, width: 180, kind: 'client' },
      { id: 'router', label: ['Partitioner\nkey → partition', 'Partitioner\nkey → partition'], x: 260, y: 175, width: 190, kind: 'decision' },
      { id: 'p0', label: ['Partition 0\noffset 0 → 1 → 2 → 3', 'Partition 0\noffset 0 → 1 → 2 → 3'], x: 520, y: 55, width: 245, kind: 'data' },
      { id: 'p1', label: ['Partition 1\noffset 0 → 1 → 2', 'Partition 1\noffset 0 → 1 → 2'], x: 520, y: 175, width: 245, kind: 'data' },
      { id: 'p2', label: ['Partition 2\noffset 0 → 1 → 2 → 3', 'Partition 2\noffset 0 → 1 → 2 → 3'], x: 520, y: 295, width: 245, kind: 'data' },
      { id: 'consumer', label: ['Consumers\nleem por offset', 'Consumers\nread by offset'], x: 850, y: 175, width: 190, kind: 'workload' },
    ],
    edges: [
      { from: 'producer', to: 'router', label: ['publish', 'publish'], animated: true },
      { from: 'router', to: 'p0' }, { from: 'router', to: 'p1' }, { from: 'router', to: 'p2' },
      { from: 'p0', to: 'consumer' }, { from: 'p1', to: 'consumer' }, { from: 'p2', to: 'consumer' },
    ],
    sources: [sources.kafkaDesign],
  },
  consumo: {
    title: ['Kafka consumer group: paralelismo limitado por partitions', 'Kafka consumer group: parallelism is bounded by partitions'],
    description: ['Dentro de um consumer group, cada partition ativa é atribuída a apenas um consumer por vez. O número de partitions define o teto de paralelismo de leitura daquele grupo; consumidores excedentes ficam sem partition.', 'Within a consumer group, each active partition is assigned to only one consumer at a time. Partition count therefore caps the read parallelism of that group; excess consumers remain idle.'],
    width: 1120, height: 500,
    nodes: [
      { id: 'p0', label: ['P0', 'P0'], x: 60, y: 65, width: 120, kind: 'data' },
      { id: 'p1', label: ['P1', 'P1'], x: 60, y: 175, width: 120, kind: 'data' },
      { id: 'p2', label: ['P2', 'P2'], x: 60, y: 285, width: 120, kind: 'data' },
      { id: 'c1', label: ['Consumer A\nGroup orders', 'Consumer A\nGroup orders'], x: 330, y: 65, width: 210, kind: 'workload' },
      { id: 'c2', label: ['Consumer B\nGroup orders', 'Consumer B\nGroup orders'], x: 330, y: 175, width: 210, kind: 'workload' },
      { id: 'c3', label: ['Consumer C\nGroup orders', 'Consumer C\nGroup orders'], x: 330, y: 285, width: 210, kind: 'workload' },
      { id: 'idle', label: ['Consumer D\nsem partition', 'Consumer D\nno partition'], x: 330, y: 395, width: 210, kind: 'control' },
      { id: 'offsets', label: ['Committed offsets\nprogresso do grupo', 'Committed offsets\ngroup progress'], x: 690, y: 145, width: 230, kind: 'data' },
      { id: 'rebalance', label: ['Rebalance\nredistribui assignments', 'Rebalance\nredistributes assignments'], x: 690, y: 285, width: 230, kind: 'decision' },
    ],
    edges: [
      { from: 'p0', to: 'c1' }, { from: 'p1', to: 'c2' }, { from: 'p2', to: 'c3' },
      { from: 'c1', to: 'offsets' }, { from: 'c2', to: 'offsets' }, { from: 'c3', to: 'offsets' },
      { from: 'rebalance', to: 'c1', label: ['assignment', 'assignment'] }, { from: 'rebalance', to: 'c2' }, { from: 'rebalance', to: 'c3' },
    ],
    sources: [sources.kafkaDesign, sources.kafkaConsumer],
  },
  confiabilidade: {
    title: ['Kafka durability: leader, ISR, acks e min.insync.replicas', 'Kafka durability: leader, ISR, acks, and min.insync.replicas'],
    description: ['O producer escreve no leader. Com acks=all, a resposta depende das replicas in-sync exigidas pelo cluster; min.insync.replicas pode rejeitar a escrita quando o conjunto saudável é pequeno demais, preferindo falhar a aceitar uma escrita com durabilidade insuficiente.', 'The producer writes to the leader. With acks=all, acknowledgement depends on the required in-sync replicas; min.insync.replicas can reject a write when the healthy set is too small, preferring failure over accepting a write with insufficient durability.'],
    width: 1120, height: 500,
    nodes: [
      { id: 'prod', label: ['Producer\nacks=all', 'Producer\nacks=all'], x: 30, y: 200, width: 180, kind: 'client' },
      { id: 'leader', label: ['Broker 1\nPartition leader', 'Broker 1\nPartition leader'], x: 310, y: 200, width: 205, kind: 'data' },
      { id: 'r1', label: ['Broker 2\nISR replica', 'Broker 2\nISR replica'], x: 650, y: 95, width: 200, kind: 'data' },
      { id: 'r2', label: ['Broker 3\nISR replica', 'Broker 3\nISR replica'], x: 650, y: 305, width: 200, kind: 'data' },
      { id: 'ack', label: ['ACK\napós condição de durabilidade', 'ACK\nafter durability condition'], x: 900, y: 200, width: 190, kind: 'decision' },
    ],
    edges: [
      { from: 'prod', to: 'leader', label: ['produce', 'produce'], animated: true },
      { from: 'leader', to: 'r1', label: ['replicate', 'replicate'], animated: true }, { from: 'leader', to: 'r2', label: ['replicate', 'replicate'], animated: true },
      { from: 'r1', to: 'ack' }, { from: 'r2', to: 'ack' }, { from: 'ack', to: 'prod', label: ['success / error', 'success / error'] },
    ],
    sources: [sources.kafkaDesign, sources.kafkaProducer],
  },
  especialista: {
    title: ['Kafka em escala: batching, throughput, lag e hot partitions', 'Kafka at scale: batching, throughput, lag, and hot partitions'],
    description: ['Throughput cresce com batching, compressão e paralelismo por partitions, mas a distribuição de chaves precisa ser uniforme. Quando produção supera consumo, consumer lag cresce; uma hot partition concentra CPU, disco e rede mesmo quando o cluster total possui capacidade livre.', 'Throughput improves with batching, compression, and partition parallelism, but keys must distribute evenly. When production exceeds consumption, consumer lag grows; a hot partition can concentrate CPU, disk, and network load even while the cluster still has spare aggregate capacity.'],
    width: 1150, height: 520,
    nodes: [
      { id: 'events', label: ['Eventos\npequenos', 'Small\nevents'], x: 25, y: 190, width: 140, kind: 'client' },
      { id: 'batch', label: ['Batch + compression\nmenos overhead', 'Batch + compression\nless overhead'], x: 220, y: 190, width: 210, kind: 'control' },
      { id: 'balanced', label: ['P0 / P1 / P2\ndistribuição uniforme', 'P0 / P1 / P2\neven distribution'], x: 500, y: 85, width: 220, kind: 'data' },
      { id: 'hot', label: ['P3 HOT\nchave dominante', 'P3 HOT\ndominant key'], x: 500, y: 315, width: 220, kind: 'security' },
      { id: 'consumers', label: ['Consumer Group\nprocessing rate', 'Consumer Group\nprocessing rate'], x: 810, y: 85, width: 210, kind: 'workload' },
      { id: 'lag', label: ['Consumer Lag\nqueueing no log', 'Consumer Lag\nqueueing in the log'], x: 810, y: 315, width: 210, kind: 'decision' },
    ],
    edges: [
      { from: 'events', to: 'batch' }, { from: 'batch', to: 'balanced' }, { from: 'batch', to: 'hot' },
      { from: 'balanced', to: 'consumers', label: ['parallel read', 'parallel read'] }, { from: 'hot', to: 'lag', label: ['bottleneck', 'bottleneck'] },
      { from: 'consumers', to: 'lag', label: ['se consumo < produção', 'if consume < produce'] },
    ],
    sources: [sources.kafkaDesign, sources.kafkaProducer, sources.kafkaConsumer],
  },
};

const redis: Record<string, BiDiagram> = {
  fundamentos: {
    title: ['Redis: acesso em memória, estruturas e TTL', 'Redis: in-memory access, data structures, and TTL'],
    description: ['A aplicação acessa chaves em memória com estruturas adequadas ao padrão de acesso. TTL limita a vida útil de dados temporários; operações custosas ou valores muito grandes ainda podem aumentar latência porque compartilham o caminho de execução do servidor.', 'The application accesses in-memory keys through data structures suited to the access pattern. TTL bounds temporary data lifetime; expensive operations or very large values can still increase latency because they share the server execution path.'],
    width: 1040, height: 450,
    nodes: [
      { id: 'app', label: ['Application', 'Application'], x: 35, y: 175, width: 170, kind: 'client' },
      { id: 'redis', label: ['Redis\nin-memory dataset', 'Redis\nin-memory dataset'], x: 300, y: 175, width: 210, kind: 'data' },
      { id: 'string', label: ['String / Counter', 'String / Counter'], x: 620, y: 45, width: 180, kind: 'data' },
      { id: 'hash', label: ['Hash', 'Hash'], x: 620, y: 145, width: 180, kind: 'data' },
      { id: 'set', label: ['Set / Sorted Set', 'Set / Sorted Set'], x: 620, y: 245, width: 180, kind: 'data' },
      { id: 'ttl', label: ['TTL / Expiration', 'TTL / Expiration'], x: 620, y: 345, width: 180, kind: 'decision' },
      { id: 'mem', label: ['Memory budget\nmaxmemory', 'Memory budget\nmaxmemory'], x: 850, y: 175, width: 170, kind: 'control' },
    ],
    edges: [
      { from: 'app', to: 'redis', label: ['commands', 'commands'], animated: true },
      { from: 'redis', to: 'string' }, { from: 'redis', to: 'hash' }, { from: 'redis', to: 'set' }, { from: 'redis', to: 'ttl' }, { from: 'redis', to: 'mem' },
    ],
    sources: [sources.redisEviction],
  },
  cache: {
    title: ['Cache-aside: hit, miss, source of truth e invalidação', 'Cache-aside: hit, miss, source of truth, and invalidation'],
    description: ['No cache-aside, a aplicação consulta Redis primeiro. Um hit evita acesso ao banco; um miss consulta a fonte de verdade e popula o cache. TTL, invalidação e proteção contra stampede definem o equilíbrio entre latência, frescor e carga no backend.', 'With cache-aside, the application checks Redis first. A hit avoids the database; a miss loads from the source of truth and populates the cache. TTL, invalidation, and stampede protection balance latency, freshness, and backend load.'],
    width: 1120, height: 500,
    nodes: [
      { id: 'client', label: ['Client', 'Client'], x: 25, y: 200, width: 140, kind: 'client' },
      { id: 'app', label: ['API / Service', 'API / Service'], x: 220, y: 200, width: 175, kind: 'workload' },
      { id: 'cache', label: ['Redis Cache\nTTL + eviction', 'Redis Cache\nTTL + eviction'], x: 505, y: 90, width: 210, kind: 'data' },
      { id: 'db', label: ['Source of Truth\nDatabase', 'Source of Truth\nDatabase'], x: 505, y: 310, width: 210, kind: 'data' },
      { id: 'hit', label: ['HIT\nlow latency', 'HIT\nlow latency'], x: 820, y: 90, width: 170, kind: 'decision' },
      { id: 'fill', label: ['MISS → load → fill\nprotect with single-flight', 'MISS → load → fill\nprotect with single-flight'], x: 800, y: 310, width: 220, kind: 'decision' },
    ],
    edges: [
      { from: 'client', to: 'app' }, { from: 'app', to: 'cache', label: ['GET key', 'GET key'] },
      { from: 'cache', to: 'hit', label: ['hit', 'hit'] }, { from: 'cache', to: 'db', label: ['miss', 'miss'] },
      { from: 'db', to: 'fill', label: ['read authoritative data', 'read authoritative data'] }, { from: 'fill', to: 'cache', label: ['SET + TTL', 'SET + TTL'] },
    ],
    sources: [sources.redisCache, sources.redisEviction, sources.sreCascade],
  },
  'alta-disponibilidade': {
    title: ['Redis HA: Sentinel versus Redis Cluster', 'Redis HA: Sentinel versus Redis Cluster'],
    description: ['Sentinel coordena monitoramento e failover de uma topologia primary/replicas sem sharding. Redis Cluster adiciona sharding por hash slots e failover por shard, distribuindo capacidade e dataset entre múltiplos primaries.', 'Sentinel coordinates monitoring and failover for a primary/replica topology without sharding. Redis Cluster adds hash-slot sharding and per-shard failover, distributing capacity and dataset across multiple primaries.'],
    width: 1160, height: 520,
    nodes: [
      { id: 'sentinel', label: ['Sentinel quorum\nmonitor + failover', 'Sentinel quorum\nmonitor + failover'], x: 90, y: 35, width: 210, kind: 'control' },
      { id: 'primary', label: ['Primary', 'Primary'], x: 90, y: 185, width: 170, kind: 'data' },
      { id: 'replica', label: ['Replica\npromotable', 'Replica\npromotable'], x: 90, y: 325, width: 170, kind: 'data' },
      { id: 'cluster', label: ['Redis Cluster\n16384 hash slots', 'Redis Cluster\n16384 hash slots'], x: 525, y: 35, width: 230, kind: 'control' },
      { id: 'shard1', label: ['Shard A\nPrimary + Replica', 'Shard A\nPrimary + Replica'], x: 425, y: 205, width: 205, kind: 'data' },
      { id: 'shard2', label: ['Shard B\nPrimary + Replica', 'Shard B\nPrimary + Replica'], x: 700, y: 205, width: 205, kind: 'data' },
      { id: 'client', label: ['Cluster-aware client\nslot routing', 'Cluster-aware client\nslot routing'], x: 500, y: 390, width: 255, kind: 'client' },
    ],
    edges: [
      { from: 'sentinel', to: 'primary', label: ['monitor', 'monitor'] }, { from: 'primary', to: 'replica', label: ['async replication', 'async replication'] },
      { from: 'replica', to: 'primary', label: ['promote on failover', 'promote on failover'] },
      { from: 'cluster', to: 'shard1' }, { from: 'cluster', to: 'shard2' }, { from: 'client', to: 'shard1' }, { from: 'client', to: 'shard2' },
    ],
    sources: [sources.redisSentinel, sources.redisCluster, sources.redisPersistence],
  },
  especialista: {
    title: ['Redis em escala: hot keys, eviction, latency e failover', 'Redis at scale: hot keys, eviction, latency, and failover'],
    description: ['Escala exige observar não apenas memória total, mas distribuição de tráfego. Hot keys e comandos caros concentram trabalho; eviction pode transformar pressão de memória em misses; failover pode expor replication lag. Pipelining reduz round trips, mas não remove custo do trabalho executado no servidor.', 'Scaling requires observing traffic distribution, not just total memory. Hot keys and expensive commands concentrate work; eviction can turn memory pressure into misses; failover can expose replication lag. Pipelining reduces round trips but does not remove the cost of work executed by the server.'],
    width: 1140, height: 510,
    nodes: [
      { id: 'clients', label: ['Many Clients\nQPS', 'Many Clients\nQPS'], x: 30, y: 205, width: 160, kind: 'client' },
      { id: 'pipeline', label: ['Pipelining\nfewer RTTs', 'Pipelining\nfewer RTTs'], x: 245, y: 205, width: 180, kind: 'control' },
      { id: 'normal', label: ['Normal keys\neven load', 'Normal keys\neven load'], x: 520, y: 90, width: 190, kind: 'data' },
      { id: 'hot', label: ['HOT KEY\ntraffic concentration', 'HOT KEY\ntraffic concentration'], x: 520, y: 300, width: 190, kind: 'security' },
      { id: 'memory', label: ['maxmemory\neviction / misses', 'maxmemory\neviction / misses'], x: 810, y: 90, width: 200, kind: 'decision' },
      { id: 'failover', label: ['Replica lag\nfailover window', 'Replica lag\nfailover window'], x: 810, y: 300, width: 200, kind: 'decision' },
    ],
    edges: [
      { from: 'clients', to: 'pipeline' }, { from: 'pipeline', to: 'normal' }, { from: 'pipeline', to: 'hot' },
      { from: 'normal', to: 'memory' }, { from: 'hot', to: 'failover', label: ['saturation risk', 'saturation risk'] },
    ],
    sources: [sources.redisEviction, sources.redisCluster, sources.redisPersistence],
  },
};

const distributed: Record<string, BiDiagram> = {
  fundamentos: {
    title: ['Sistemas distribuídos: request path, API, cache, database e messaging', 'Distributed systems: request path, API, cache, database, and messaging'],
    description: ['O melhor mapa mental inicial é o caminho real de uma requisição. A API síncrona está no latency budget do utilizador; cache reduz chamadas caras; database mantém estado autoritativo; messaging desloca trabalho que não precisa bloquear a resposta. Cada fronteira remota pode falhar independentemente.', 'The most useful initial mental model is the real request path. Synchronous APIs sit inside the user latency budget; caching avoids expensive calls; the database holds authoritative state; messaging moves work that does not need to block the response. Every remote boundary can fail independently.'],
    width: 1180, height: 520,
    nodes: [
      { id: 'client', label: ['Client\nrequest', 'Client\nrequest'], x: 25, y: 205, width: 150, kind: 'client' },
      { id: 'gateway', label: ['API Gateway / LB\nrouting + limits', 'API Gateway / LB\nrouting + limits'], x: 220, y: 205, width: 205, kind: 'network' },
      { id: 'service', label: ['Service\nbusiness logic', 'Service\nbusiness logic'], x: 480, y: 205, width: 190, kind: 'workload' },
      { id: 'cache', label: ['Cache\nfast path', 'Cache\nfast path'], x: 760, y: 70, width: 175, kind: 'data' },
      { id: 'db', label: ['Database\nsource of truth', 'Database\nsource of truth'], x: 760, y: 205, width: 175, kind: 'data' },
      { id: 'queue', label: ['Message Broker\nbuffer + decouple', 'Message Broker\nbuffer + decouple'], x: 760, y: 355, width: 200, kind: 'data' },
      { id: 'worker', label: ['Async Worker\nindependent rate', 'Async Worker\nindependent rate'], x: 1000, y: 355, width: 160, kind: 'workload' },
    ],
    edges: [
      { from: 'client', to: 'gateway', label: ['HTTP / gRPC', 'HTTP / gRPC'], animated: true }, { from: 'gateway', to: 'service', label: ['deadline', 'deadline'] },
      { from: 'service', to: 'cache', label: ['read fast path', 'read fast path'] }, { from: 'service', to: 'db', label: ['read / write', 'read / write'] },
      { from: 'service', to: 'queue', label: ['async event', 'async event'] }, { from: 'queue', to: 'worker', label: ['backpressure boundary', 'backpressure boundary'], animated: true },
    ],
    sources: [sources.grpcDeadline, sources.grpcPerformance, sources.sreCascade],
  },
  consistencia: {
    title: ['Consistência, cache e replicação: quem é a fonte de verdade?', 'Consistency, caching, and replication: what is the source of truth?'],
    description: ['Escala cria cópias: caches, read replicas e shards. O desenho precisa declarar onde a escrita é autoritativa, quanto stale data é aceitável e como invalidação/replicação convergem. Cache não deve virar uma dependência cuja falha derruba a fonte de verdade.', 'Scale creates copies: caches, read replicas, and shards. The design must define where writes are authoritative, how much staleness is acceptable, and how invalidation/replication converge. A cache should not become a dependency whose failure takes down the source of truth.'],
    width: 1140, height: 510,
    nodes: [
      { id: 'service', label: ['Service', 'Service'], x: 30, y: 210, width: 170, kind: 'workload' },
      { id: 'cache', label: ['Cache\neventually fresh', 'Cache\neventually fresh'], x: 310, y: 75, width: 190, kind: 'data' },
      { id: 'leader', label: ['Primary / Leader\nauthoritative writes', 'Primary / Leader\nauthoritative writes'], x: 310, y: 235, width: 210, kind: 'data' },
      { id: 'replica1', label: ['Read Replica A\nreplication lag', 'Read Replica A\nreplication lag'], x: 680, y: 140, width: 205, kind: 'data' },
      { id: 'replica2', label: ['Read Replica B\nreplication lag', 'Read Replica B\nreplication lag'], x: 680, y: 325, width: 205, kind: 'data' },
      { id: 'policy', label: ['Consistency policy\nstrong / eventual / session', 'Consistency policy\nstrong / eventual / session'], x: 910, y: 235, width: 205, kind: 'decision' },
    ],
    edges: [
      { from: 'service', to: 'cache', label: ['hit / invalidate', 'hit / invalidate'] }, { from: 'service', to: 'leader', label: ['authoritative write', 'authoritative write'] },
      { from: 'leader', to: 'replica1', label: ['replicate', 'replicate'] }, { from: 'leader', to: 'replica2', label: ['replicate', 'replicate'] },
      { from: 'replica1', to: 'policy' }, { from: 'replica2', to: 'policy' }, { from: 'cache', to: 'policy', label: ['staleness', 'staleness'] },
    ],
    sources: [sources.sreCascade],
  },
  consenso: {
    title: ['Escala horizontal: load balancing, sharding, replicas e quorum', 'Horizontal scale: load balancing, sharding, replicas, and quorum'],
    description: ['Escala de compute e escala de dados são problemas distintos. Load balancers distribuem requests entre réplicas de serviço; sharding distribui ownership de dados; replicação protege cada shard; quorum/consenso coordenam mudanças que precisam de ordem e segurança.', 'Compute scaling and data scaling are different problems. Load balancers spread requests across service replicas; sharding distributes data ownership; replication protects each shard; quorum/consensus coordinate changes that require ordering and safety.'],
    width: 1180, height: 530,
    nodes: [
      { id: 'lb', label: ['Load Balancer', 'Load Balancer'], x: 45, y: 210, width: 170, kind: 'network' },
      { id: 's1', label: ['Service A', 'Service A'], x: 300, y: 90, width: 150, kind: 'workload' },
      { id: 's2', label: ['Service B', 'Service B'], x: 300, y: 210, width: 150, kind: 'workload' },
      { id: 's3', label: ['Service C', 'Service C'], x: 300, y: 330, width: 150, kind: 'workload' },
      { id: 'router', label: ['Shard Router\npartition key', 'Shard Router\npartition key'], x: 540, y: 210, width: 185, kind: 'decision' },
      { id: 'a', label: ['Shard A\nleader + replicas', 'Shard A\nleader + replicas'], x: 820, y: 90, width: 210, kind: 'data' },
      { id: 'b', label: ['Shard B\nleader + replicas', 'Shard B\nleader + replicas'], x: 820, y: 210, width: 210, kind: 'data' },
      { id: 'c', label: ['Shard C\nleader + replicas', 'Shard C\nleader + replicas'], x: 820, y: 330, width: 210, kind: 'data' },
      { id: 'quorum', label: ['Quorum / Consensus\nmetadata + leadership', 'Quorum / Consensus\nmetadata + leadership'], x: 890, y: 450, width: 220, kind: 'control' },
    ],
    edges: [
      { from: 'lb', to: 's1' }, { from: 'lb', to: 's2' }, { from: 'lb', to: 's3' },
      { from: 's1', to: 'router' }, { from: 's2', to: 'router' }, { from: 's3', to: 'router' },
      { from: 'router', to: 'a' }, { from: 'router', to: 'b' }, { from: 'router', to: 'c' },
      { from: 'quorum', to: 'a' }, { from: 'quorum', to: 'b' }, { from: 'quorum', to: 'c' },
    ],
    sources: [sources.sreBest],
  },
  especialista: {
    title: ['Failure amplification: latency, queueing, retries e cascading failure', 'Failure amplification: latency, queueing, retries, and cascading failure'],
    description: ['Quando uma dependência fica lenta, requests permanecem in-flight, filas crescem e throughput útil cai. Retries sem limites multiplicam a carga e podem transformar uma falha parcial em cascata. Deadlines, exponential backoff com jitter, retry budgets, circuit breakers, load shedding e backpressure limitam a amplificação.', 'When a dependency slows down, requests stay in flight, queues grow, and useful throughput falls. Unbounded retries multiply load and can turn a partial failure into a cascade. Deadlines, exponential backoff with jitter, retry budgets, circuit breakers, load shedding, and backpressure limit amplification.'],
    width: 1180, height: 540,
    nodes: [
      { id: 'traffic', label: ['Traffic\nQPS', 'Traffic\nQPS'], x: 25, y: 210, width: 145, kind: 'client' },
      { id: 'service', label: ['Service\ncapacity', 'Service\ncapacity'], x: 225, y: 210, width: 170, kind: 'workload' },
      { id: 'slow', label: ['Slow dependency\nhigh tail latency', 'Slow dependency\nhigh tail latency'], x: 475, y: 210, width: 205, kind: 'security' },
      { id: 'queue', label: ['More in-flight + queue\nsaturation', 'More in-flight + queue\nsaturation'], x: 760, y: 85, width: 220, kind: 'decision' },
      { id: 'retry', label: ['Retries\nload amplification', 'Retries\nload amplification'], x: 760, y: 335, width: 220, kind: 'security' },
      { id: 'controls', label: ['Controls\ndeadline · backoff+jitter\nload shed · circuit breaker\nbackpressure · idempotency', 'Controls\ndeadline · backoff+jitter\nload shed · circuit breaker\nbackpressure · idempotency'], x: 1010, y: 185, width: 160, height: 130, kind: 'control' },
    ],
    edges: [
      { from: 'traffic', to: 'service' }, { from: 'service', to: 'slow' }, { from: 'slow', to: 'queue', label: ['latency ↑', 'latency ↑'] },
      { from: 'queue', to: 'retry', label: ['timeouts / errors', 'timeouts / errors'] }, { from: 'retry', to: 'service', label: ['extra load', 'extra load'], animated: true },
      { from: 'queue', to: 'controls' }, { from: 'retry', to: 'controls' },
    ],
    sources: [sources.grpcDeadline, sources.grpcRetry, sources.sreCascade, sources.sreBest],
  },
};

export function getDistributedDataSectionDiagram(articleSlug: string, sectionId: string, locale: DiagramLocale): DiagramSpec | undefined {
  const catalog = articleSlug === 'kafka' ? kafka : articleSlug === 'redis' ? redis : articleSlug === 'sistemas-distribuidos' ? distributed : undefined;
  const spec = catalog?.[sectionId];
  return spec ? resolve(spec, locale) : undefined;
}

export const distributedDataReferenceDiagrams = {
  distributedArchitecture: (locale: DiagramLocale) => resolve(distributed.fundamentos, locale),
  distributedFailure: (locale: DiagramLocale) => resolve(distributed.especialista, locale),
  kafkaScale: (locale: DiagramLocale) => resolve(kafka.especialista, locale),
  redisCache: (locale: DiagramLocale) => resolve(redis.cache, locale),
};
