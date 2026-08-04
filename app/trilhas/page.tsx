import Link from "next/link";
import { topics } from "@/content/catalog";

export const metadata = { title: "Trilhas" };

export default function TrailsPage() {
  return (
    <main className="main">
      <p className="eyebrow">Catálogo</p>
      <h1>Trilhas de aprendizagem</h1>
      <p className="lead">Cada trilha avança de fundamentos para arquitetura, operação e diagnóstico.</p>
      <section className="grid section">
        {topics.map((topic) => (
          <article className="card" key={topic.slug}>
            <p className="card-meta">{topic.level}</p>
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <p>{topic.lessons} aulas · {topic.status}</p>
            {topic.slug === "kubernetes" && (
              <Link className="button primary" href="/aprender/kubernetes-service/">Abrir aula</Link>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
