'use client';

import { useLanguage } from './language-provider';

const spans = [
  { service: 'Frontend', start: 0, duration: 100, label: 'GET /checkout' },
  { service: 'API', start: 10, duration: 76, label: 'POST /order' },
  { service: 'Auth', start: 18, duration: 14, label: 'validate token' },
  { service: 'Database', start: 38, duration: 33, label: 'INSERT order' },
  { service: 'Payment', start: 72, duration: 24, label: 'charge' },
];

export function ObservabilityTraceWaterfall() {
  const { t } = useLanguage();

  return (
    <figure className="topic-diagram" id="trace-waterfall" aria-label={t('Trace waterfall de uma requisição distribuída', 'Distributed request trace waterfall')}>
      <figcaption>{t('Trace waterfall: spans, duração e caminho crítico', 'Trace waterfall: spans, duration, and critical path')}</figcaption>
      <p className="topic-diagram-description">
        {t(
          'Cada barra representa um span dentro do mesmo trace. A posição horizontal mostra quando o span começou; o comprimento mostra sua duração. Isso permite localizar dependências lentas e o caminho crítico da requisição.',
          'Each bar represents a span within the same trace. Horizontal position shows when the span started; bar length shows its duration. This makes slow dependencies and the request critical path visible.'
        )}
      </p>

      <div style={{ display: 'grid', gap: '.55rem', marginTop: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '.8rem', color: 'var(--muted)', fontSize: '.8rem' }}>
          <span>{t('Serviço', 'Service')}</span>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>0 ms</span><span>50 ms</span><span>100 ms</span></div>
        </div>
        {spans.map((span) => (
          <div key={`${span.service}-${span.label}`} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '.8rem', alignItems: 'center' }}>
            <strong style={{ fontSize: '.88rem' }}>{span.service}</strong>
            <div style={{ position: 'relative', height: '34px', border: '1px solid var(--line)', borderRadius: '.55rem', background: 'rgba(7,17,31,.55)', overflow: 'hidden' }}>
              <div
                title={`${span.label}: ${span.duration} ms`}
                style={{
                  position: 'absolute',
                  left: `${span.start}%`,
                  width: `${span.duration}%`,
                  top: '5px',
                  bottom: '5px',
                  borderRadius: '.4rem',
                  background: 'var(--brand)',
                  color: '#04101f',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 .5rem',
                  fontSize: '.72rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {span.label} · {span.duration} ms
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="topic-diagram-sources" style={{ marginTop: '1rem' }}>
        <span>{t('Fonte técnica:', 'Technical source:')}</span>
        <a href="https://opentelemetry.io/docs/concepts/signals/traces/" target="_blank" rel="noreferrer">OpenTelemetry — Traces</a>
      </div>
    </figure>
  );
}
