import Link from "next/link";
import { ArchitecturePlayer } from "@/components/architecture-player";

export const metadata = { title: "Kubernetes Service" };

export default function KubernetesServiceLesson() {
  return (
    <main className="main lesson-layout">
      <aside className="sidebar panel">
        <strong>Nesta aula</strong>
        <a href="#conceito">Conceito</a>
        <a href="#arquitetura">Arquitetura</a>
        <a href="#tipos">Tipos</a>
        <a href="#diagnostico">Diagnóstico</a>
        <a href="#entrevista">Entrevista</a>
      </aside>

      <article className="article">
        <p className="eyebrow">Kubernetes · Redes · Iniciante</p>
        <h1>Como funciona um Kubernetes Service?</h1>
        <p className="lead">
          Pods são efêmeros. Um Service cria um ponto de acesso estável e mantém a aplicação
          alcançável mesmo quando réplicas são substituídas.
        </p>

        <section className="section" id="conceito">
          <h2>Analogia simples</h2>
          <div className="callout">
            Pense no Service como a receção de uma empresa. Os funcionários podem mudar de sala,
            mas o número principal continua o mesmo e encaminha cada chamada para alguém disponível.
          </div>
          <p className="lead">
            Tecnicamente, o Service seleciona Pods através de labels. Os endpoints correspondentes
            são representados por EndpointSlices e usados para encaminhar o tráfego.
          </p>
        </section>

        <section className="section" id="arquitetura">
          <h2>Fluxo arquitetural</h2>
          <ArchitecturePlayer />
        </section>

        <section className="section" id="tipos">
          <h2>Tipos principais</h2>
          <div className="grid">
            <div className="card"><h3>ClusterIP</h3><p>Exposição interna dentro do cluster.</p></div>
            <div className="card"><h3>NodePort</h3><p>Abre uma porta em cada Node.</p></div>
            <div className="card"><h3>LoadBalancer</h3><p>Solicita integração com um balanceador externo.</p></div>
          </div>
        </section>

        <section className="section" id="diagnostico">
          <h2>Primeiro diagnóstico</h2>
          <pre className="codeblock"><code>{`kubectl get service
kubectl get endpointslices
kubectl describe service minha-api
kubectl get pods --show-labels`}</code></pre>
          <p className="lead">
            Se o Service não possui endpoints, compare o selector do Service com as labels dos Pods
            e verifique se os Pods estão Ready.
          </p>
        </section>

        <section className="section" id="entrevista">
          <h2>Resposta de entrevista</h2>
          <div className="callout">
            Um Service fornece identidade de rede estável para um conjunto dinâmico de Pods.
            Ele seleciona os backends por labels e encaminha conexões para endpoints disponíveis.
          </div>
          <Link className="button" href="/entrevistas/">Praticar outras perguntas</Link>
        </section>
      </article>
    </main>
  );
}
