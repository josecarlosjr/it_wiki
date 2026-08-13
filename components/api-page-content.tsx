'use client';

import { ApiReference } from './api-reference';
import { useLanguage } from './language-provider';
import { HardLink } from './hard-link';

export function ApiPageContent() {
  const { t } = useLanguage();
  return (
    <main className="main wiki-article">
      <header className="wiki-heading api-page-heading">
        <p className="eyebrow">{t('APIs e integração', 'APIs and integration')}</p>
        <h1>{t('APIs: arquitetura, performance e segurança', 'APIs: architecture, performance, and security')}</h1>
        <p className="lead">{t(
          'Guia visual de fundamentos a padrões avançados: RESTful, SOAP, GraphQL, gRPC, WebSocket, Webhook, MQTT, AMQP, métodos HTTP, otimização, segurança e desenho escalável.',
          'A visual guide from fundamentals to advanced patterns: RESTful, SOAP, GraphQL, gRPC, WebSocket, Webhook, MQTT, AMQP, HTTP methods, optimization, security, and scalable design.'
        )}</p>
        <div className="concept-list">
          {['REST','GraphQL','gRPC','SOAP','WebSocket','Webhook','MQTT','AMQP','HTTP','OAuth/OIDC','Caching','Pagination','Rate limiting'].map((concept)=><span key={concept}>{concept}</span>)}
        </div>
      </header>

      <section className="article-section" id="api-overview">
        <h2>{t('Fundamentos para escolher uma API', 'Fundamentals for choosing an API')}</h2>
        <div className="api-principles">
          <article><h3>{t('Contrato', 'Contract')}</h3><p>{t('Defina recursos, operações, schema, erros, compatibilidade e versionamento antes da implementação.', 'Define resources, operations, schema, errors, compatibility, and versioning before implementation.')}</p></article>
          <article><h3>{t('Semântica', 'Semantics')}</h3><p>{t('Escolha request/response, streaming, publish/subscribe ou callback conforme o fluxo real de informação.', 'Choose request/response, streaming, publish/subscribe, or callback according to the actual information flow.')}</p></article>
          <article><h3>{t('SLO', 'SLO')}</h3><p>{t('Latency, throughput, availability e error budget influenciam protocolo, timeout, retry e capacidade.', 'Latency, throughput, availability, and error budget influence protocol, timeout, retry, and capacity.')}</p></article>
          <article><h3>{t('Falhas', 'Failures')}</h3><p>{t('Assuma timeouts, duplicação, partial failure, overload e dependências lentas; desenhe idempotência e backpressure.', 'Assume timeouts, duplication, partial failure, overload, and slow dependencies; design idempotency and backpressure.')}</p></article>
        </div>
      </section>

      <ApiReference />

      <section className="article-section">
        <h2>{t('Artigos relacionados', 'Related articles')}</h2>
        <div className="reference-grid">
          <article className="reference-card"><h3><HardLink href="/wiki/sistemas-distribuidos/">{t('Sistemas distribuídos', 'Distributed systems')}</HardLink></h3><p>{t('Retries, idempotência, backpressure, quorum e failure modes.', 'Retries, idempotency, backpressure, quorum, and failure modes.')}</p></article>
          <article className="reference-card"><h3><HardLink href="/wiki/seguranca/">{t('Segurança e protocolos', 'Security and protocols')}</HardLink></h3><p>{t('TLS, identity, firewalls, proxies e Zero Trust.', 'TLS, identity, firewalls, proxies, and Zero Trust.')}</p></article>
          <article className="reference-card"><h3><HardLink href="/wiki/observabilidade/">{t('Observabilidade', 'Observability')}</HardLink></h3><p>{t('Métricas, logs, traces, SLI/SLO e diagnóstico.', 'Metrics, logs, traces, SLI/SLO, and diagnosis.')}</p></article>
        </div>
      </section>
    </main>
  );
}
