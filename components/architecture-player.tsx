"use client";

import { useMemo, useState } from "react";
import { Background, Controls, MarkerType, ReactFlow, type Edge, type Node } from "@xyflow/react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import { useLanguage } from "./language-provider";

const stepData = [
  { pt: "1. O browser envia uma requisição HTTPS.", en: "1. The browser sends an HTTPS request.", nodes: ["browser"], edges: ["browser-ingress"] },
  { pt: "2. O Ingress aplica a regra de host e path.", en: "2. Ingress applies the host and path rule.", nodes: ["ingress"], edges: ["ingress-service"] },
  { pt: "3. O Service escolhe um endpoint saudável.", en: "3. The Service selects a healthy endpoint.", nodes: ["service"], edges: ["service-pod-a"] },
  { pt: "4. O Pod processa e devolve a resposta.", en: "4. The Pod processes the request and returns the response.", nodes: ["pod-a"], edges: [] },
];

const baseNodes: Node[] = [
  { id: "browser", position: { x: 20, y: 145 }, data: { label: "Browser" }, type: "input" },
  { id: "ingress", position: { x: 235, y: 145 }, data: { label: "Ingress" } },
  { id: "service", position: { x: 450, y: 145 }, data: { label: "Service" } },
  { id: "pod-a", position: { x: 675, y: 70 }, data: { label: "Pod A" }, type: "output" },
  { id: "pod-b", position: { x: 675, y: 220 }, data: { label: "Pod B" }, type: "output" },
];

const baseEdges: Edge[] = [
  { id: "browser-ingress", source: "browser", target: "ingress", label: "HTTPS", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "ingress-service", source: "ingress", target: "service", label: "HTTP", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "service-pod-a", source: "service", target: "pod-a", markerEnd: { type: MarkerType.ArrowClosed } },
  { id: "service-pod-b", source: "service", target: "pod-b", markerEnd: { type: MarkerType.ArrowClosed } },
];

export function ArchitecturePlayer() {
  const { locale, t } = useLanguage();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const nodes = useMemo(() => baseNodes.map((node) => ({ ...node, style: { background: stepData[step].nodes.includes(node.id) ? "#58a6ff" : "#12243a", color: stepData[step].nodes.includes(node.id) ? "#04101f" : "#edf4ff", border: "1px solid #38516f", borderRadius: 10, fontWeight: 700 } })), [step]);
  const edges = useMemo(() => baseEdges.map((edge) => ({ ...edge, animated: playing || stepData[step].edges.includes(edge.id), style: { stroke: stepData[step].edges.includes(edge.id) ? "#4ade80" : "#46617f", strokeWidth: stepData[step].edges.includes(edge.id) ? 3 : 1.5 } })), [playing, step]);

  function next() { setStep((current) => (current + 1) % stepData.length); }

  return (
    <div>
      <div className="diagram" aria-label={t('Fluxo de uma requisição no Kubernetes', 'Kubernetes request flow')}>
        <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false} nodesConnectable={false}><Background /><Controls showInteractive={false} /></ReactFlow>
      </div>
      <div className="controls">
        <button onClick={() => setPlaying((value) => !value)} type="button">{playing ? <Pause size={16} /> : <Play size={16} />} {playing ? t('Pausar', 'Pause') : t('Animar', 'Animate')}</button>
        <button onClick={next} type="button"><StepForward size={16} /> {t('Próximo', 'Next')}</button>
        <button onClick={() => { setStep(0); setPlaying(false); }} type="button"><RotateCcw size={16} /> {t('Reiniciar', 'Reset')}</button>
        <span className="step-copy">{locale === 'en' ? stepData[step].en : stepData[step].pt}</span>
      </div>
    </div>
  );
}
