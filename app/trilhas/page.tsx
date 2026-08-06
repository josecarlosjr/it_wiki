import Link from "next/link";
import { wikiArticles, wikiCategories } from "@/content/wiki";

export const metadata = { title: "Índice de assuntos" };

export default function SubjectIndexPage() {
  return (
    <main className="main">
      <p className="eyebrow">Índice aberto</p>
      <h1>Assuntos técnicos</h1>
      <p className="lead">
        A IT_WIKI não exige uma trilha obrigatória. Abra qualquer assunto e consulte diretamente
        fundamentos, operação, arquitetura ou conteúdo de especialista.
      </p>

      <section className="section">
        {wikiCategories.map((category) => (
          <div className="subject-group" key={category}>
            <h2>{category}</h2>
            <div className="grid">
              {wikiArticles
                .filter((article) => article.category === category)
                .map((article) => (
                  <article className="card" key={article.slug}>
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <p className="card-meta">Fundamentos · Intermediário · Avançado · Especialista</p>
                    <Link className="button" href={`/wiki/${article.slug}/`}>Abrir artigo</Link>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
