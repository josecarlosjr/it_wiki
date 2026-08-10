'use client';

import { TopicDiagram } from './topic-diagram';
import { distributedDataReferenceDiagrams } from '@/content/distributed-data-diagrams';
import { useLanguage } from './language-provider';

type Props = { articleSlug: string };

type Row = [string, string, string];

const distributedRowsPt: Row[] = [
  ['API síncrona', 'HTTP/gRPC request-response', 'Use quando o chamador precisa do resultado agora. Defina deadline/timeout, limite concorrência e mantenha o caminho crítico curto.'],
  ['Messaging assíncrono', 'Queue / stream / event bus', 'Use para desacoplar ritmos, absorver bursts e mover trabalho fora do latency budget do utilizador. Exige idempotência, retry e observação de backlog/lag.'],
  ['Cache', 'Cache-aside / read-through / client cache', 'Reduz latência e carga no backend, mas cria staleness, invalidação, eviction e cold-start. Cache não deve esconder incapacidade estrutural sem uma estratégia de falha.'],
  ['Database', 'Source of truth / replicated state', 'É onde consistência, durabilidade, sharding, índices e transações precisam ser tratados explicitamente. Replicas criam lag e escolhas de leitura.'],
];
const distributedRowsEn: Row[] = [
  ['Synchronous API', 'HTTP/gRPC request-response', 'Use it when the caller needs the result now. Set deadlines/timeouts, bound concurrency, and keep the critical path short.'],
  ['Asynchronous messaging', 'Queue / stream / event bus', 'Use it to decouple rates, absorb bursts, and move work outside the user latency budget. It requires idempotency, retry, and backlog/lag observability.'],
  ['Cache', 'Cache-aside / read-through / client cache', 'Reduces latency and backend load but introduces staleness, invalidation, eviction, and cold-start behavior. A cache should not hide structural capacity problems without a failure strategy.'],
  ['Database', 'Source of truth / replicated state', 'This is where consistency, durability, sharding, indexes, and transactions must be explicit. Replicas introduce lag and read-consistency choices.'],
];

const performancePt: Row[] = [
  ['Latency', 'Tempo de uma operação', 'Observe distribuição e percentis, especialmente P95/P99. Média pode esconder uma cauda lenta que esgota threads, sockets ou pools.'],
  ['Throughput', 'Trabalho concluído por unidade de tempo', 'QPS, mensagens/s ou MB/s. Aumentar throughput normalmente depende de paralelismo, batching, particionamento e capacidade suficiente.'],
  ['Concurrency', 'Operações simultaneamente em andamento', 'Cresce quando latency cresce para o mesmo arrival rate. Deve ser limitada para impedir resource exhaustion.'],
  ['Saturation', 'Fila ou recurso próximo do limite', 'Queue depth, CPU, connection pool, broker lag e disk utilization revelam quando o sistema deixou a região estável.'],
];
const performanceEn: Row[] = [
  ['Latency', 'Time taken by one operation', 'Inspect the distribution and percentiles, especially P95/P99. Averages can hide a slow tail that exhausts threads, sockets, or pools.'],
  ['Throughput', 'Completed work per unit of time', 'QPS, messages/s, or MB/s. Higher throughput usually requires parallelism, batching, partitioning, and sufficient capacity.'],
  ['Concurrency', 'Operations simultaneously in flight', 'For the same arrival rate, concurrency rises when latency rises. It must be bounded to avoid resource exhaustion.'],
  ['Saturation', 'Queue or resource near its limit', 'Queue depth, CPU, connection pools, broker lag, and disk utilization show when the system has left its stable operating region.'],
];

const failurePt = [
  ['Timeout / deadline', 'Limita quanto tempo e recurso uma chamada remota pode consumir. Deadline deve considerar o budget end-to-end, não apenas uma dependência isolada.'],
  ['Retry + exponential backoff + jitter', 'Recupera falhas transitórias sem sincronizar milhares de clientes. Retry precisa de limite, observabilidade e operação idempotente.'],
  ['Circuit breaker', 'Interrompe chamadas repetidas para uma dependência degradada e permite recuperação controlada.'],
  ['Backpressure', 'Faz produtores desacelerarem, bloquearem ou rejeitarem trabalho quando consumidores não acompanham.'],
  ['Load shedding', 'Descarta trabalho cedo e barato quando a capacidade útil foi atingida, evitando filas infinitas e cascading failure.'],
  ['Bulkhead', 'Separa pools de threads, conexões ou recursos para impedir que uma dependência consuma toda a capacidade do serviço.'],
];
const failureEn = [
  ['Timeout / deadline', 'Bounds how long and how many resources a remote call can consume. A deadline should respect the end-to-end budget, not only one isolated dependency.'],
  ['Retry + exponential backoff + jitter', 'Recovers transient failures without synchronizing thousands of clients. Retries need limits, observability, and idempotent operations.'],
  ['Circuit breaker', 'Stops repeated calls to a degraded dependency and allows controlled recovery.'],
  ['Backpressure', 'Forces producers to slow, block, or reject work when consumers cannot keep up.'],
  ['Load shedding', 'Drops work early and cheaply once useful capacity is reached, preventing unbounded queues and cascading failure.'],
  ['Bulkhead', 'Separates thread, connection, or resource pools so one dependency cannot consume the service’s entire capacity.'],
];

