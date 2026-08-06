import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wikiArticleBySlug, wikiArticles, type WikiArticle } from "@/content/wiki";
import { WikiArticleAccordions } from "@/components/wiki-article-accordions";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return wikiArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = wikiArticleBySlug[slug];

  if (!article) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function WikiArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = wikiArticleBySlug[slug];

  if (!article) {
    notFound();
  }

  const relatedArticles = article.related
    .map((relatedSlug) => wikiArticleBySlug[relatedSlug])
    .filter((related): related is WikiArticle => Boolean(related));

  return (
    <main className="main wiki-article-layout">
      <aside className="wiki-toc panel" aria-label="Índice do artigo">
        <strong>Conteúdo</strong>
        <a href="#visao-geral">Visão geral</a>
        {article.sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>{section.title}</a>
        ))}
        <a href="#entrevista">Entrevista</a>
        <a href="#relacionados">Artigos relacionados</a>
        <Link className="back-link" href="/wiki/">← Índice completo</Link>
      </aside>

      <article className="wiki-article" data-pagefind-body>
        <header className="article-header">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p className="article-aliases">
            Também conhecido como: {article.aliases.join(", ")}
          </p>
          <p className="lead">{article.summary}</p>
          <div className="article-open-notice">
            Conteúdo aberto · leitura livre · do básico ao especialista
          </div>
        </header>

        <section className="article-section" id="visao-geral">
          <h2>Visão geral</h2>
          <p>
            Este artigo apresenta o assunto em níveis progressivos. Não existe bloqueio por curso,
            ordem obrigatória ou pré-requisito artificial: use o índice lateral para ir diretamente
            ao ponto necessário.
          </p>
          <div className="concept-list large">
            {article.concepts.map((concept) => <span key={concept}>{concept}</span>)}
          </div>
        </section>

        <WikiArticleAccordions
          sections={article.sections}
          interviewQuestions={article.interviewQuestions}
        />

        <section className="article-section" id="relacionados">
          <h2>Artigos relacionados</h2>
          <div className="related-grid">
            {relatedArticles.map((related) => (
              <Link className="related-card" href={`/wiki/${related.slug}/`} key={related.slug}>
                <span>{related.category}</span>
                <strong>{related.title}</strong>
                <p>{related.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
