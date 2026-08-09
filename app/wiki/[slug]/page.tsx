import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wikiArticleBySlug, wikiArticles, type WikiArticle } from "@/content/wiki";
import { wikiArticleBySlugEn } from "@/content/wiki-en";
import { WikiArticleView } from "@/components/wiki-article-view";

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
  const articleEn = wikiArticleBySlugEn[slug] as WikiArticle | undefined;

  if (!article) return { title: "Article not found / Artigo não encontrado" };

  return {
    title: article.title,
    description: `${articleEn?.summary ?? article.summary} / ${article.summary}`,
  };
}

export default async function WikiArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const articlePt = wikiArticleBySlug[slug];
  const articleEn = wikiArticleBySlugEn[slug] as WikiArticle | undefined;

  if (!articlePt || !articleEn) notFound();

  const relatedPt = articlePt.related
    .map((relatedSlug) => wikiArticleBySlug[relatedSlug])
    .filter((related): related is WikiArticle => Boolean(related));
  const relatedEn = articleEn.related
    .map((relatedSlug) => wikiArticleBySlugEn[relatedSlug] as WikiArticle | undefined)
    .filter((related): related is WikiArticle => Boolean(related));

  return <WikiArticleView articlePt={articlePt} articleEn={articleEn} relatedPt={relatedPt} relatedEn={relatedEn} />;
}
