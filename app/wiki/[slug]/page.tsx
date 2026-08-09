import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { wikiArticleBySlug, wikiArticles, type WikiArticle } from "@/content/wiki";
import { WikiArticleAccordions } from "@/components/wiki-article-accordions";
import { DockerfileExamples } from "@/components/dockerfile-examples";
import { LinuxCommandReference } from "@/components/linux-command-reference";
import { NetworkReference } from "@/components/network-reference";
import { AutomationIacReference } from "@/components/automation-iac-reference";
import { AwsReference } from "@/components/aws-reference";

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
  const hasAutomationReference = ["helm", "terraform", "ansible", "cicd"].includes(article.slug);

  return (
    <main className="main wiki-article-layout">
      <aside className="wiki-toc panel" aria-label="Índice do artigo">
        <strong>Conteúdo</strong>
        <a href="#visao-geral">Visão geral</a>
        {article.sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>{section.title}</a>
        ))}
        {article.slug === "docker" ? <a href="#dockerfile-examples">Exemplos de Dockerfile</a> : null}
        {article.slug === "linux" ? <a href="#linux-commands">Comandos avançados</a> : null}
        {article.slug === "redes" ? <a href="#network-vpn">VPN</a> : null}
        {article.slug === "redes" ? <a href="#network-two-networks">Duas redes</a> : null}
        {article.slug === "redes" ? <a href="#network-ports">Portas e protocolos</a> : null}
        {hasAutomationReference ? <a href="#automation-iac-reference">Guia prático</a> : null}
        {article.slug === "aws" ? <a href="#aws-iam">IAM Roles</a> : null}
        {article.slug === "aws" ? <a href="#aws-s3">S3</a> : null}
        {article.slug === "aws" ? <a href="#aws-rds">RDS</a> : null}
        {article.slug === "aws" ? <a href="#aws-lambda">Lambda</a> : null}
        {article.slug === "aws" ? <a href="#aws-ecs">ECS</a> : null}
        {article.slug === "aws" ? <a href="#aws-eks">EKS</a> : null}
        {article.slug === "aws" ? <a href="#aws-messaging">SNS / SQS</a> : null}
        {article.slug === "aws" ? <a href="#aws-vpc-hybrid">VPC híbrida</a> : null}
        {article.slug === "aws" ? <a href="#aws-vpn">AWS VPN</a> : null}
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
          articleSlug={article.slug}
          sections={article.sections}
          interviewQuestions={article.interviewQuestions}
        />

        {article.slug === "docker" ? <DockerfileExamples /> : null}
        {article.slug === "linux" ? <LinuxCommandReference /> : null}
        {article.slug === "redes" ? <NetworkReference /> : null}
        {hasAutomationReference ? <AutomationIacReference articleSlug={article.slug} /> : null}
        {article.slug === "aws" ? <AwsReference /> : null}

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
