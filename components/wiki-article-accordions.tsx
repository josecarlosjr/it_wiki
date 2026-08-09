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
import {
  getAutomationIacExtraQuestions,
  getAutomationIacInterviewVisual,
  getAutomationIacSectionDiagram,
} from '@/content/automation-iac-diagrams';
import { getAutomationIacCoreInterviewVisual } from '@/content/automation-iac-interviews';
import { getAwsExtraQuestions, getAwsInterviewVisual, getAwsSectionDiagram } from '@/content/aws-diagrams';
import { extraQuestionEn, localizeVisual, technicalTextEn } from '@/content/i18n-technical';
import { interviewAnswerByQuestionEn } from '@/content/interview-en';
import { TopicDiagram } from './topic-diagram';
import { useLanguage } from './language-provider';

type Props = {
  articleSlug: string;
  sections: WikiSection[];
  sectionsEn?: WikiSection[];
  interviewQuestions: string[];
  interviewQuestionsEn?: string[];
};

function answerFallback(question: string, english: boolean) {
  const normalized = question.toLowerCase();
  if (english) {
    if (normalized.includes('difference')) return 'Define each concept, compare responsibility, state, lifecycle, and the scenario in which each option is appropriate. This answer is still awaiting a subject-specific editorial review.';
    if (normalized.includes('troubleshoot') || normalized.includes('investigate')) return 'Investigate layer by layer, starting from the symptom and its closest dependencies before changing the environment. This answer is still awaiting a subject-specific editorial review.';
    return 'This answer is still under editorial review. No generic diagram is published until the visual representation has been technically validated for this topic.';
  }
  if (normalized.includes('diferença')) return 'Estruture a resposta definindo cada conceito, comparando responsabilidades, estado, ciclo de vida e cenário de uso. Este artigo ainda aguarda uma resposta editorial específica para esta pergunta.';
  if (normalized.includes('como investigar') || normalized.includes('troubleshooting')) return 'Estruture a investigação por camadas, partindo do sintoma e das dependências mais próximas antes de alterar o ambiente. Este artigo ainda aguarda uma resposta editorial específica para esta pergunta.';
  return 'Esta resposta ainda está em revisão editorial. O conteúdo genérico foi mantido apenas como orientação de estrutura; nenhum diagrama é publicado até que a representação técnica seja revisada para este assunto.';
}

function sectionDiagram(articleSlug: string, sectionId: string) {
  return getAwsSectionDiagram(articleSlug, sectionId)
    ?? getAutomationIacSectionDiagram(articleSlug, sectionId)
    ?? getNetworkSecuritySectionDiagram(articleSlug, sectionId)
    ?? getDockerLinuxSectionDiagram(articleSlug, sectionId)
    ?? getSectionDiagram(articleSlug, sectionId);
}

function interviewVisual(articleSlug: string, question: string) {
  return getAwsInterviewVisual(articleSlug, question)
    ?? getAutomationIacCoreInterviewVisual(articleSlug, question)
    ?? getAutomationIacInterviewVisual(articleSlug, question)
    ?? getNetworkSecurityInterviewVisual(articleSlug, question)
    ?? getDockerLinuxInterviewVisual(articleSlug, question)
    ?? getInterviewVisual(articleSlug, question);
}

