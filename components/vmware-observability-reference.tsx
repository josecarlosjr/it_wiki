'use client';

import { useState } from 'react';
import { vmwareObservabilityIntegrated } from '@/content/vmware-observability-diagrams';
import { TopicDiagram } from './topic-diagram';
import { ObservabilityTraceWaterfall } from './observability-trace-waterfall';
import { useLanguage } from './language-provider';

type ReferenceCardProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function ReferenceCard({ title, open, onToggle, children }: ReferenceCardProps) {
  return (
    <section className={`vmware-observability-reference-card${open ? ' is-expanded' : ''}`}>
      <button type="button" className="vmware-observability-reference-trigger" aria-expanded={open} onClick={onToggle}>
        <strong>{title}</strong>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="vmware-observability-reference-content">{children}</div> : null}
    </section>
  );
}

export function VmwareObservabilityReference({ articleSlug }: { articleSlug: string }) {
  const { t } = useLanguage();
  const [openCard, setOpenCard] = useState<string | null>(null);
  if (!['vmware', 'observabilidade'].includes(articleSlug)) return null;

  return (
    <section className="article-section" id="vmware-observability-reference">
      <h2>{t('Correlação entre virtualização e observabilidade', 'Correlation between virtualization and observability')}</h2>
      <p className="section-summary">
        {t(
          'O diagnóstico precisa atravessar aplicação, sistema operacional guest, VM, ESXi e infraestrutura física. Use os cards abaixo para abrir apenas a visualização necessária.',
          'Diagnosis needs to cross the application, guest OS, VM, ESXi, and physical infrastructure layers. Use the cards below to open only the visualization you need.'
        )}
      </p>

      <div className="vmware-observability-reference-grid">
        <ReferenceCard
          title={t('Correlação entre aplicação, VM e infraestrutura', 'Application, VM, and infrastructure correlation')}
          open={openCard === 'correlation'}
          onToggle={() => setOpenCard(openCard === 'correlation' ? null : 'correlation')}
        >
          <p>{t(
            'O mesmo sintoma pode nascer na aplicação, no guest OS, na VM, no scheduler do ESXi, no storage ou na rede física. O diagrama organiza essas camadas para evitar conclusões prematuras.',
            'The same symptom can originate in the application, guest OS, VM, ESXi scheduler, storage, or physical network. The diagram organizes those layers to avoid premature conclusions.'
          )}</p>
          <TopicDiagram spec={vmwareObservabilityIntegrated} />
        </ReferenceCard>

        {articleSlug === 'observabilidade' ? (
          <ReferenceCard
            title={t('Trace waterfall e caminho crítico', 'Trace waterfall and critical path')}
            open={openCard === 'trace'}
            onToggle={() => setOpenCard(openCard === 'trace' ? null : 'trace')}
          >
            <p>{t(
              'O waterfall posiciona spans numa linha temporal para mostrar duração, paralelismo, relações parent/child e qual operação domina o caminho crítico da requisição.',
              'The waterfall places spans on a timeline to show duration, parallelism, parent/child relationships, and which operation dominates the request critical path.'
            )}</p>
            <ObservabilityTraceWaterfall />
          </ReferenceCard>
        ) : null}
      </div>
    </section>
  );
}
