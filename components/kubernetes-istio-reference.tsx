'use client';

import { useState } from 'react';
import { getKubernetesIstioDiagram } from '@/content/kubernetes-istio-diagrams';
import { istioGroups, istioTopics } from '@/content/kubernetes-istio-content';
import { useLanguage } from './language-provider';
import { TopicDiagram } from './topic-diagram';

function Code({ children }: { children: string }) {
  return <pre className="reference-code"><code>{children}</code></pre>;
}

export function KubernetesIstioReference() {
  const { locale, t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div id="kubernetes-istio-reference">
      <section className="article-section" id="k8s-istio">
        <h2>{t('Istio e service mesh no Kubernetes', 'Istio and service mesh on Kubernetes')}</h2>
        <p className="section-summary">
          {t(
            'Istio adiciona uma camada de infraestrutura para controlar comunicação service-to-service: identidade de workload, mTLS, routing L7, retries/timeouts, gateways, observabilidade e policies. A seção abaixo compara sidecar e ambient, mostra o fluxo completo com KServe e explica alternativas que podem ser mais adequadas em alguns clusters.',
            'Istio adds an infrastructure layer for service-to-service communication: workload identity, mTLS, L7 routing, retries/timeouts, gateways, observability, and policy. The section below compares sidecar and ambient modes, shows the complete KServe flow, and explains alternatives that can be a better fit for some clusters.'
          )}
        </p>
        <div className="reference-note">
          <strong>{t('Regra de arquitetura:', 'Architecture rule:')}</strong>{' '}
          {t(
            'comece pelo problema. Service mesh é mais valioso quando muitos workloads precisam das mesmas capacidades de segurança, tráfego e telemetria. Para poucos serviços, Gateway API, NetworkPolicy, certificados e OpenTelemetry podem ser suficientes.',
            'start with the problem. A service mesh is most valuable when many workloads need the same security, traffic, and telemetry capabilities. For a small number of services, Gateway API, NetworkPolicy, certificates, and OpenTelemetry may be sufficient.'
          )}
        </div>
      </section>

      {istioGroups.map((group) => {
        const topics = istioTopics.filter((topic) => topic.group === group.id);
        return (
          <section className="article-section" id={`k8s-istio-${group.id}`} key={group.id}>
            <h2>{locale === 'en' ? group.en : group.pt}</h2>
            <div className="istio-topic-grid">
              {topics.map((topic) => {
                const isOpen = openId === topic.id;
                return (
                  <article className={`istio-topic-card${isOpen ? ' is-expanded' : ''}`} id={topic.id} key={topic.id}>
                    <button
                      className="istio-topic-trigger"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenId(isOpen ? null : topic.id)}
                    >
                      <strong>{topic.title}</strong>
                      <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen ? (
                      <div className="istio-topic-content">
                        <p>{topic.summary[locale]}</p>
                        <h3>{t('Passos da comunicação', 'Communication steps')}</h3>
                        <ol className="istio-numbered-steps">
                          {topic.steps.map((step, index) => (
                            <li key={`${topic.id}-${index}`}>
                              <span>{index + 1}</span>
                              <p>{step[locale]}</p>
                            </li>
                          ))}
                        </ol>
                        <TopicDiagram spec={getKubernetesIstioDiagram(topic.diagram, locale)} />
                        {topic.code ? (
                          <>
                            <h3>{t('Exemplo', 'Example')}</h3>
                            <Code>{topic.code}</Code>
                          </>
                        ) : null}
                        <h3>{t('Boas práticas e trade-offs', 'Best practices and trade-offs')}</h3>
                        <ul className="knowledge-list">
                          {topic.notes.map((note, index) => <li key={`${topic.id}-note-${index}`}>{note[locale]}</li>)}
                        </ul>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="article-section" id="k8s-istio-comparison">
        <h2>{t('Quando escolher cada abordagem', 'When to choose each approach')}</h2>
        <div className="table-wrap">
          <table className="reference-table">
            <thead>
              <tr>
                <th>{t('Abordagem', 'Approach')}</th>
                <th>{t('Pontos fortes', 'Strengths')}</th>
                <th>{t('Atenções', 'Considerations')}</th>
                <th>{t('Melhor encaixe', 'Best fit')}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Istio sidecar</td><td>{t('L7 completo por workload, políticas maduras, ecossistema amplo.', 'Full L7 per workload, mature policy model, broad ecosystem.')}</td><td>{t('Proxy por Pod, mais CPU/memória e upgrades mais sensíveis.', 'Proxy per Pod, more CPU/memory, and more sensitive upgrades.')}</td><td>{t('Microservices com requisitos L7 e Zero Trust avançados.', 'Microservices with advanced L7 and Zero Trust requirements.')}</td></tr>
              <tr><td>Istio ambient</td><td>{t('L4 seguro sem sidecar e L7 opcional via waypoint.', 'Secure L4 without sidecars and optional L7 through waypoints.')}</td><td>{t('Modelo operacional novo; valide feature parity necessária antes de migrar.', 'Newer operational model; validate required feature parity before migration.')}</td><td>{t('Clusters grandes que querem reduzir sidecars e adotar mesh incrementalmente.', 'Large clusters that want fewer sidecars and incremental mesh adoption.')}</td></tr>
              <tr><td>Linkerd</td><td>{t('Operação simples e micro-proxy leve.', 'Simple operations and lightweight micro-proxy.')}</td><td>{t('Menor conjunto de extensões/routing avançado que Istio.', 'Smaller set of advanced extensions/routing than Istio.')}</td><td>{t('Equipas que priorizam simplicidade e mTLS/telemetria transparentes.', 'Teams prioritizing simplicity and transparent mTLS/telemetry.')}</td></tr>
              <tr><td>Cilium Service Mesh</td><td>{t('Integra CNI/eBPF com Envoy para L7.', 'Integrates CNI/eBPF with Envoy for L7.')}</td><td>{t('Decisão fica fortemente ligada ao dataplane Cilium.', 'Decision becomes closely tied to the Cilium dataplane.')}</td><td>{t('Clusters que já usam Cilium e querem unificar networking/policy/mesh.', 'Clusters already using Cilium that want unified networking/policy/mesh.')}</td></tr>
              <tr><td>Consul</td><td>{t('Service discovery e mesh entre Kubernetes, VMs e outros runtimes.', 'Service discovery and mesh across Kubernetes, VMs, and other runtimes.')}</td><td>{t('Adiciona a operação do Consul control plane/catalog.', 'Adds operation of the Consul control plane/catalog.')}</td><td>{t('Ambientes híbridos e multi-runtime.', 'Hybrid and multi-runtime environments.')}</td></tr>
              <tr><td>{t('Sem mesh completo', 'No full mesh')}</td><td>{t('Menos componentes e menor complexidade.', 'Fewer components and less complexity.')}</td><td>{t('Mais responsabilidade distribuída entre Gateway, CNI, PKI e observabilidade.', 'More responsibility distributed across Gateway, CNI, PKI, and observability.')}</td><td>{t('Poucos workloads ou necessidades simples de ingress/policy/TLS.', 'Few workloads or simple ingress/policy/TLS requirements.')}</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
