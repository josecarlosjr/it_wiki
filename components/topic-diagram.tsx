'use client';

import type { DiagramNode, DiagramSpec } from '@/content/diagrams';
import { localizeDiagram } from '@/content/i18n-technical';
import { localizeVmwareObservabilityDiagram } from '@/content/vmware-observability-i18n';
import { useLanguage } from './language-provider';

type DiagramProps = {
  spec: DiagramSpec;
};

function nodeSize(node: DiagramNode) {
  return { width: node.width ?? 160, height: node.height ?? 58 };
}

function nodeCenter(node: DiagramNode) {
  const { width, height } = nodeSize(node);
  return { x: node.x + width / 2, y: node.y + height / 2 };
}

function edgePoints(from: DiagramNode, to: DiagramNode) {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  const fromSize = nodeSize(from);
  const toSize = nodeSize(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    const direction = dx >= 0 ? 1 : -1;
    return { x1: a.x + direction * fromSize.width / 2, y1: a.y, x2: b.x - direction * toSize.width / 2, y2: b.y };
  }

  const direction = dy >= 0 ? 1 : -1;
  return { x1: a.x, y1: a.y + direction * fromSize.height / 2, x2: b.x, y2: b.y - direction * toSize.height / 2 };
}

function multilineLabel(label: string) {
  return label.split('\n');
}

export function TopicDiagram({ spec }: DiagramProps) {
  const { locale, t } = useLanguage();
  const baseLocalized = localizeDiagram(spec, locale);
  const localized = localizeVmwareObservabilityDiagram(baseLocalized, locale);
  const width = localized.width ?? 920;
  const height = localized.height ?? 420;
  const nodeById = Object.fromEntries(localized.nodes.map((node) => [node.id, node]));
  const markerId = `arrow-${localized.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;

  return (
    <figure className="topic-diagram" aria-label={`${t('Diagrama explicativo', 'Explanatory diagram')}: ${localized.title}`}>
      <figcaption>{localized.title}</figcaption>
      <p className="topic-diagram-description">{localized.description}</p>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${markerId}-title`}>
        <title id={`${markerId}-title`}>{localized.title}</title>
        <defs>
          <marker id={markerId} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
          </marker>
        </defs>

        {localized.edges.map((edge, index) => {
          const from = nodeById[edge.from];
          const to = nodeById[edge.to];
          if (!from || !to) return null;
          const points = edgePoints(from, to);
          const midX = (points.x1 + points.x2) / 2;
          const midY = (points.y1 + points.y2) / 2 - 8;
          return (
            <g key={`${edge.from}-${edge.to}-${index}`}>
              <line className={`topic-diagram-edge${edge.animated ? ' is-animated' : ''}`} {...points} markerEnd={`url(#${markerId})`} markerStart={edge.bidirectional ? `url(#${markerId})` : undefined} />
              {edge.label ? <text className="topic-diagram-edge-label" x={midX} y={midY} textAnchor="middle">{edge.label}</text> : null}
            </g>
          );
        })}

        {localized.nodes.map((node) => {
          const { width: nodeWidth, height: nodeHeight } = nodeSize(node);
          const lines = multilineLabel(node.label);
          const centerX = node.x + nodeWidth / 2;
          const centerY = node.y + nodeHeight / 2;
          return (
            <g className={`topic-diagram-node-group kind-${node.kind ?? 'control'}`} key={node.id}>
              <rect className="topic-diagram-node" x={node.x} y={node.y} width={nodeWidth} height={nodeHeight} rx="12" />
              <text className="topic-diagram-label" x={centerX} y={centerY - ((lines.length - 1) * 8)} textAnchor="middle">
                {lines.map((line, lineIndex) => <tspan x={centerX} dy={lineIndex === 0 ? 0 : 18} key={`${node.id}-${lineIndex}`}>{line}</tspan>)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="topic-diagram-sources">
        <span>{t('Fontes técnicas:', 'Technical sources:')}</span>
        {localized.sources.map((source) => <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}</a>)}
      </div>
    </figure>
  );
}
