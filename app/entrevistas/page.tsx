const questions = [
  {
    question: "Qual a diferença entre readinessProbe e livenessProbe?",
    answer: "Readiness controla se o Pod recebe tráfego. Liveness determina se o container deve ser reiniciado.",
  },
  {
    question: "Por que um Service pode não possuir endpoints?",
    answer: "Selector incompatível, Pods ausentes, Pods não prontos ou labels incorretas são causas comuns.",
  },
  {
    question: "Deployment e StatefulSet resolvem o mesmo problema?",
    answer: "Não. Deployment prioriza réplicas intercambiáveis; StatefulSet preserva identidade e ordenação.",
  },
];

export const metadata = { title: "Entrevistas" };

export default function InterviewPage() {
  return (
    <main className="main">
      <p className="eyebrow">Modo entrevista</p>
      <h1>Responda em camadas</h1>
      <p className="lead">
        Comece com a definição objetiva, aprofunde o mecanismo e finalize com impacto operacional.
      </p>
      <section className="grid section">
        {questions.map((item) => (
          <article className="card" key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
