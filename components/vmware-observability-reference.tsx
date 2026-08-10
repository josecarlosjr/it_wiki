'use client';

import { vmwareObservabilityIntegrated } from '@/content/vmware-observability-diagrams';
import { TopicDiagram } from './topic-diagram';
import { ObservabilityTraceWaterfall } from './observability-trace-waterfall';
import { useLanguage } from './language-provider';

export function VmwareObservabilityReference({ articleSlug }: { articleSlug: string }) {
  const { t } = useLanguage();
  if (!['vmware', 'observabilidade'].includes(articleSlug)) return null;

  return (
    <section className="article-section" id="vmware-observability-reference">
      <h2>{t('Correlação entre virtualização e observabilidade', 'Correlation between virtualization and observability')}</h2>
      <p className="section-summary">
        {t(
          'O diagnóstico precisa atravessar aplicação, sistema operacional guest, VM, ESXi e infraestrutura física. Esse modelo ajuda a separar um sintoma dentro da VM de uma causa localizada no hypervisor, storage ou rede.',
          'Diagnosis needs to cross the application, guest OS, VM, ESXi, and physical infrastructure layers. This model helps separate a symptom seen inside the VM from a cause located in the hypervisor, storage, or network.'
        )}
      </p>
      <TopicDiagram spec={vmwareObservabilityIntegrated} />
      {articleSlug === 'observabilidade' ? <ObservabilityTraceWaterfall /> : null}
    </section>
  );
}
