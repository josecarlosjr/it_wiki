# IT_WIKI

Plataforma web educacional para estudo de Kubernetes, cloud, Linux, redes, segurança e sistemas distribuídos, com explicações progressivas e diagramas arquiteturais animados.

## Stack

- Next.js, React e TypeScript
- Mermaid para diagramas declarativos
- React Flow para diagramas interativos
- Pagefind para pesquisa estática
- Nginx unprivileged
- Docker, Helm, Kubernetes e Argo CD
- GitHub Actions e Docker Hub

## Execução local

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
docker build -t it-wiki:local .
docker run --rm -p 8080:8080 it-wiki:local
```

Acesse `http://localhost:8080`.

## CI/CD

### Pull requests

O workflow executa:

1. lint;
2. typecheck;
3. testes;
4. build estático;
5. geração do índice Pagefind;
6. build da imagem Docker.

### Produção

Após merge em `main`:

1. a imagem multi-arquitetura é publicada no Docker Hub;
2. são publicadas as tags `latest` e `sha-<commit>`;
3. `infrastructure/helm/it-wiki/values-prod.yaml` é atualizado com a tag imutável;
4. o GitHub Actions faz commit da referência GitOps;
5. o Argo CD detecta a alteração e sincroniza o Helm chart.

Configure em **Settings → Secrets and variables → Actions**:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

O token deve ter permissão de leitura e escrita no repositório Docker Hub.

## Instalação do Argo CD Application

Antes do primeiro deploy, altere em `infrastructure/argocd/application.yaml`:

- `spec.destination.server`, quando o cluster não for o mesmo do Argo CD;
- domínio em `values-prod.yaml`;
- `cert-manager.io/cluster-issuer`, quando aplicável.

```bash
kubectl apply -f infrastructure/argocd/application.yaml
```

## Estrutura

```text
app/                         interface e rotas
components/                  componentes de aprendizagem e diagramas
content/                     catálogo editorial
infrastructure/helm/         chart Kubernetes
infrastructure/argocd/       Application GitOps
.github/workflows/           CI/CD
```
