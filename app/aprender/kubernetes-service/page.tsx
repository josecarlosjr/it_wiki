'use client';

import Link from "next/link";
import { ArchitecturePlayer } from "@/components/architecture-player";
import { useLanguage } from "@/components/language-provider";

export default function KubernetesServiceLesson() {
  const { t } = useLanguage();
  return (
    <main className="main lesson-layout">
      <aside className="sidebar panel">
        <strong>{t('Nesta aula', 'In this lesson')}</strong>
        <a href="#conceito">{t('Conceito', 'Concept')}</a>
        <a href="#arquitetura">{t('Arquitetura', 'Architecture')}</a>
        <a href="#tipos">{t('Tipos', 'Types')}</a>
        <a href="#diagnostico">{t('Diagnóstico', 'Troubleshooting')}</a>
        <a href="#entrevista">{t('Entrevista', 'Interview')}</a>
      </aside>

      <article className="article">
        <p className="eyebrow">Kubernetes · {t('Redes · Iniciante', 'Networking · Beginner')}</p>
        <h1>{t('Como funciona um Kubernetes Service?', 'How does a Kubernetes Service work?')}</h1>
        <p className="lead">{t('Pods são efêmeros. Um Service cria um ponto de acesso estável e mantém a aplicação alcançável mesmo quando réplicas são substituídas.', 'Pods are ephemeral. A Service creates a stable access point and keeps the application reachable even when replicas are replaced.')}</p>

        <section className="section" id="conceito">
          <h2>{t('Analogia simples', 'Simple analogy')}</h2>
          <div className="callout">{t('Pense no Service como a receção de uma empresa. Os funcionários podem mudar de sala, mas o número principal continua o mesmo e encaminha cada chamada para alguém disponível.', 'Think of a Service as a company reception desk. Employees may move between rooms, but the main number remains stable and routes each call to someone available.')}</div>
          <p className="lead">{t('Tecnicamente, o Service seleciona Pods através de labels. Os endpoints correspondentes são representados por EndpointSlices e usados para encaminhar o tráfego.', 'Technically, the Service selects Pods through labels. Matching endpoints are represented by EndpointSlices and used to route traffic.')}</p>
        </section>

        <section className="section" id="arquitetura"><h2>{t('Fluxo arquitetural', 'Architecture flow')}</h2><ArchitecturePlayer /></section>

        <section className="section" id="tipos">
          <h2>{t('Tipos principais', 'Main types')}</h2>
          <div className="grid">
            <div className="card"><h3>ClusterIP</h3><p>{t('Exposição interna dentro do cluster.', 'Internal exposure inside the cluster.')}</p></div>
            <div className="card"><h3>NodePort</h3><p>{t('Abre uma porta em cada Node.', 'Opens a port on each Node.')}</p></div>
            <div className="card"><h3>LoadBalancer</h3><p>{t('Solicita integração com um balanceador externo.', 'Requests integration with an external load balancer.')}</p></div>
          </div>
        </section>

        <section className="section" id="diagnostico">
          <h2>{t('Primeiro diagnóstico', 'Initial troubleshooting')}</h2>
          <pre className="codeblock"><code>{`kubectl get service
kubectl get endpointslices
kubectl describe service minha-api
kubectl get pods --show-labels`}</code></pre>
          <p className="lead">{t('Se o Service não possui endpoints, compare o selector do Service com as labels dos Pods e verifique se os Pods estão Ready.', 'If the Service has no endpoints, compare the Service selector with Pod labels and verify that the Pods are Ready.')}</p>
        </section>

        <section className="section" id="entrevista">
          <h2>{t('Resposta de entrevista', 'Interview answer')}</h2>
          <div className="callout">{t('Um Service fornece identidade de rede estável para um conjunto dinâmico de Pods. Ele seleciona os backends por labels e encaminha conexões para endpoints disponíveis.', 'A Service provides stable network identity for a dynamic set of Pods. It selects backends by labels and routes connections to available endpoints.')}</div>
          <Link className="button" href="/entrevistas/">{t('Praticar outras perguntas', 'Practice other questions')}</Link>
        </section>
      </article>
    </main>
  );
}
