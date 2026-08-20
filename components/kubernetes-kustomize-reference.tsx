'use client';

import { useState } from 'react';
import { getKustomizeDiagram, type KustomizeDiagramKey } from '@/content/kubernetes-kustomize-diagrams';
import { useLanguage } from './language-provider';
import { TopicDiagram } from './topic-diagram';

type Card = {
  id: string;
  levelPt: string;
  levelEn: string;
  titlePt: string;
  titleEn: string;
  summaryPt: string;
  summaryEn: string;
  diagram: KustomizeDiagramKey;
  body: (locale: 'pt' | 'en') => React.ReactNode;
};

const basicExample = `# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - service.yaml

namespace: myapp
namePrefix: demo-
labels:
  - pairs:
      app.kubernetes.io/managed-by: kustomize`;

const commandsExample = `# Renderizar sem alterar o cluster
kubectl kustomize ./base

# Aplicar diretamente
kubectl apply -k ./overlays/dev

# Ver diff antes do apply
kubectl diff -k ./overlays/prod`;

const baseExample = `app/
├── base/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays/
    ├── dev/
    │   └── kustomization.yaml
    └── prod/
        ├── kustomization.yaml
        └── replicas-patch.yaml`;

const overlayExample = `# overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - ../../base

namespace: production
namePrefix: prod-

images:
  - name: ghcr.io/company/api
    newTag: "2.4.1"

patches:
  - path: replicas-patch.yaml`;

const patchExample = `# overlays/prod/replicas-patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 5
  template:
    spec:
      containers:
        - name: api
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: "1"
              memory: 512Mi`;

const inlinePatchExample = `patches:
  - target:
      kind: Deployment
      name: api
    patch: |-
      - op: replace
        path: /spec/replicas
        value: 4`;

const generatorExample = `configMapGenerator:
  - name: app-config
    literals:
      - LOG_LEVEL=info
      - FEATURE_X=true

secretGenerator:
  - name: db-credentials
    envs:
      - secrets.env

generatorOptions:
  labels:
    app.kubernetes.io/managed-by: kustomize`;

const replacementExample = `replacements:
  - source:
      kind: Service
      name: api
      fieldPath: metadata.name
    targets:
      - select:
          kind: Deployment
          name: worker
        fieldPaths:
          - spec.template.spec.containers.0.env.0.value`;

const componentExample = `# components/observability/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1alpha1
kind: Component

patches:
  - path: add-otel-sidecar.yaml

# overlays/prod/kustomization.yaml
components:
  - ../../components/observability`;

const gitopsExample = `# CI
kustomize build overlays/prod > rendered.yaml
kubeconform -strict rendered.yaml

# Argo CD Application
spec:
  source:
    repoURL: https://github.com/company/platform.git
    path: apps/api/overlays/prod
    targetRevision: main
  destination:
    namespace: api
    server: https://kubernetes.default.svc`;

const troubleshootingExample = `# Render completo
kustomize build overlays/prod

# Inspecionar uma alteração específica
kustomize build overlays/prod | kubectl diff -f -

# Validar recursos depois da renderização
kustomize build overlays/prod | kubeconform -strict

# Ver o que o kubectl realmente aplicaria
kubectl diff -k overlays/prod`;

function Code({ children }: { children: string }) {
  return <pre className="reference-code"><code>{children}</code></pre>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="kustomize-subtitle">{children}</h3>;
}

