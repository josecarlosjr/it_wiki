'use client';

import Link from "next/link";
import { BookOpen, Boxes, Network, ShieldCheck } from "lucide-react";
import { wikiArticles, wikiCategories } from "@/content/wiki";
import { wikiArticlesEn, wikiCategoriesEn } from "@/content/wiki-en";
import { useLanguage } from "@/components/language-provider";
import { HardLink } from "@/components/hard-link";

export default function HomePage() {
  const { locale, t } = useLanguage();
  const articles = locale === 'en' ? wikiArticlesEn : wikiArticles;
  const categories = locale === 'en' ? wikiCategoriesEn : wikiCategories;
  const featured = articles.slice(0, 9);

  return (
    <main className="main">
      <section className="hero wiki-hero">
        <div>
          <p className="eyebrow">{t('Enciclopédia técnica aberta', 'Open technical encyclopedia')}</p>
          <h1>{t('Conhecimento de TI para consulta, não um curso fechado.', 'IT knowledge for direct reference, not a locked course.')}</h1>
          <p className="lead">
            {t(
              'Pesquise assuntos isoladamente, navegue entre conceitos relacionados e consulte cada artigo no nível necessário: fundamentos, intermediário, avançado ou especialista.',
              'Search individual topics, follow related concepts, and read each article at the level you need: fundamentals, intermediate, advanced, or expert.'
            )}
          </p>
          <div className="actions">
            <Link className="button primary" href="/wiki/">
              {t('Abrir enciclopédia', 'Open encyclopedia')} <BookOpen size={18} />
            </Link>
            <HardLink className="button" href="/wiki/kubernetes/">{t('Consultar Kubernetes', 'Open Kubernetes')}</HardLink>
          </div>
        </div>

        <aside className="panel wiki-summary">
          <strong>{t('Conteúdo liberado', 'Available content')}</strong>
          <div className="stat-grid">
            <div className="stat"><strong>{articles.length}</strong><span>{t('artigos completos', 'complete articles')}</span></div>
            <div className="stat"><strong>{categories.length}</strong><span>{t('áreas técnicas', 'technical areas')}</span></div>
            <div className="stat"><strong>4</strong><span>{t('níveis por artigo', 'levels per article')}</span></div>
            <div className="stat"><strong>100%</strong><span>{t('acesso aberto', 'open access')}</span></div>
          </div>
          <p className="lead">
            {t('Não há aulas bloqueadas, progresso obrigatório ou conteúdo marcado apenas como planejado.', 'There are no locked lessons, mandatory progress gates, or placeholder-only topics.')}
          </p>
        </aside>
      </section>

      <section className="section">
        <div className="category-title">
          <div>
            <p className="eyebrow">{t('Artigos em destaque', 'Featured articles')}</p>
            <h2>{t('Consulte diretamente o assunto necessário', 'Go directly to the topic you need')}</h2>
          </div>
          <Link className="read-link" href="/wiki/">{t('Ver índice completo →', 'View full index →')}</Link>
        </div>

        <div className="grid">
          {featured.map((article) => (
            <article className="card wiki-card" key={article.slug}>
              <p className="card-meta">{article.category}</p>
              <HardLink href={`/wiki/${article.slug}/`}><h3>{article.title}</h3></HardLink>
              <p>{article.summary}</p>
              <div className="concept-list">
                {article.concepts.slice(0, 4).map((concept) => <span key={concept}>{concept}</span>)}
              </div>
              <HardLink className="read-link" href={`/wiki/${article.slug}/`}>{t('Abrir artigo →', 'Open article →')}</HardLink>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid">
        <article className="card">
          <Boxes />
          <h3>{t('Do básico ao especialista', 'From fundamentals to expert')}</h3>
          <p>{t('Cada assunto contém explicação progressiva sem exigir uma sequência de curso.', 'Each topic progresses in depth without requiring a fixed course sequence.')}</p>
        </article>
        <article className="card">
          <Network />
          <h3>{t('Conceitos relacionados', 'Related concepts')}</h3>
          <p>{t('Links entre artigos ajudam a seguir dependências técnicas e arquiteturais.', 'Cross-links help you follow technical and architectural dependencies.')}</p>
        </article>
        <article className="card">
          <ShieldCheck />
          <h3>{t('Uso prático', 'Practical use')}</h3>
          <p>{t('Os artigos incluem operação, troubleshooting e perguntas comuns de entrevistas.', 'Articles include operations, troubleshooting, and common interview questions.')}</p>
        </article>
      </section>
    </main>
  );
}