const kafkaRowsPt: Row[] = [
  ['Partition', 'Unidade de ordering e paralelismo', 'A ordem existe dentro da partition. A partition key determina distribuição; uma escolha ruim cria hot partitions.'],
  ['Consumer Group', 'Paralelismo de leitura', 'Cada partition é atribuída a um consumer do grupo por vez. Mais consumers que partitions não aumentam paralelismo.'],
  ['Replication / ISR', 'Tolerância a falha de broker', 'Leader recebe escritas e replicas in-sync acompanham. Replication factor, acks e min.insync.replicas precisam ser desenhados juntos.'],
  ['Batching / compression', 'Eficiência de rede e disco', 'Aumentam throughput ao amortizar overhead, normalmente trocando alguma latência de espera por eficiência.'],
  ['Consumer lag', 'Backlog observável', 'Lag precisa ser interpretado junto com produce rate e consume rate. Lag estável pode ser normal; lag crescente indica incapacidade de acompanhar.'],
  ['Idempotence / transactions', 'Semântica de retry', 'Idempotent producer reduz duplicação causada por retry. Exactly-once do Kafka tem escopo e não torna side effects externos magicamente exactly-once.'],
];
const kafkaRowsEn: Row[] = [
  ['Partition', 'Unit of ordering and parallelism', 'Ordering exists within a partition. The partition key drives distribution; a poor choice creates hot partitions.'],
  ['Consumer Group', 'Read parallelism', 'Each partition is assigned to one consumer in the group at a time. More consumers than partitions do not increase parallelism.'],
  ['Replication / ISR', 'Broker-failure tolerance', 'The leader accepts writes and in-sync replicas follow it. Replication factor, acks, and min.insync.replicas must be designed together.'],
  ['Batching / compression', 'Network and disk efficiency', 'They improve throughput by amortizing overhead, typically trading a small amount of waiting latency for efficiency.'],
  ['Consumer lag', 'Observable backlog', 'Lag must be interpreted together with produce and consume rates. Stable lag can be normal; growing lag means consumers are falling behind.'],
  ['Idempotence / transactions', 'Retry semantics', 'An idempotent producer reduces duplicates caused by retry. Kafka exactly-once has a scope and does not make external side effects magically exactly-once.'],
];

const redisRowsPt: Row[] = [
  ['Cache-aside', 'Aplicação controla miss/fill', 'Simples e comum. O desafio real é invalidação, TTL, stampede e comportamento quando Redis está indisponível.'],
  ['TTL + jitter', 'Limite de staleness e dispersão de expiração', 'Jitter evita que milhares de chaves expirem no mesmo segundo e descarreguem um pico no database.'],
  ['Eviction', 'Comportamento sob maxmemory', 'A política escolhida determina quais chaves saem. Eviction elevada aumenta miss rate e pode amplificar carga no backend.'],
  ['Pipelining', 'Menos round trips', 'Agrupa comandos no transporte e melhora throughput quando RTT é relevante, sem eliminar o custo de executar comandos no Redis.'],
  ['Sentinel', 'HA sem sharding', 'Monitora primary/replicas e coordena failover. Não distribui o dataset entre shards.'],
  ['Redis Cluster', 'Sharding + HA por shard', 'Distribui hash slots entre primaries e replicas. O cliente precisa lidar com routing/redirection e hot slots/keys.'],
];
const redisRowsEn: Row[] = [
  ['Cache-aside', 'Application controls miss/fill', 'Simple and common. The real challenges are invalidation, TTL, stampede, and behavior when Redis is unavailable.'],
  ['TTL + jitter', 'Staleness bound and expiry dispersion', 'Jitter prevents thousands of keys from expiring in the same second and dumping a burst onto the database.'],
  ['Eviction', 'Behavior under maxmemory', 'The selected policy determines which keys are removed. Heavy eviction increases miss rate and can amplify backend load.'],
  ['Pipelining', 'Fewer round trips', 'Batches transport operations and improves throughput when RTT matters, without removing the cost of executing commands in Redis.'],
  ['Sentinel', 'HA without sharding', 'Monitors primary/replicas and coordinates failover. It does not distribute the dataset across shards.'],
  ['Redis Cluster', 'Sharding + per-shard HA', 'Distributes hash slots among primaries and replicas. Clients must handle routing/redirection and hot slots/keys.'],
];

