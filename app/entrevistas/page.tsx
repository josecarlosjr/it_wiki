'use client';

import { useLanguage } from '@/components/language-provider';

const questionsPt = [
  { question: 'Qual a diferença entre readinessProbe e livenessProbe?', answer: 'Readiness controla se o Pod recebe tráfego. Liveness determina se o container deve ser reiniciado.' },
  { question: 'Por que um Service pode não possuir endpoints?', answer: 'Selector incompatível, Pods ausentes, Pods não prontos ou labels incorretas são causas comuns.' },
  { question: 'Deployment e StatefulSet resolvem o mesmo problema?', answer: 'Não. Deployment prioriza réplicas intercambiáveis; StatefulSet preserva identidade e ordenação.' },
];
const questionsEn = [
  { question: 'What is the difference between readinessProbe and livenessProbe?', answer: 'Readiness determines whether a Pod should receive traffic. Liveness determines whether the container should be restarted.' },
  { question: 'Why can a Service have no endpoints?', answer: 'A mismatched selector, missing Pods, Pods that are not Ready, or incorrect labels are common causes.' },
  { question: 'Do Deployment and StatefulSet solve the same problem?', answer: 'No. Deployment prioritizes interchangeable replicas; StatefulSet preserves stable identity and ordering.' },
];

export default function InterviewPage() {
  const { locale, t } = useLanguage();
  const questions = locale === 'en' ? questionsEn : questionsPt;
  return (
    <main className="main">
      <p className="eyebrow">{t('Modo entrevista', 'Interview mode')}</p>
      <h1>{t('Responda em camadas', 'Answer in layers')}</h1>
      <p className="lead">{t('Comece com a definição objetiva, aprofunde o mecanismo e finalize com impacto operacional.', 'Start with a precise definition, explain the mechanism, and finish with operational impact.')}</p>
      <section className="grid section">{questions.map((item) => <article className="card" key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</section>
    </main>
  );
}
