'use client';

import { useState } from 'react';
import type { WikiSection } from '@/content/wiki';
import { TopicDiagram } from './topic-diagram';

type Props = {
  sections: WikiSection[];
  interviewQuestions: string[];
};

function answerFor(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes('diferença')) {
    return 'Comece definindo cada conceito, compare responsabilidade, estado, ciclo de vida e cenário de uso. Termine com um exemplo prático e uma limitação de cada alternativa.';
  }

  if (normalized.includes('como investigar') || normalized.includes('troubleshooting')) {
    return 'Estruture a investigação por camadas: confirme o sintoma, verifique estado e eventos, valide dependências, rede e permissões, correlacione logs e métricas e só então altere o ambiente.';
  }

  if (normalized.includes('o que acontece')) {
    return 'Explique o fluxo em ordem temporal: evento inicial, componente que detecta a mudança, reconciliação ou decisão, efeito observável e condições que podem impedir a recuperação.';
  }

  if (normalized.includes('como')) {
    return 'Apresente objetivo, pré-requisitos, sequência de implementação, mecanismos de validação, riscos e estratégia de rollback. Uma resposta forte conecta a decisão ao impacto operacional.';
  }

  return 'Defina o conceito, descreva os componentes envolvidos, explique o fluxo principal e acrescente um exemplo, uma limitação e a forma de validar o comportamento em produção.';
}

function labelsForSection(section: WikiSection) {
  const firstPoint = section.points[0] ?? section.title;
  return ['Entrada', section.title, firstPoint, 'Resultado'];
}

export function WikiArticleAccordions({ sections, interviewQuestions }: Props) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  return (
    <>
      <section className="article-section" aria-labelledby="topicos-heading">
        <h2 id="topicos-heading">Tópicos</h2>
        <p className="section-summary">Selecione um tópico para abrir a explicação detalhada e o diagrama arquitetural.</p>
        <div className="interactive-accordion">
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <section className="interactive-accordion-item" id={section.id} key={section.id}>
                <button
                  className="interactive-accordion-trigger"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenSection(isOpen ? null : section.id)}
                >
                  <span>
                    <strong>{section.title}</strong>
                    <small>{section.level}</small>
                  </span>
                  <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? (
                  <div className="interactive-accordion-content">
                    <p>{section.summary}</p>
                    <ul className="knowledge-list">
                      {section.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                    <TopicDiagram title={section.title} labels={labelsForSection(section)} />
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </section>

      <section className="article-section" id="entrevista">
        <h2>Perguntas comuns em entrevistas</h2>
        <p className="section-summary">Abra cada pergunta para consultar uma estrutura de resposta e um diagrama de raciocínio.</p>
        <div className="interactive-accordion">
          {interviewQuestions.map((question, index) => {
            const isOpen = openQuestion === index;
            return (
              <section className="interactive-accordion-item" key={question}>
                <button
                  className="interactive-accordion-trigger"
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenQuestion(isOpen ? null : index)}
                >
                  <strong>{question}</strong>
                  <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? (
                  <div className="interactive-accordion-content">
                    <p>{answerFor(question)}</p>
                    <TopicDiagram title={question} labels={['Conceito', 'Comparação', 'Exemplo', 'Validação']} />
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
