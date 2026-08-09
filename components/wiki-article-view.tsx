'use client';

import Link from 'next/link';
import type { WikiArticle } from '@/content/wiki';
import { useLanguage } from './language-provider';
import { HardLink } from './hard-link';
import { WikiArticleAccordions } from './wiki-article-accordions';
import { DockerfileExamples } from './dockerfile-examples';
import { LinuxCommandReference } from './linux-command-reference';
import { NetworkReference } from './network-reference';
import { AutomationIacReference } from './automation-iac-reference';
import { AwsReference } from './aws-reference';

type Props = {
  articlePt: WikiArticle;
  articleEn: WikiArticle;
  relatedPt: WikiArticle[];
  relatedEn: WikiArticle[];
};

export function WikiArticleView({ articlePt, articleEn, relatedPt, relatedEn }: Props) {
  const { locale, t } = useLanguage();
  const article = locale === 'en' ? articleEn : articlePt;
  const relatedArticles = locale === 'en' ? relatedEn : relatedPt;
  const hasAutomationReference = ['helm', 'terraform', 'ansible', 'cicd'].includes(article.slug);

  return (
    <main className="main wiki-article-layout">
      <aside className="wiki-toc panel" aria-label={t('Índice do artigo', 'Article table of contents')}>
        <strong>{t('Conteúdo', 'Contents')}</strong>
        <a href="#visao-geral">{t('Visão geral', 'Overview')}</a>
        {article.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}
        {article.slug === 'docker' ? <a href="#dockerfile-examples">{t('Exemplos de Dockerfile', 'Dockerfile examples')}</a> : null}
        {article.slug === 'linux' ? <a href="#linux-commands">{t('Comandos avançados', 'Advanced commands')}</a> : null}
        {article.slug === 'redes' ? <a href="#network-vpn">VPN</a> : null}
        {article.slug === 'redes' ? <a href="#network-two-networks">{t('Duas redes', 'Connecting two networks')}</a> : null}
        {article.slug === 'redes' ? <a href="#network-ports">{t('Portas e protocolos', 'Ports and protocols')}</a> : null}
        {hasAutomationReference ? <a href="#automation-iac-reference">{t('Guia prático', 'Practical guide')}</a> : null}
        {article.slug === 'aws' ? <a href="#aws-iam">IAM Roles</a> : null}
        {article.slug === 'aws' ? <a href="#aws-s3">S3</a> : null}
        {article.slug === 'aws' ? <a href="#aws-rds">RDS</a> : null}
        {article.slug === 'aws' ? <a href="#aws-lambda">Lambda</a> : null}
        {article.slug === 'aws' ? <a href="#aws-ecs">ECS</a> : null}
        {article.slug === 'aws' ? <a href="#aws-eks">EKS</a> : null}
        {article.slug === 'aws' ? <a href="#aws-messaging">SNS / SQS</a> : null}
        {article.slug === 'aws' ? <a href="#aws-vpc-hybrid">{t('VPC híbrida', 'Hybrid VPC')}</a> : null}
        {article.slug === 'aws' ? <a href="#aws-vpn">AWS VPN</a> : null}
        <a href="#entrevista">{t('Entrevista', 'Interview')}</a>
        <a href="#relacionados">{t('Artigos relacionados', 'Related articles')}</a>
        <Link className="back-link" href="/wiki/">← {t('Índice completo', 'Full index')}</Link>
      </aside>

      <article className="wiki-article" data-pagefind-body>
        <header className="article-header">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p className="article-aliases">{t('Também conhecido como:', 'Also known as:')} {article.aliases.join(', ')}</p>
          <p className="lead">{article.summary}</p>
          <div className="article-open-notice">{t('Conteúdo aberto · leitura livre · do básico ao especialista', 'Open content · free reading · fundamentals to expert')}</div>
        </header>

        <section className="article-section" id="visao-geral">
          <h2>{t('Visão geral', 'Overview')}</h2>
          <p>{t(
            'Este artigo apresenta o assunto em níveis progressivos. Não existe bloqueio por curso, ordem obrigatória ou pré-requisito artificial: use o índice lateral para ir diretamente ao ponto necessário.',
            'This article presents the topic in progressive levels. There are no course locks, mandatory ordering, or artificial prerequisites: use the table of contents to jump directly to what you need.'
          )}</p>
          <div className="concept-list large">{article.concepts.map((concept) => <span key={concept}>{concept}</span>)}</div>
        </section>

        <WikiArticleAccordions
          articleSlug={article.slug}
          sections={articlePt.sections}
          sectionsEn={articleEn.sections}
          interviewQuestions={articlePt.interviewQuestions}
          interviewQuestionsEn={articleEn.interviewQuestions}
        />

        {article.slug === 'docker' ? <DockerfileExamples /> : null}
        {article.slug === 'linux' ? <LinuxCommandReference /> : null}
        {article.slug === 'redes' ? <NetworkReference /> : null}
        {hasAutomationReference ? <AutomationIacReference articleSlug={article.slug} /> : null}
        {article.slug === 'aws' ? <AwsReference /> : null}

        <section className="article-section" id="relacionados">
          <h2>{t('Artigos relacionados', 'Related articles')}</h2>
          <div className="related-grid">
            {relatedArticles.map((related) => (
              <HardLink className="related-card" href={`/wiki/${related.slug}/`} key={related.slug}>
                <span>{related.category}</span>
                <strong>{related.title}</strong>
                <p>{related.summary}</p>
              </HardLink>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