const cards: Card[] = [
  {
    id: 'kustomize-fundamentals', levelPt: 'Fundamentos', levelEn: 'Fundamentals',
    titlePt: 'O que é Kustomize e como pensar nele', titleEn: 'What Kustomize is and how to think about it',
    summaryPt: 'Composição declarativa de YAML Kubernetes sem templates.', summaryEn: 'Declarative Kubernetes YAML composition without templating.',
    diagram: 'mental-model',
    body: (locale) => locale === 'en' ? <>
      <p>Kustomize takes normal Kubernetes manifests, combines them through a <code>kustomization.yaml</code>, applies transformations, and produces ordinary Kubernetes YAML. It is built into <code>kubectl</code>, so the two basic commands are <code>kubectl kustomize</code> and <code>kubectl apply -k</code>.</p>
      <SectionTitle>Mental model</SectionTitle>
      <ol className="kustomize-steps"><li><span>1</span><p>Write normal Deployment, Service, ConfigMap, and other Kubernetes resources.</p></li><li><span>2</span><p>List them under <code>resources</code> in <code>kustomization.yaml</code>.</p></li><li><span>3</span><p>Add transformations such as namespace, labels, image changes, patches, or generators.</p></li><li><span>4</span><p>Run <code>kubectl kustomize</code> to inspect the final YAML.</p></li><li><span>5</span><p>Apply the rendered state with <code>kubectl apply -k</code> or let a GitOps controller render it.</p></li></ol>
      <SectionTitle>Minimal example</SectionTitle><Code>{basicExample}</Code><Code>{commandsExample}</Code>
      <div className="reference-note"><strong>Key difference from Helm:</strong> Kustomize primarily transforms existing YAML; Helm primarily renders templates with values. Both can coexist, but they solve different composition problems.</div>
    </> : <>
      <p>Kustomize recebe manifests Kubernetes normais, combina-os através de um <code>kustomization.yaml</code>, aplica transformações e gera YAML Kubernetes comum. Ele já vem integrado ao <code>kubectl</code>; os dois comandos básicos são <code>kubectl kustomize</code> e <code>kubectl apply -k</code>.</p>
      <SectionTitle>Modelo mental</SectionTitle>
      <ol className="kustomize-steps"><li><span>1</span><p>Crie Deployment, Service, ConfigMap e outros recursos Kubernetes normalmente.</p></li><li><span>2</span><p>Liste-os em <code>resources</code> dentro do <code>kustomization.yaml</code>.</p></li><li><span>3</span><p>Adicione transformações como namespace, labels, imagens, patches ou generators.</p></li><li><span>4</span><p>Execute <code>kubectl kustomize</code> para inspecionar o YAML final.</p></li><li><span>5</span><p>Aplique com <code>kubectl apply -k</code> ou deixe um reconciliador GitOps renderizar o diretório.</p></li></ol>
      <SectionTitle>Exemplo mínimo</SectionTitle><Code>{basicExample}</Code><Code>{commandsExample}</Code>
      <div className="reference-note"><strong>Diferença principal para Helm:</strong> Kustomize transforma YAML existente; Helm normalmente renderiza templates parametrizados por values. Os dois podem coexistir, mas resolvem problemas diferentes.</div>
    </>,
  },
  {
    id: 'kustomize-base-overlays', levelPt: 'Intermediário', levelEn: 'Intermediate',
    titlePt: 'Base + overlays para dev, staging e prod', titleEn: 'Base + overlays for dev, staging, and prod',
    summaryPt: 'Reutilize a mesma base e mantenha somente diferenças por ambiente.', summaryEn: 'Reuse one base and keep only environment-specific differences.',
    diagram: 'base-overlays',
    body: (locale) => locale === 'en' ? <>
      <p>The most common Kustomize pattern is a reusable <strong>base</strong> plus small <strong>overlays</strong>. The base holds what every environment shares; each overlay changes only what is different.</p>
      <Code>{baseExample}</Code><SectionTitle>Production overlay</SectionTitle><Code>{overlayExample}</Code>
      <ol className="kustomize-steps"><li><span>1</span><p>The production overlay references <code>../../base</code>.</p></li><li><span>2</span><p>It changes namespace, prefix, image version, and replicas without copying the whole Deployment.</p></li><li><span>3</span><p>Kustomize renders a complete set of production manifests.</p></li></ol>
      <div className="reference-note"><strong>Best practice:</strong> keep the base environment-neutral. If the base contains production-specific hostnames, account IDs, or replica counts, it stops being a useful base.</div>
    </> : <>
      <p>O padrão mais comum do Kustomize é uma <strong>base</strong> reutilizável com pequenos <strong>overlays</strong>. A base contém o que todos os ambientes compartilham; cada overlay guarda apenas as diferenças.</p>
      <Code>{baseExample}</Code><SectionTitle>Overlay de produção</SectionTitle><Code>{overlayExample}</Code>
      <ol className="kustomize-steps"><li><span>1</span><p>O overlay de produção referencia <code>../../base</code>.</p></li><li><span>2</span><p>Ele altera namespace, prefixo, versão da imagem e réplicas sem copiar todo o Deployment.</p></li><li><span>3</span><p>Kustomize renderiza um conjunto completo de manifests de produção.</p></li></ol>
      <div className="reference-note"><strong>Boa prática:</strong> mantenha a base neutra em relação ao ambiente. Se a base contém hostnames, account IDs ou replica counts de produção, ela deixa de ser realmente reutilizável.</div>
    </>,
  },
  {
    id: 'kustomize-patches', levelPt: 'Avançado', levelEn: 'Advanced',
    titlePt: 'Patches, images e transformers', titleEn: 'Patches, images, and transformers',
    summaryPt: 'Altere campos específicos sem duplicar manifests.', summaryEn: 'Change selected fields without duplicating manifests.',
    diagram: 'patches',
    body: (locale) => locale === 'en' ? <>
      <p>Patches are the main tool for specializing a resource without copying it. Prefer small, focused patches that make the environment difference obvious.</p>
      <SectionTitle>Patch file</SectionTitle><Code>{patchExample}</Code><SectionTitle>Inline JSON-style patch</SectionTitle><Code>{inlinePatchExample}</Code>
      <p>The <code>images</code> transformer is preferable to patching the entire container list just to change a tag or digest. Kustomize also supports name prefixes/suffixes, namespaces, labels, annotations, and other built-in transformations.</p>
      <div className="reference-note"><strong>Avoid:</strong> giant patches that effectively replace the entire base. When an overlay overrides almost everything, create a clearer base boundary instead.</div>
    </> : <>
      <p>Patches são a principal ferramenta para especializar um recurso sem copiá-lo. Prefira patches pequenos e focados, deixando evidente qual é a diferença daquele ambiente.</p>
      <SectionTitle>Patch em arquivo</SectionTitle><Code>{patchExample}</Code><SectionTitle>Patch inline estilo JSON</SectionTitle><Code>{inlinePatchExample}</Code>
      <p>Para trocar somente tag ou digest, prefira o transformer <code>images</code> em vez de aplicar patch em toda a lista de containers. Kustomize também suporta prefix/suffix de nomes, namespace, labels, annotations e outras transformações nativas.</p>
      <div className="reference-note"><strong>Evite:</strong> patches gigantes que praticamente substituem toda a base. Se o overlay sobrescreve quase tudo, a fronteira da base provavelmente está errada.</div>
    </>,
  },
  {
    id: 'kustomize-generators', levelPt: 'Avançado', levelEn: 'Advanced',
    titlePt: 'Generators, replacements e components', titleEn: 'Generators, replacements, and components',
    summaryPt: 'Gere configuração, propague valores e componha funcionalidades opcionais.', summaryEn: 'Generate configuration, propagate values, and compose optional features.',
    diagram: 'generators',
    body: (locale) => locale === 'en' ? <>
      <SectionTitle>ConfigMap and Secret generators</SectionTitle><Code>{generatorExample}</Code>
      <p>Generators create Kubernetes objects and normally add a content hash to their names, which helps workloads roll when generated content changes. A generated Secret is still a Kubernetes Secret: base64 encoding is not encryption, so do not put plaintext production secrets in Git.</p>
      <SectionTitle>Replacements</SectionTitle><Code>{replacementExample}</Code>
      <p><code>replacements</code> copies a value from one rendered resource into selected target fields, avoiding duplicated literals.</p>
      <SectionTitle>Components</SectionTitle><Code>{componentExample}</Code>
      <p>A Component is useful for optional cross-cutting behavior such as observability, extra policy, or a sidecar that should be composed into selected overlays rather than every environment.</p>
    </> : <>
      <SectionTitle>ConfigMap e Secret generators</SectionTitle><Code>{generatorExample}</Code>
      <p>Generators criam objetos Kubernetes e normalmente adicionam um hash do conteúdo ao nome, ajudando workloads a fazer rollout quando a configuração muda. Um Secret gerado continua sendo um Kubernetes Secret: base64 não é criptografia; não coloque secrets de produção em plaintext no Git.</p>
      <SectionTitle>Replacements</SectionTitle><Code>{replacementExample}</Code>
      <p><code>replacements</code> copia um valor de um recurso renderizado para campos selecionados de outros recursos, evitando repetir literals.</p>
      <SectionTitle>Components</SectionTitle><Code>{componentExample}</Code>
      <p>Component é útil para comportamento transversal opcional, como observabilidade, policies extras ou sidecars que devem entrar somente em overlays selecionados.</p>
    </>,
  },
  {
    id: 'kustomize-gitops', levelPt: 'Especialista', levelEn: 'Expert',
    titlePt: 'Kustomize em GitOps, CI e produção', titleEn: 'Kustomize in GitOps, CI, and production',
    summaryPt: 'Validação, promoção, drift, segurança e troubleshooting em escala.', summaryEn: 'Validation, promotion, drift, security, and troubleshooting at scale.',
    diagram: 'gitops',
    body: (locale) => locale === 'en' ? <>
      <p>In a mature GitOps flow, Git stores bases and overlays, CI validates the rendered output, and Argo CD or Flux reconciles the selected overlay with the cluster. Kustomize should make environment differences explicit and reviewable.</p>
      <SectionTitle>CI + Argo CD example</SectionTitle><Code>{gitopsExample}</Code>
      <SectionTitle>Production practices</SectionTitle>
      <ul className="knowledge-list"><li>Pin remote bases/modules to immutable revisions instead of silently following a moving branch.</li><li>Promote immutable image digests or controlled tags through overlays.</li><li>Validate rendered YAML with schema/policy tools before merge.</li><li>Keep secrets outside plain Git using an appropriate secret-management workflow.</li><li>Use ownership and state boundaries that keep one overlay understandable; avoid a giant hierarchy of inherited patches.</li><li>Review the rendered diff, not only the source patch.</li></ul>
      <SectionTitle>Troubleshooting</SectionTitle><Code>{troubleshootingExample}</Code>
      <div className="reference-note"><strong>Debug rule:</strong> when the cluster looks wrong, first render the overlay locally. If the rendered YAML is wrong, investigate Kustomize; if the YAML is correct but the cluster is wrong, investigate admission, GitOps reconciliation, Kubernetes controllers, or runtime behavior.</div>
    </> : <>
      <p>Em um fluxo GitOps maduro, Git guarda bases e overlays, CI valida o resultado renderizado e Argo CD ou Flux reconcilia o overlay escolhido com o cluster. Kustomize deve tornar as diferenças entre ambientes explícitas e revisáveis.</p>
      <SectionTitle>Exemplo CI + Argo CD</SectionTitle><Code>{gitopsExample}</Code>
      <SectionTitle>Práticas de produção</SectionTitle>
      <ul className="knowledge-list"><li>Fixe bases remotas em revisões imutáveis em vez de seguir silenciosamente uma branch mutável.</li><li>Promova image digests imutáveis ou tags controladas entre overlays.</li><li>Valide o YAML renderizado com schema/policy tools antes do merge.</li><li>Mantenha secrets fora do Git em plaintext usando um fluxo adequado de secret management.</li><li>Mantenha ownership e hierarquia compreensíveis; evite cadeias enormes de overlays e patches herdados.</li><li>Revise o diff renderizado, não apenas o patch fonte.</li></ul>
      <SectionTitle>Troubleshooting</SectionTitle><Code>{troubleshootingExample}</Code>
      <div className="reference-note"><strong>Regra de diagnóstico:</strong> quando o cluster estiver errado, primeiro renderize o overlay localmente. Se o YAML final estiver errado, investigue Kustomize; se o YAML estiver correto e o cluster errado, investigue admission, reconciliação GitOps, controllers Kubernetes ou runtime.</div>
    </>,
  },
];

export function KubernetesKustomizeReference() {
  const { locale, t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="article-section" id="k8s-kustomize">
      <h2>Kustomize</h2>
      <p className="section-summary">{t(
        'Do YAML básico a overlays, patches, generators, components e GitOps. Kustomize permite reutilizar manifests Kubernetes sem duplicá-los por ambiente.',
        'From basic YAML to overlays, patches, generators, components, and GitOps. Kustomize lets you reuse Kubernetes manifests without duplicating them per environment.'
      )}</p>

      <div className="kustomize-card-grid">
        {cards.map((card) => {
          const open = openId === card.id;
          return (
            <article className={`kustomize-card${open ? ' is-expanded' : ''}`} id={card.id} key={card.id}>
              <button className="kustomize-trigger" type="button" aria-expanded={open} onClick={() => setOpenId(open ? null : card.id)}>
                <span><small>{locale === 'en' ? card.levelEn : card.levelPt}</small><strong>{locale === 'en' ? card.titleEn : card.titlePt}</strong><em>{locale === 'en' ? card.summaryEn : card.summaryPt}</em></span>
                <span aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
              {open ? <div className="kustomize-content">{card.body(locale)}<TopicDiagram spec={getKustomizeDiagram(card.diagram, locale)} /></div> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
