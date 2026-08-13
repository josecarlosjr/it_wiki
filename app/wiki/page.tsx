'use client';

import { wikiArticles, wikiCategories } from "@/content/wiki";
import { wikiArticlesEn, wikiCategoriesEn } from "@/content/wiki-en";
import { useLanguage } from "@/components/language-provider";
import { HardLink } from "@/components/hard-link";

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
        <a href="#apis-e-integracao">{t('APIs e integração', 'APIs and integration')}</a>
        {categoriesSource.map((category) => (
          <a href={`#${category.toLowerCase().replaceAll(" ", "-")}`} key={category}>{category}</a>
        ))}
      </nav>

      <section className="wiki-category" id="apis-e-integracao">
        <div className="category-title">
          <h2>{t('APIs e integração', 'APIs and integration')}</h2>
          <span>1 {t('artigo', 'article')}</span>
        </div>
        <div className="wiki-list">
          <article className="wiki-list-item">
            <div>
              <HardLink href="/wiki/api/"><h3>{t('APIs: arquitetura, performance e segurança', 'APIs: architecture, performance, and security')}</h3></HardLink>
              <p>{t('REST, SOAP, GraphQL, gRPC, WebSocket, Webhook, MQTT, AMQP, métodos HTTP, otimização e segurança em um guia visual.', 'REST, SOAP, GraphQL, gRPC, WebSocket, Webhook, MQTT, AMQP, HTTP methods, optimization, and security in one visual guide.')}</p>
              <div className="concept-list">{['REST','GraphQL','gRPC','WebSocket','HTTP','Caching'].map((concept)=><span key={concept}>{concept}</span>)}</div>
            </div>
            <HardLink className="read-link" href="/wiki/api/">{t('Abrir artigo →', 'Open article →')}</HardLink>
          </article>
        </div>
      </section>

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
                    <HardLink href={`/wiki/${article.slug}/`}><h3>{article.title}</h3></HardLink>
                    <p>{article.summary}</p>
                    <div className="concept-list">
                      {article.concepts.slice(0, 6).map((concept) => <span key={concept}>{concept}</span>)}
                    </div>
                  </div>
                  <HardLink className="read-link" href={`/wiki/${article.slug}/`}>{t('Abrir artigo →', 'Open article →')}</HardLink>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
