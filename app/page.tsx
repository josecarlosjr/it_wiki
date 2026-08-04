import Link from "next/link";
import { ArrowRight, Boxes, Network, ShieldCheck } from "lucide-react";
import { topics } from "@/content/catalog";

export default function HomePage() {
  return (
    <main className="main">
      <section className="hero">
        <div>
          <p className="eyebrow">Aprendizagem visual para infraestrutura e cloud</p>
          <h1>Entenda sistemas complexos sem decorar respostas.</h1>
          <p className="lead">
            A IT_WIKI explica conceitos de TI em camadas, conecta teoria a cenários reais e usa
            diagramas animados para mostrar o que acontece dentro da arquitetura.
          </p>
          <div className="actions">
            <Link className="button primary" href="/aprender/kubernetes-service/">
              Iniciar primeira aula <ArrowRight size={18} />
            </Link>
            <Link className="button" href="/trilhas/">Explorar trilhas</Link>
          </div>
        </div>
        <div className="panel">
          <div className="stat-grid">
            <div className="stat"><strong>3</strong><span>modos de estudo</span></div>
            <div className="stat"><strong>35+</strong><span>aulas planejadas</span></div>
            <div className="stat"><strong>10</strong><span>diagramas MVP</span></div>
            <div className="stat"><strong>30</strong><span>perguntas técnicas</span></div>
          </div>
          <p className="lead">Aprenda por conceito, fluxo arquitetural, troubleshooting e entrevista.</p>
        </div>
      </section>

      <section className="section">
        <p className="eyebrow">Trilhas</p>
        <h2>Fundamentos antes da complexidade</h2>
        <div className="grid">
          {topics.slice(0, 6).map((topic) => (
            <article className="card" key={topic.slug}>
              <p className="card-meta">{topic.level} · {topic.lessons} aulas</p>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <span className="pill">{topic.status}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid">
        <article className="card">
          <Boxes />
          <h3>Arquitetura interativa</h3>
          <p>Execute cada fluxo passo a passo e veja os componentes envolvidos.</p>
        </article>
        <article className="card">
          <Network />
          <h3>Troubleshooting orientado</h3>
          <p>Parta do sintoma, formule hipóteses e valide evidências com comandos reais.</p>
        </article>
        <article className="card">
          <ShieldCheck />
          <h3>Preparação para entrevistas</h3>
          <p>Respostas curtas, aprofundamento técnico e perguntas de seguimento.</p>
        </article>
      </section>
    </main>
  );
}
