'use client';

import { useMemo, useState } from 'react';
import type { WikiSection } from '@/content/wiki';
import { getInterviewVisual, getSectionDiagram } from '@/content/diagrams';
import { getDockerLinuxInterviewVisual, getDockerLinuxSectionDiagram } from '@/content/docker-linux-diagrams';
import {
  getNetworkSecurityExtraQuestions,
  getNetworkSecurityInterviewVisual,
  getNetworkSecuritySectionDiagram,
} from '@/content/network-security-diagrams';
import { TopicDiagram } from './topic-diagram';

type Props = {
  articleSlug: string;
  sections: WikiSection[];
  interviewQuestions: string[];
};

function answerFallback(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes('diferença')) {
    return 'Estruture a resposta definindo cada conceito, comparando responsabilidades, estado, ciclo de vida e cenário de uso. Este artigo ainda aguarda uma resposta editorial específica para esta pergunta.';
  }

  if (normalized.includes('como investigar') || normalized.includes('troubleshooting')) {
    return 'Estruture a investigação por camadas, partindo do sintoma e das dependências mais próximas antes de alterar o ambiente. Este artigo ainda aguarda uma resposta editorial específica para esta pergunta.';
  }

  return 'Esta resposta ainda está em revisão editorial. O conteúdo genérico foi mantido apenas como orientação de estrutura; nenhum diagrama é publicado até que a representação técnica seja revisada para este assunto.';
}

function sectionDiagram(articleSlug: string, sectionId: string) {
  return getNetworkSecuritySectionDiagram(articleSlug, sectionId)
    ?? getDockerLinuxSectionDiagram(articleSlug, sectionId)
    ?? getSectionDiagram(articleSlug, sectionId);
}

function interviewVisual(articleSlug: string, question: string) {
  return getNetworkSecurityInterviewVisual(articleSlug, question)
    ?? getDockerLinuxInterviewVisual(articleSlug, question)
    ?? getInterviewVisual(articleSlug, question);
}

export function WikiArticleAccordions({ articleSlug, sections, interviewQuestions }: Props) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const questions = useMemo(
    () => Array.from(new Set([...interviewQuestions, ...getNetworkSecurityExtraQuestions(articleSlug)])),
    [articleSlug, interviewQuestions],
  );

  return (
    <>
      <section className="article-section" aria-labelledby="topicos-heading">
        <h2 id="topicos-heading">Tópicos</h2>
        <p className="section-summary">Selecione um tópico para abrir a explicação. Diagramas só são exibidos quando existe uma representação específica revisada para o assunto.</p>
        <div className="interactive-accordion">
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            const diagram = sectionDiagram(articleSlug, section.id);
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
                    {diagram ? (
                      <TopicDiagram spec={diagram} />
                    ) : (
                      <div className="diagram-review-note" role="note">
                        Diagrama temporariamente oculto: este tópico ainda precisa de revisão arquitetural específica.
                      </div>
                    )}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </section>

      <section className="article-section" id="entrevista">
        <h2>Perguntas comuns em entrevistas</h2>
        <p className="section-summary">As respostas e representações visuais específicas são publicadas gradualmente após revisão técnica.</p>
        <div className="interactive-accordion">
          {questions.map((question, index) => {
            const isOpen = openQuestion === index;
            const visual = interviewVisual(articleSlug, question);
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
                    <p>{visual?.answer ?? answerFallback(question)}</p>
                    {visual ? (
                      <TopicDiagram spec={visual.diagram} />
                    ) : (
                      <div className="diagram-review-note" role="note">
                        Diagrama ainda não publicado para esta pergunta. Evitamos usar um fluxo genérico que possa sugerir uma arquitetura incorreta.
                      </div>
                    )}
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
