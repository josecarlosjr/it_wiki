import Link from "next/link";
import { wikiArticles, wikiCategories } from "@/content/wiki";

export const metadata = {
  title: "Enciclopédia técnica",
  description: "Índice aberto de artigos técnicos do básico ao especialista.",
};

export default function WikiIndexPage() {
  return (
    <main className="main wiki-index">
      <header className="wiki-heading">
        <p className="eyebrow">Enciclopédia técnica aberta</p>
        <h1>Todos os assuntos, sem bloqueios.</h1>
        <p className="lead">
          Consulte conceitos de infraestrutura, cloud, automação, redes, segurança e sistemas
          distribuídos. Cada artigo progride de fundamentos até tópicos de especialista.
        </p>
      </header>

      <nav className="alphabet-nav" aria-label="Navegação por categoria">
        {wikiCategories.map((category) => (
          <a href={`#${category.toLowerCase().replaceAll(" ", "-")}`} key={category}>
            {category}
          </a>
        ))}
      </nav>

      {wikiCategories.map((category) => {
        const articles = wikiArticles.filter((article) => article.category === category);
        const id = category.toLowerCase().replaceAll(" ", "-");

        return (
          <section className="wiki-category" id={id} key={category}>
            <div className="category-title">
              <h2>{category}</h2>
              <span>{articles.length} artigos</span>
            </div>

            <div className="wiki-list">
              {articles.map((article) => (
                <article className="wiki-list-item" key={article.slug}>
                  <div>
                    <Link href={`/wiki/${article.slug}/`}>
                      <h3>{article.title}</h3>
                    </Link>
                    <p>{article.summary}</p>
                    <div className="concept-list">
                      {article.concepts.slice(0, 6).map((concept) => (
                        <span key={concept}>{concept}</span>
                      ))}
                    </div>
                  </div>
                  <Link className="read-link" href={`/wiki/${article.slug}/`}>
                    Abrir artigo →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
