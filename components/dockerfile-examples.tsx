const examples = [
  {
    title: 'Dockerfile básico para uma aplicação Node.js',
    description: 'Exemplo simples com cache de dependências, usuário não-root e separação clara entre ENTRYPOINT e CMD.',
    code: `FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
USER node
EXPOSE 3000
ENTRYPOINT ["node"]
CMD ["server.js"]`,
    notes: [
      ['FROM node:22-alpine', 'Define a imagem base. Fixar uma versão principal reduz mudanças inesperadas; em ambientes rigorosos, use também digest.'],
      ['WORKDIR /app', 'Define o diretório de trabalho para as instruções seguintes e para o processo iniciado no container.'],
      ['COPY package*.json ./', 'Copia primeiro apenas os manifests de dependências. Isso permite reutilizar a camada de npm ci quando o código muda, mas package.json não.'],
      ['RUN npm ci --omit=dev', 'Instala dependências de produção de forma adequada a lockfiles. RUN acontece durante o build e cria uma nova camada.'],
      ['COPY . .', 'Copia o restante do contexto de build para a imagem. Um .dockerignore deve excluir .git, node_modules, secrets e outros arquivos desnecessários.'],
      ['USER node', 'Executa o processo final como usuário não-root fornecido pela imagem base.'],
      ['EXPOSE 3000', 'Documenta a porta usada pela aplicação; não publica a porta automaticamente no host.'],
      ['ENTRYPOINT ["node"]', 'Define o executável principal em exec form. Argumentos passados ao docker run são anexados ao ENTRYPOINT.'],
      ['CMD ["server.js"]', 'Fornece argumentos padrão ao ENTRYPOINT. Pode ser sobrescrito no docker run sem substituir o executável principal.'],
    ],
  },
  {
    title: 'Multi-stage build para TypeScript',
    description: 'O compilador e as dependências de desenvolvimento ficam no stage builder; a imagem final recebe apenas os artefatos necessários.',
    code: `FROM node:22-alpine AS builder
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
ENTRYPOINT ["node", "dist/server.js"]`,
    notes: [
      ['FROM ... AS builder', 'Nomeia o primeiro stage. Ele pode conter TypeScript, bundlers, compiladores e dependências que não devem existir em produção.'],
      ['RUN npm ci', 'Instala também dependências de desenvolvimento porque o stage precisa compilar o projeto.'],
      ['RUN npm run build', 'Produz o artefato compilado, por exemplo /app/dist.'],
      ['FROM ... AS runtime', 'Começa uma nova imagem. As camadas do builder não entram automaticamente na imagem final.'],
      ['ENV NODE_ENV=production', 'Define configuração de runtime. Evite usar ENV para segredos porque o valor passa a fazer parte da configuração da imagem/container.'],
      ['RUN npm ci --omit=dev', 'Instala somente dependências necessárias em produção no stage final.'],
      ['COPY --from=builder /app/dist ./dist', 'Copia explicitamente o artefato de outro stage. Essa é a instrução central de um multi-stage build.'],
      ['ENTRYPOINT ["node", "dist/server.js"]', 'Usa exec form para que o processo Node seja iniciado diretamente e receba sinais de forma previsível.'],
    ],
  },
  {
    title: 'ENTRYPOINT e CMD trabalhando juntos',
    description: 'Padrão útil quando existe um executável fixo, mas você quer argumentos padrão facilmente substituíveis.',
    code: `FROM alpine:3.22
RUN apk add --no-cache curl
ENTRYPOINT ["curl"]
CMD ["--fail", "--show-error", "https://example.com"]`,
    notes: [
      ['ENTRYPOINT ["curl"]', 'Fixa curl como executável principal. docker run imagem -I https://openai.com executaria curl com os novos argumentos.'],
      ['CMD [...]', 'Define os argumentos padrão. Ao informar argumentos após o nome da imagem, o usuário substitui CMD, não ENTRYPOINT.'],
      ['Exec form ["..."]', 'Evita uma shell intermediária. Isso é especialmente importante para sinais, quoting e para processos usados como PID 1 no container.'],
      ['Shell form', 'ENTRYPOINT curl ou CMD curl ... executa por meio de uma shell conforme a plataforma. Pode ser conveniente para expansão de shell, mas muda semântica de sinais e argumentos.'],
    ],
  },
];

export function DockerfileExamples() {
  return (
    <section className="article-section" id="dockerfile-examples">
      <h2>Exemplos de Dockerfile</h2>
      <p className="section-summary">Os exemplos priorizam entendimento da semântica das instruções. Ajuste versões, dependências, health checks e política de usuário ao runtime real da aplicação.</p>
      <div className="code-example-list">
        {examples.map((example) => (
          <article className="code-example" key={example.title}>
            <h3>{example.title}</h3>
            <p>{example.description}</p>
            <pre><code>{example.code}</code></pre>
            <div className="instruction-list">
              {example.notes.map(([instruction, explanation]) => (
                <div className="instruction-row" key={instruction}>
                  <code>{instruction}</code>
                  <p>{explanation}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="technical-source-note">Referência principal: Dockerfile reference e documentação oficial de multi-stage builds do Docker.</p>
    </section>
  );
}