export function WikiArticleAccordions({ articleSlug, sections, sectionsEn, interviewQuestions, interviewQuestionsEn }: Props) {
  const { locale, t } = useLanguage();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  const activeSections = locale === 'en' && sectionsEn ? sectionsEn : sections;

  const extraPt = useMemo(() => Array.from(new Set([
    ...getNetworkSecurityExtraQuestions(articleSlug),
    ...getAutomationIacExtraQuestions(articleSlug),
    ...getAwsExtraQuestions(articleSlug),
  ])), [articleSlug]);
  const questionsPt = useMemo(() => Array.from(new Set([...interviewQuestions, ...extraPt])), [interviewQuestions, extraPt]);
  const baseEnglishByPt = useMemo(() => Object.fromEntries(interviewQuestions.map((question, index) => [question, interviewQuestionsEn?.[index] ?? technicalTextEn(question)])), [interviewQuestions, interviewQuestionsEn]);

  return (
    <>
      <section className="article-section" aria-labelledby="topicos-heading">
        <h2 id="topicos-heading">{t('Tópicos', 'Topics')}</h2>
        <p className="section-summary">{t(
          'Selecione um tópico para abrir a explicação. Diagramas só são exibidos quando existe uma representação específica revisada para o assunto.',
          'Select a topic to open its explanation. Diagrams are shown only when a subject-specific representation has been technically reviewed.'
        )}</p>
        <div className="interactive-accordion">
          {activeSections.map((section) => {
            const isOpen = openSection === section.id;
            const diagram = sectionDiagram(articleSlug, section.id);
            const level = locale === 'en' ? ({ Fundamentos: 'Fundamentals', Intermediário: 'Intermediate', Avançado: 'Advanced', Especialista: 'Expert' } as const)[section.level] : section.level;
            return (
              <section className="interactive-accordion-item" id={section.id} key={section.id}>
                <button className="interactive-accordion-trigger" type="button" aria-expanded={isOpen} onClick={() => setOpenSection(isOpen ? null : section.id)}>
                  <span><strong>{section.title}</strong><small>{level}</small></span>
                  <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? (
                  <div className="interactive-accordion-content">
                    <p>{section.summary}</p>
                    <ul className="knowledge-list">{section.points.map((point) => <li key={point}>{point}</li>)}</ul>
                    {diagram ? <TopicDiagram spec={diagram} /> : (
                      <div className="diagram-review-note" role="note">{t(
                        'Diagrama temporariamente oculto: este tópico ainda precisa de revisão arquitetural específica.',
                        'Diagram temporarily hidden: this topic still requires subject-specific architectural review.'
                      )}</div>
                    )}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </section>

      <section className="article-section" id="entrevista">
        <h2>{t('Perguntas comuns em entrevistas', 'Common interview questions')}</h2>
        <p className="section-summary">{t(
          'As respostas e representações visuais específicas são publicadas gradualmente após revisão técnica.',
          'Subject-specific answers and visual representations are published after technical review.'
        )}</p>
        <div className="interactive-accordion">
          {questionsPt.map((sourceQuestion, index) => {
            const isOpen = openQuestion === index;
            const question = locale === 'en' ? (baseEnglishByPt[sourceQuestion] ?? extraQuestionEn[sourceQuestion] ?? technicalTextEn(sourceQuestion)) : sourceQuestion;
            const rawVisual = interviewVisual(articleSlug, sourceQuestion);
            const localizedVisual = localizeVisual(rawVisual, locale);
            const visual = localizedVisual && locale === 'en'
              ? { ...localizedVisual, answer: interviewAnswerByQuestionEn[sourceQuestion] ?? localizedVisual.answer }
              : localizedVisual;
            return (
              <section className="interactive-accordion-item" key={sourceQuestion}>
                <button className="interactive-accordion-trigger" type="button" aria-expanded={isOpen} onClick={() => setOpenQuestion(isOpen ? null : index)}>
                  <strong>{question}</strong><span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? (
                  <div className="interactive-accordion-content">
                    <p>{visual?.answer ?? interviewAnswerByQuestionEn[sourceQuestion] ?? answerFallback(question, locale === 'en')}</p>
                    {visual ? <TopicDiagram spec={visual.diagram} /> : (
                      <div className="diagram-review-note" role="note">{t(
                        'Diagrama ainda não publicado para esta pergunta. Evitamos usar um fluxo genérico que possa sugerir uma arquitetura incorreta.',
                        'A diagram has not yet been published for this question. We avoid generic flows that could imply an incorrect architecture.'
                      )}</div>
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
