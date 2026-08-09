'use client';

import { useLanguage } from './language-provider';

const codeBasic = `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["server.js"]`;

const codeMulti = `FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
USER node
ENTRYPOINT ["node", "dist/server.js"]`;

const codeEntry = `FROM alpine:3.22
RUN apk add --no-cache curl
ENTRYPOINT ["curl"]
CMD ["--fail", "--show-error", "https://example.com"]`;

const examplesPt = [
  { title: 'Dockerfile básico para uma aplicação Node.js', description: 'Exemplo simples com cache de dependências, usuário não-root e separação clara entre ENTRYPOINT e CMD.', code: codeBasic, notes: [
    ['FROM node:22-alpine', 'Define a imagem base. Fixar uma versão principal reduz mudanças inesperadas; em ambientes rigorosos, use também digest.'],
    ['WORKDIR /app', 'Define o diretório de trabalho para as instruções seguintes e para o processo iniciado no container.'],
    ['COPY package*.json ./', 'Copia primeiro apenas os manifests de dependências. Isso permite reutilizar a camada de npm ci quando o código muda, mas package.json não.'],
    ['RUN npm ci --omit=dev', 'Instala dependências de produção de forma adequada a lockfiles. RUN acontece durante o build e cria uma nova camada.'],
    ['COPY . .', 'Copia o restante do contexto de build para a imagem. Um .dockerignore deve excluir .git, node_modules, secrets e outros arquivos desnecessários.'],
    ['USER node', 'Executa o processo final como usuário não-root fornecido pela imagem base.'],
    ['EXPOSE 3000', 'Documenta a porta usada pela aplicação; não publica a porta automaticamente no host.'],
    ['ENTRYPOINT ["node"]', 'Define o executável principal em exec form. Argumentos passados ao docker run são anexados ao ENTRYPOINT.'],
    ['CMD ["server.js"]', 'Fornece argumentos padrão ao ENTRYPOINT. Pode ser sobrescrito no docker run sem substituir o executável principal.'],
  ]},
  { title: 'Multi-stage build para TypeScript', description: 'O compilador e as dependências de desenvolvimento ficam no stage builder; a imagem final recebe apenas os artefatos necessários.', code: codeMulti, notes: [
    ['FROM ... AS builder', 'Nomeia o primeiro stage. Ele pode conter TypeScript, bundlers, compiladores e dependências que não devem existir em produção.'],
    ['RUN npm ci', 'Instala também dependências de desenvolvimento porque o stage precisa compilar o projeto.'],
    ['RUN npm run build', 'Produz o artefato compilado, por exemplo /app/dist.'],
    ['FROM ... AS runtime', 'Começa uma nova imagem. As camadas do builder não entram automaticamente na imagem final.'],
    ['ENV NODE_ENV=production', 'Define configuração de runtime. Evite usar ENV para segredos porque o valor passa a fazer parte da configuração da imagem/container.'],
    ['RUN npm ci --omit=dev', 'Instala somente dependências necessárias em produção no stage final.'],
    ['COPY --from=builder /app/dist ./dist', 'Copia explicitamente o artefato de outro stage. Essa é a instrução central de um multi-stage build.'],
    ['ENTRYPOINT ["node", "dist/server.js"]', 'Usa exec form para que o processo Node seja iniciado diretamente e receba sinais de forma previsível.'],
  ]},
  { title: 'ENTRYPOINT e CMD trabalhando juntos', description: 'Padrão útil quando existe um executável fixo, mas você quer argumentos padrão facilmente substituíveis.', code: codeEntry, notes: [
    ['ENTRYPOINT ["curl"]', 'Fixa curl como executável principal. docker run imagem -I https://openai.com executaria curl com os novos argumentos.'],
    ['CMD [...]', 'Define os argumentos padrão. Ao informar argumentos após o nome da imagem, o usuário substitui CMD, não ENTRYPOINT.'],
    ['Exec form ["..."]', 'Evita uma shell intermediária. Isso é especialmente importante para sinais, quoting e para processos usados como PID 1 no container.'],
    ['Shell form', 'ENTRYPOINT curl ou CMD curl ... executa por meio de uma shell conforme a plataforma. Pode ser conveniente para expansão de shell, mas muda semântica de sinais e argumentos.'],
  ]},
];

