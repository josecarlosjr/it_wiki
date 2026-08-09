'use client';

import { wikiArticles, wikiCategories } from "@/content/wiki";
import { wikiArticlesEn, wikiCategoriesEn } from "@/content/wiki-en";
import { useLanguage } from "@/components/language-provider";

export default function WikiIndexPage() {
  const { locale, t } = useLanguage();
  const articlesSource = locale === 'en' ? wikiArticlesEn : wikiArticles;
  const categoriesSource = locale === 'en' ? wikiCategoriesEn : wikiCategories;

  return (
    <main className="main wiki-index">
      <header className="wiki-heading">
        <p className="eyebrow">{t('Enciclopédia técnica aberta', 'Open technical encyclopedia')}</p>
        <h1>{t('Todos os assuntos, sem bloqueios.', 'Every topic, without access gates.')}</h1>
        <p className="lead">
          {t(
            'Consulte conceitos de infraestrutura, cloud, automação, redes, segurança e sistemas distribuídos. Cada artigo progride de fundamentos até tópicos de especialista.',
            'Browse infrastructure, cloud, automation, networking, security, and distributed-systems concepts. Every article progresses from fundamentals to expert topics.'
          )}
        </p>
      </header>

      <nav className="alphabet-nav" aria-label={t('Navegação por categoria', 'Category navigation')}>
        {categoriesSource.map((category) => (
          <a href={`#${category.toLowerCase().replaceAll(" ", "-")}`} key={category}>{category}</a>
        ))}
      </nav>

      {categoriesSource.map((category) => {
        const articles = articlesSource.filter((article) => article.category === category);
        const id = category.toLowerCase().replaceAll(" ", "-");

        return (
          <section className="wiki-category" id={id} key={category}>
            <div className="category-title">
              <h2>{category}</h2>
              <span>{articles.length} {t('artigos', 'articles')}</span>
            </div>

            <div className="wiki-list">
              {articles.map((article) => (
                <article className="wiki-list-item" key={article.slug}>
                  <div>
                    <a href={`/wiki/${article.slug}/`}><h3>{article.title}</h3></a>
                    <p>{article.summary}</p>
                    <div className="concept-list">
                      {article.concepts.slice(0, 6).map((concept) => <span key={concept}>{concept}</span>)}
                    </div>
                  </div>
                  <a className="read-link" href={`/wiki/${article.slug}/`}>{t('Abrir artigo →', 'Open article →')}</a>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
