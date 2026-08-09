'use client';

import Link from "next/link";
import { wikiArticles, wikiCategories } from "@/content/wiki";
import { wikiArticlesEn, wikiCategoriesEn } from "@/content/wiki-en";
import { useLanguage } from "@/components/language-provider";

export default function SubjectIndexPage() {
  const { locale, t } = useLanguage();
  const articlesSource = locale === 'en' ? wikiArticlesEn : wikiArticles;
  const categoriesSource = locale === 'en' ? wikiCategoriesEn : wikiCategories;
  return (
    <main className="main">
      <p className="eyebrow">{t('Índice aberto', 'Open index')}</p>
      <h1>{t('Assuntos técnicos', 'Technical topics')}</h1>
      <p className="lead">{t('A IT_WIKI não exige uma trilha obrigatória. Abra qualquer assunto e consulte diretamente fundamentos, operação, arquitetura ou conteúdo de especialista.', 'IT_WIKI does not require a mandatory learning path. Open any topic and go directly to fundamentals, operations, architecture, or expert content.')}</p>
      <section className="section">
        {categoriesSource.map((category) => (
          <div className="subject-group" key={category}>
            <h2>{category}</h2>
            <div className="grid">
              {articlesSource.filter((article) => article.category === category).map((article) => (
                <article className="card" key={article.slug}>
                  <h3>{article.title}</h3><p>{article.summary}</p>
                  <p className="card-meta">{t('Fundamentos · Intermediário · Avançado · Especialista', 'Fundamentals · Intermediate · Advanced · Expert')}</p>
                  <Link className="button" href={`/wiki/${article.slug}/`}>{t('Abrir artigo', 'Open article')}</Link>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