const examplesEn = [
  { title: 'Basic Dockerfile for a Node.js application', description: 'A simple example with dependency caching, a non-root user, and a clear separation between ENTRYPOINT and CMD.', code: codeBasic, notes: [
    ['FROM node:22-alpine', 'Defines the base image. Pinning a major version reduces unexpected change; stricter environments can also pin by digest.'],
    ['WORKDIR /app', 'Sets the working directory for following instructions and for the process started in the container.'],
    ['COPY package*.json ./', 'Copies dependency manifests first so the npm ci layer can be reused when application code changes but package metadata does not.'],
    ['RUN npm ci --omit=dev', 'Installs production dependencies using the lockfile. RUN executes during image build and creates a new layer.'],
    ['COPY . .', 'Copies the remaining build context into the image. A .dockerignore should exclude .git, node_modules, secrets, and other unnecessary files.'],
    ['USER node', 'Runs the final process as the non-root user provided by the base image.'],
    ['EXPOSE 3000', 'Documents the application port; it does not publish the port on the host by itself.'],
    ['ENTRYPOINT ["node"]', 'Defines the primary executable in exec form. Arguments passed to docker run are appended to ENTRYPOINT.'],
    ['CMD ["server.js"]', 'Provides default arguments to ENTRYPOINT. It can be overridden at docker run time without replacing the primary executable.'],
  ]},
  { title: 'Multi-stage build for TypeScript', description: 'The compiler and development dependencies stay in the builder stage; the final image receives only the required artifacts.', code: codeMulti, notes: [
    ['FROM ... AS builder', 'Names the first stage. It can contain TypeScript, bundlers, compilers, and dependencies that should not exist in production.'],
    ['RUN npm ci', 'Installs development dependencies as well because this stage needs to compile the project.'],
    ['RUN npm run build', 'Produces the compiled artifact, for example /app/dist.'],
    ['FROM ... AS runtime', 'Starts a new image stage. Builder layers are not automatically included in the final image.'],
    ['ENV NODE_ENV=production', 'Sets runtime configuration. Do not use ENV for secrets because values become part of image/container configuration.'],
    ['RUN npm ci --omit=dev', 'Installs only the dependencies required in production.'],
    ['COPY --from=builder /app/dist ./dist', 'Explicitly copies an artifact from another stage. This is the central mechanism of a multi-stage build.'],
    ['ENTRYPOINT ["node", "dist/server.js"]', 'Uses exec form so the Node process starts directly and receives signals predictably.'],
  ]},
  { title: 'ENTRYPOINT and CMD working together', description: 'A useful pattern when the executable is fixed but default arguments should be easy to override.', code: codeEntry, notes: [
    ['ENTRYPOINT ["curl"]', 'Fixes curl as the primary executable. docker run image -I https://openai.com runs curl with the new arguments.'],
    ['CMD [...]', 'Defines default arguments. Arguments provided after the image name replace CMD, not ENTRYPOINT.'],
    ['Exec form ["..."]', 'Avoids an intermediate shell. This matters for signals, quoting, and processes running as PID 1.'],
    ['Shell form', 'ENTRYPOINT curl or CMD curl ... executes through a shell according to the platform. It can be useful for shell expansion but changes signal and argument semantics.'],
  ]},
];

export function DockerfileExamples() {
  const { locale, t } = useLanguage();
  const examples = locale === 'en' ? examplesEn : examplesPt;
  return (
    <section className="article-section" id="dockerfile-examples">
      <h2>{t('Exemplos de Dockerfile', 'Dockerfile examples')}</h2>
      <p className="section-summary">{t(
        'Os exemplos priorizam entendimento da semântica das instruções. Ajuste versões, dependências, health checks e política de usuário ao runtime real da aplicação.',
        'The examples prioritize instruction semantics. Adapt versions, dependencies, health checks, and user policy to the real application runtime.'
      )}</p>
      <div className="code-example-list">
        {examples.map((example) => (
          <article className="code-example" key={example.title}>
            <h3>{example.title}</h3><p>{example.description}</p><pre><code>{example.code}</code></pre>
            <div className="instruction-list">{example.notes.map(([instruction, explanation]) => <div className="instruction-row" key={instruction}><code>{instruction}</code><p>{explanation}</p></div>)}</div>
          </article>
        ))}
      </div>
      <p className="technical-source-note">{t('Referência principal: Dockerfile reference e documentação oficial de multi-stage builds do Docker.', 'Primary references: Dockerfile reference and Docker official multi-stage build documentation.')}</p>
    </section>
  );
}