function Table({ rows }: { rows: Row[] }) {
  return <div className="table-wrap"><table className="reference-table"><thead><tr><th>Concept</th><th>Role</th><th>Design impact</th></tr></thead><tbody>{rows.map(([a,b,c]) => <tr key={a}><td><strong>{a}</strong></td><td>{b}</td><td>{c}</td></tr>)}</tbody></table></div>;
}

function FailureGrid({ rows }: { rows: string[][] }) {
  return <div className="reference-grid">{rows.map(([title, text]) => <article className="reference-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>;
}

export function DistributedDataReference({ articleSlug }: Props) {
  const { locale, t } = useLanguage();

  if (articleSlug === 'sistemas-distribuidos') {
    const architecture = distributedDataReferenceDiagrams.distributedArchitecture(locale);
    const failure = distributedDataReferenceDiagrams.distributedFailure(locale);
    return <>
      <section className="article-section" id="distributed-reference">
        <h2>{t('Arquitetura distribuída escalável — fundamentos e trade-offs', 'Scalable distributed architecture — fundamentals and trade-offs')}</h2>
        <p className="section-summary">{t('O objetivo é conectar APIs, messaging, caching e persistence ao mesmo modelo operacional: latency budget, throughput, capacity, consistency e failure containment.', 'The goal is to connect APIs, messaging, caching, and persistence under one operational model: latency budget, throughput, capacity, consistency, and failure containment.')}</p>
        <TopicDiagram spec={architecture} />
        <h3>{t('Síncrono, assíncrono, cache e source of truth', 'Synchronous, asynchronous, cache, and source of truth')}</h3>
        <Table rows={locale === 'en' ? distributedRowsEn : distributedRowsPt} />
      </section>

      <section className="article-section" id="distributed-performance">
        <h2>{t('Latency, throughput, concurrency e saturation', 'Latency, throughput, concurrency, and saturation')}</h2>
        <Table rows={locale === 'en' ? performanceEn : performancePt} />
        <div className="reference-note"><strong>Little&apos;s Law:</strong> {t('como aproximação em regime estável, concurrency ≈ throughput × latency. Se a latência dobra enquanto a taxa de chegada permanece igual, o número de requests in-flight tende a crescer — e com ele memória, sockets, threads e pressure sobre pools.', 'as a steady-state approximation, concurrency ≈ throughput × latency. If latency doubles while arrival rate remains constant, the number of in-flight requests tends to grow — along with memory, sockets, threads, and pressure on resource pools.')}</div>
      </section>

      <section className="article-section" id="distributed-failures">
        <h2>{t('Failure modes e contenção de cascatas', 'Failure modes and cascade containment')}</h2>
        <TopicDiagram spec={failure} />
        <FailureGrid rows={locale === 'en' ? failureEn : failurePt} />
        <div className="reference-note"><strong>{t('Princípio:', 'Principle:')}</strong> {t('retries são tráfego. Durante overload, retry sem budget pode reduzir o throughput útil e acelerar a falha. Proteja primeiro a capacidade do sistema.', 'retries are traffic. During overload, retries without a budget can reduce useful throughput and accelerate failure. Protect system capacity first.')}</div>
      </section>
    </>;
  }

  if (articleSlug === 'kafka') {
    return <section className="article-section" id="kafka-reference">
      <h2>{t('Kafka em produção — ordering, escala, durabilidade e performance', 'Kafka in production — ordering, scale, durability, and performance')}</h2>
      <p className="section-summary">{t('O modelo mental principal é partitioned log. Partitions definem ordering e paralelismo; replicas definem tolerância a falha; consumer groups definem capacidade de leitura; batching e distribuição de chaves determinam grande parte do throughput real.', 'The primary mental model is a partitioned log. Partitions define ordering and parallelism; replicas define failure tolerance; consumer groups define read capacity; batching and key distribution determine much of the real throughput.')}</p>
      <TopicDiagram spec={distributedDataReferenceDiagrams.kafkaScale(locale)} />
      <Table rows={locale === 'en' ? kafkaRowsEn : kafkaRowsPt} />
      <div className="reference-grid">
        <article className="reference-card"><h3>{t('Planejamento de partitions', 'Partition planning')}</h3><p>{t('Não escolha apenas pelo volume atual. Considere paralelismo futuro, chave de ordenação, recovery traffic, número de consumers e custo operacional de muitas partitions.', 'Do not size only for current volume. Consider future parallelism, ordering keys, recovery traffic, consumer count, and the operational cost of many partitions.')}</p></article>
        <article className="reference-card"><h3>{t('Durabilidade', 'Durability')}</h3><p>{t('Replication factor, acks=all e min.insync.replicas trabalham em conjunto. Configuração mais segura pode rejeitar writes durante perda de replicas em vez de degradar silenciosamente a durabilidade.', 'Replication factor, acks=all, and min.insync.replicas work together. A safer configuration can reject writes during replica loss rather than silently weakening durability.')}</p></article>
        <article className="reference-card"><h3>{t('Backpressure', 'Backpressure')}</h3><p>{t('Kafka armazena backlog no log, mas storage não é infinito. Acompanhe lag, retention headroom, ingress/egress e tempo estimado para recuperar o atraso.', 'Kafka stores backlog in the log, but storage is not infinite. Track lag, retention headroom, ingress/egress, and estimated time to catch up.')}</p></article>
        <article className="reference-card"><h3>{t('Failure modes', 'Failure modes')}</h3><p>{t('Broker loss, ISR shrink, rebalance storms, poison messages, disk pressure, hot partitions e consumer slowdown precisam de runbooks diferentes.', 'Broker loss, ISR shrink, rebalance storms, poison messages, disk pressure, hot partitions, and consumer slowdown require different runbooks.')}</p></article>
      </div>
    </section>;
  }

  if (articleSlug === 'redis') {
    return <section className="article-section" id="redis-reference">
      <h2>{t('Redis em produção — cache, latência, memória e alta disponibilidade', 'Redis in production — caching, latency, memory, and high availability')}</h2>
      <p className="section-summary">{t('Redis reduz latency quando usado no lugar certo, mas um cache muda o failure model da aplicação. TTL, eviction, stampede, replication lag, hot keys e cold-cache behavior precisam ser parte do desenho.', 'Redis reduces latency when used in the right place, but a cache changes the application failure model. TTL, eviction, stampede, replication lag, hot keys, and cold-cache behavior must be part of the design.')}</p>
      <TopicDiagram spec={distributedDataReferenceDiagrams.redisCache(locale)} />
      <Table rows={locale === 'en' ? redisRowsEn : redisRowsPt} />
      <div className="reference-grid">
        <article className="reference-card"><h3>{t('Cache de latência', 'Latency cache')}</h3><p>{t('O sistema continua correto sem cache, apenas mais lento. Esse é normalmente o failure mode mais seguro.', 'The system remains correct without the cache, only slower. This is usually the safer failure mode.')}</p></article>
        <article className="reference-card"><h3>{t('Cache de capacidade', 'Capacity cache')}</h3><p>{t('O backend não suporta toda a carga sem cache. Uma perda ampla do cache pode causar cascading failure; warm-up e load shedding tornam-se requisitos.', 'The backend cannot support full load without the cache. A broad cache loss can cause a cascading failure; warm-up and load shedding become requirements.')}</p></article>
        <article className="reference-card"><h3>{t('Stampede', 'Stampede')}</h3><p>{t('Muitos misses simultâneos para a mesma chave atingem o backend ao mesmo tempo. Use single-flight/locks curtos, TTL jitter e stale-while-revalidate quando o produto permitir.', 'Many simultaneous misses for the same key hit the backend at once. Use single-flight/short locks, TTL jitter, and stale-while-revalidate when product semantics allow it.')}</p></article>
        <article className="reference-card"><h3>{t('Hot key', 'Hot key')}</h3><p>{t('Uma chave muito popular pode saturar um único shard. Replicação de leitura, key splitting ou cache local podem ajudar, dependendo da semântica.', 'One very popular key can saturate a single shard. Read replication, key splitting, or local caching can help depending on semantics.')}</p></article>
      </div>
    </section>;
  }

  return null;
}
