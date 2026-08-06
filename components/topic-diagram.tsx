type DiagramProps = {
  title: string;
  labels?: string[];
};

export function TopicDiagram({ title, labels = ["Contexto", "Componente", "Validação", "Resultado"] }: DiagramProps) {
  const width = 760;
  const nodeWidth = 150;
  const nodeHeight = 54;
  const gap = 38;
  const startX = 24;
  const y = 56;

  return (
    <figure className="topic-diagram" aria-label={`Diagrama explicativo: ${title}`}>
      <figcaption>{title}</figcaption>
      <svg viewBox={`0 0 ${width} 165`} role="img">
        <defs>
          <marker id="topic-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
          </marker>
        </defs>
        {labels.slice(0, -1).map((_, index) => {
          const x1 = startX + index * (nodeWidth + gap) + nodeWidth;
          const x2 = startX + (index + 1) * (nodeWidth + gap);
          return (
            <line
              className="topic-diagram-edge"
              key={`${index}-${index + 1}`}
              x1={x1}
              y1={y + nodeHeight / 2}
              x2={x2 - 8}
              y2={y + nodeHeight / 2}
              markerEnd="url(#topic-arrow)"
            />
          );
        })}
        {labels.map((label, index) => {
          const x = startX + index * (nodeWidth + gap);
          return (
            <g key={label}>
              <rect className="topic-diagram-node" x={x} y={y} width={nodeWidth} height={nodeHeight} rx="12" />
              <text className="topic-diagram-label" x={x + nodeWidth / 2} y={y + 33} textAnchor="middle">
                {label.length > 19 ? `${label.slice(0, 18)}…` : label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
