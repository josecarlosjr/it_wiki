import Link from "next/link";
import { BookOpen, Boxes, Network, ShieldCheck } from "lucide-react";
import { wikiArticles, wikiCategories } from "@/content/wiki";

export default function HomePage() {
  const featured = wikiArticles.slice(0, 9);

  return (
    <main className="main">
      <section className="hero wiki-hero">
        <div>
          <p className="eyebrow">Enciclopédia técnica aberta</p>
          <h1>Conhecimento de TI para consulta, não um curso fechado.</h1>
          <p className="lead">
            Pesquise assuntos isoladamente, navegue entre conceitos relacionados e consulte cada
            artigo no nível necessário: fundamentos, intermediário, avançado ou especialista.
          </p>
          <div className="actions">
            <Link className="button primary" href="/wiki/">
              Abrir enciclopédia <BookOpen size={18} />
            </Link>
            <Link className="button" href="/wiki/kubernetes/">Consultar Kubernetes</Link>
          </div>
        </div>

        <aside className="panel wiki-summary">
          <strong>Conteúdo liberado</strong>
          <div className="stat-grid">
            <div className="stat"><strong>{wikiArticles.length}</strong><span>artigos completos</span></div>
            <div className="stat"><strong>{wikiCategories.length}</strong><span>áreas técnicas</span></div>
            <div className="stat"><strong>4</strong><span>níveis por artigo</span></div>
            <div className="stat"><strong>100%</strong><span>acesso aberto</span></div>
          </div>
          <p className="lead">
            Não há aulas bloqueadas, progresso obrigatório ou conteúdo marcado apenas como planejado.
          </p>
        </aside>
      </section>

      <section className="section">
        <div className="category-title">
          <div>
            <p className="eyebrow">Artigos em destaque</p>
            <h2>Consulte diretamente o assunto necessário</h2>
          </div>
          <Link className="read-link" href="/wiki/">Ver índice completo →</Link>
        </div>

        <div className="grid">
          {featured.map((article) => (
            <article className="card wiki-card" key={article.slug}>
              <p className="card-meta">{article.category}</p>
              <Link href={`/wiki/${article.slug}/`}><h3>{article.title}</h3></Link>
              <p>{article.summary}</p>
              <div className="concept-list">
                {article.concepts.slice(0, 4).map((concept) => <span key={concept}>{concept}</span>)}
              </div>
              <Link className="read-link" href={`/wiki/${article.slug}/`}>Abrir artigo →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid">
        <article className="card">
          <Boxes />
          <h3>Do básico ao especialista</h3>
          <p>Cada assunto contém explicação progressiva sem exigir uma sequência de curso.</p>
        </article>
        <article className="card">
          <Network />
          <h3>Conceitos relacionados</h3>
          <p>Links entre artigos ajudam a seguir dependências técnicas e arquiteturais.</p>
        </article>
        <article className="card">
          <ShieldCheck />
          <h3>Uso prático</h3>
          <p>Os artigos incluem operação, troubleshooting e perguntas comuns de entrevistas.</p>
        </article>
      </section>
    </main>
  );
}
