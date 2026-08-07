import type { DiagramSpec, InterviewVisual } from './diagrams';

type Catalog = {
  sections: Record<string, DiagramSpec>;
  interviews: Record<string, InterviewVisual>;
};

const dockerSources = {
  overview: { label: 'Docker — What is a container?', url: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/' },
  images: { label: 'Docker — Images', url: 'https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/' },
  multiStage: { label: 'Docker — Multi-stage builds', url: 'https://docs.docker.com/build/building/multi-stage/' },
  dockerfile: { label: 'Docker — Dockerfile reference', url: 'https://docs.docker.com/reference/dockerfile/' },
  storage: { label: 'Docker — Storage', url: 'https://docs.docker.com/engine/storage/' },
  security: { label: 'Docker — Seccomp profiles', url: 'https://docs.docker.com/engine/security/seccomp/' },
  attestations: { label: 'Docker — Build attestations', url: 'https://docs.docker.com/build/metadata/attestations/' },
};

const linuxSources = {
  proc: { label: 'Linux kernel — /proc filesystem', url: 'https://docs.kernel.org/filesystems/proc.html' },
  cgroup: { label: 'Linux kernel — cgroup v2', url: 'https://docs.kernel.org/admin-guide/cgroup-v2.html' },
  namespaces: { label: 'man7 — namespaces(7)', url: 'https://man7.org/linux/man-pages/man7/namespaces.7.html' },
  inode: { label: 'man7 — inode(7)', url: 'https://man7.org/linux/man-pages/man7/inode.7.html' },
  lsof: { label: 'lsof project', url: 'https://github.com/lsof-org/lsof' },
  ss: { label: 'man7 — ss(8)', url: 'https://man7.org/linux/man-pages/man8/ss.8.html' },
  strace: { label: 'man7 — strace(1)', url: 'https://man7.org/linux/man-pages/man1/strace.1.html' },
};

const docker: Catalog = {
  sections: {
    fundamentos: {
      title: 'Imagem, container, filesystem e volume',
      description: 'A imagem fornece camadas somente leitura. Ao iniciar um container, o runtime adiciona uma camada gravável efêmera; volumes persistem dados fora dessa camada.',
      width: 1030,
      height: 410,
      nodes: [
        { id: 'registry', label: 'Registry', x: 25, y: 160, kind: 'network' },
        { id: 'image', label: 'Image\nread-only layers', x: 220, y: 160, kind: 'data' },
        { id: 'container', label: 'Container', x: 440, y: 160, kind: 'workload' },
        { id: 'rw', label: 'Writable layer\nephemeral', x: 650, y: 70, kind: 'data' },
        { id: 'volume', label: 'Volume\npersistent data', x: 650, y: 250, kind: 'data' },
        { id: 'process', label: 'Application\nprocess', x: 850, y: 160, kind: 'workload' },
      ],
      edges: [
        { from: 'registry', to: 'image', label: 'pull', animated: true },
        { from: 'image', to: 'container', label: 'create', animated: true },
        { from: 'container', to: 'rw', label: 'writes' },
        { from: 'container', to: 'volume', label: 'mount' },
        { from: 'container', to: 'process', label: 'starts', animated: true },
      ],
      sources: [dockerSources.overview, dockerSources.images, dockerSources.storage],
    },
    builds: {
      title: 'Multi-stage build: builder separado da imagem final',
      description: 'A fase de build contém compiladores e dependências de desenvolvimento. COPY --from transfere somente o artefato necessário para a imagem final, reduzindo tamanho e superfície de ataque.',
      width: 1080,
      height: 430,
      nodes: [
        { id: 'source', label: 'Source code', x: 20, y: 165, kind: 'client' },
        { id: 'builder', label: 'Stage: builder\nSDK + dev deps', x: 220, y: 90, kind: 'workload' },
        { id: 'build', label: 'RUN build', x: 445, y: 90, kind: 'control' },
        { id: 'artifact', label: 'Compiled artifact', x: 650, y: 90, kind: 'data' },
        { id: 'runtime', label: 'Stage: runtime\nminimal base', x: 445, y: 270, kind: 'workload' },
        { id: 'copy', label: 'COPY --from=builder', x: 650, y: 270, kind: 'control' },
        { id: 'final', label: 'Final image\nruntime only', x: 855, y: 180, kind: 'data' },
      ],
      edges: [
        { from: 'source', to: 'builder', animated: true },
        { from: 'builder', to: 'build', animated: true },
        { from: 'build', to: 'artifact' },
        { from: 'runtime', to: 'copy' },
        { from: 'artifact', to: 'copy', label: 'selected files', animated: true },
        { from: 'copy', to: 'final', animated: true },
      ],
      sources: [dockerSources.multiStage, dockerSources.dockerfile],
    },
    runtime: {
      title: 'Isolamento de container no Linux',
      description: 'Containers não possuem um kernel próprio. O processo executa sobre o kernel do host; namespaces isolam visões de recursos, cgroups controlam recursos e mecanismos como capabilities/seccomp reduzem privilégios.',
      width: 1020,
      height: 450,
      nodes: [
        { id: 'app', label: 'Container process', x: 30, y: 175, kind: 'workload' },
        { id: 'ns', label: 'Namespaces\nPID · mount · net · user', x: 250, y: 65, kind: 'security' },
        { id: 'cg', label: 'cgroups\nCPU · memory · I/O', x: 250, y: 175, kind: 'control' },
        { id: 'sec', label: 'Capabilities + seccomp', x: 250, y: 285, kind: 'security' },
        { id: 'kernel', label: 'Host Linux kernel', x: 545, y: 175, kind: 'control' },
        { id: 'hardware', label: 'CPU · RAM · network · storage', x: 785, y: 175, kind: 'data' },
      ],
      edges: [
        { from: 'app', to: 'ns', label: 'isolated view' },
        { from: 'app', to: 'cg', label: 'resource accounting' },
        { from: 'app', to: 'sec', label: 'syscall/privilege policy' },
        { from: 'ns', to: 'kernel' },
        { from: 'cg', to: 'kernel' },
        { from: 'sec', to: 'kernel' },
        { from: 'kernel', to: 'hardware', animated: true },
      ],
      sources: [dockerSources.overview, dockerSources.security, linuxSources.namespaces, linuxSources.cgroup],
    },
    especialista: {
      title: 'Supply chain de uma imagem de produção',
      description: 'Um pipeline maduro associa código, build, imagem imutável, metadados de provenance/SBOM e política de implantação. O digest identifica o conteúdo da imagem independentemente de uma tag mutável.',
      width: 1100,
      height: 360,
      nodes: [
        { id: 'git', label: 'Git commit', x: 20, y: 130, kind: 'client' },
        { id: 'build', label: 'BuildKit / CI', x: 205, y: 130, kind: 'control' },
        { id: 'image', label: 'OCI image', x: 400, y: 60, kind: 'data' },
        { id: 'meta', label: 'SBOM + provenance', x: 400, y: 220, kind: 'security' },
        { id: 'registry', label: 'Registry\nimage@sha256:…', x: 640, y: 130, kind: 'network' },
        { id: 'policy', label: 'Policy / verification', x: 835, y: 130, kind: 'security' },
        { id: 'runtime', label: 'Production runtime', x: 995, y: 130, width: 90, kind: 'workload' },
      ],
      edges: [
        { from: 'git', to: 'build', animated: true },
        { from: 'build', to: 'image' },
        { from: 'build', to: 'meta' },
        { from: 'image', to: 'registry', animated: true },
        { from: 'meta', to: 'registry' },
        { from: 'registry', to: 'policy', label: 'pull by digest' },
        { from: 'policy', to: 'runtime', animated: true },
      ],
      sources: [dockerSources.attestations, dockerSources.images],
    },
  },
  interviews: {
    'Qual é a diferença entre imagem e container?': {
      answer: 'A imagem é um artefato imutável composto por camadas e usado como template. O container é uma instância em execução dessa imagem, com processo, namespaces e uma camada gravável própria. Vários containers podem ser criados a partir do mesmo digest de imagem.',
      diagram: {
        title: 'Uma imagem pode originar vários containers',
        description: 'A imagem é reutilizável; cada container possui identidade de runtime e camada gravável independente.',
        width: 900,
        height: 360,
        nodes: [
          { id: 'image', label: 'Image\nsha256:abc…', x: 40, y: 135, kind: 'data' },
          { id: 'c1', label: 'Container A\nPID + RW layer', x: 340, y: 45, kind: 'workload' },
          { id: 'c2', label: 'Container B\nPID + RW layer', x: 340, y: 145, kind: 'workload' },
          { id: 'c3', label: 'Container C\nPID + RW layer', x: 340, y: 245, kind: 'workload' },
          { id: 'kernel', label: 'Shared host kernel', x: 650, y: 145, kind: 'control' },
        ],
        edges: [
          { from: 'image', to: 'c1' },
          { from: 'image', to: 'c2' },
          { from: 'image', to: 'c3' },
          { from: 'c1', to: 'kernel' },
          { from: 'c2', to: 'kernel' },
          { from: 'c3', to: 'kernel' },
        ],
        sources: [dockerSources.overview, dockerSources.images],
      },
    },
    'Como funciona um multi-stage build?': {
      answer: 'Um Dockerfile pode conter múltiplas instruções FROM. Uma fase de builder compila o código com ferramentas que não precisam existir em produção. A fase final usa COPY --from=<stage> para copiar somente artefatos selecionados, deixando compiladores e dependências de desenvolvimento fora da imagem final.',
      diagram: {
        title: 'Fluxo de um multi-stage build',
        description: 'O artefato atravessa a fronteira entre stages; o toolchain de build não atravessa.',
        width: 920,
        height: 330,
        nodes: [
          { id: 'builder', label: 'FROM node AS builder', x: 25, y: 110, kind: 'workload' },
          { id: 'compile', label: 'RUN npm run build', x: 250, y: 110, kind: 'control' },
          { id: 'dist', label: '/app/dist', x: 455, y: 40, kind: 'data' },
          { id: 'deps', label: 'compiler + dev deps', x: 455, y: 205, kind: 'security' },
          { id: 'runtime', label: 'FROM node:slim', x: 655, y: 110, kind: 'workload' },
          { id: 'final', label: 'Final image', x: 820, y: 110, width: 85, kind: 'data' },
        ],
        edges: [
          { from: 'builder', to: 'compile', animated: true },
          { from: 'compile', to: 'dist' },
          { from: 'compile', to: 'deps' },
          { from: 'dist', to: 'runtime', label: 'COPY --from', animated: true },
          { from: 'runtime', to: 'final' },
        ],
        sources: [dockerSources.multiStage],
      },
    },
    'Por que um container não é equivalente a uma máquina virtual?': {
      answer: 'Uma VM normalmente executa um sistema operacional guest sobre hardware virtualizado por um hypervisor. Um container isola processos usando recursos do kernel do host, como namespaces e cgroups, sem inicializar um kernel guest separado para cada container.',
      diagram: {
        title: 'Container versus máquina virtual',
        description: 'A principal diferença arquitetural é o kernel: containers compartilham o kernel do host; VMs possuem kernel guest próprio.',
        width: 980,
        height: 410,
        nodes: [
          { id: 'container', label: 'Container process', x: 40, y: 55, kind: 'workload' },
          { id: 'runtime', label: 'Container runtime', x: 40, y: 155, kind: 'control' },
          { id: 'hostkernel', label: 'Host kernel', x: 40, y: 255, kind: 'control' },
          { id: 'vmapp', label: 'Application', x: 560, y: 35, kind: 'workload' },
          { id: 'guest', label: 'Guest OS + kernel', x: 560, y: 135, kind: 'control' },
          { id: 'hypervisor', label: 'Hypervisor', x: 560, y: 235, kind: 'control' },
          { id: 'hardware', label: 'Physical hardware', x: 300, y: 335, kind: 'data' },
        ],
        edges: [
          { from: 'container', to: 'runtime' },
          { from: 'runtime', to: 'hostkernel' },
          { from: 'hostkernel', to: 'hardware' },
          { from: 'vmapp', to: 'guest' },
          { from: 'guest', to: 'hypervisor' },
          { from: 'hypervisor', to: 'hardware' },
        ],
        sources: [dockerSources.overview, linuxSources.namespaces, linuxSources.cgroup],
      },
    },
  },
};

const linux: Catalog = {
  sections: {
    fundamentos: {
      title: 'Processo Linux, descritores e interfaces virtuais do kernel',
      description: 'Um processo possui PID e tabela de descritores. Descritores podem referenciar arquivos, pipes ou sockets. /proc expõe informações do processo e do kernel como uma interface virtual.',
      width: 1030,
      height: 420,
      nodes: [
        { id: 'process', label: 'Process\nPID 4242', x: 35, y: 160, kind: 'workload' },
        { id: 'fd', label: 'File descriptor table\n0 · 1 · 2 · 3…', x: 265, y: 65, kind: 'data' },
        { id: 'file', label: 'Regular file', x: 560, y: 25, kind: 'data' },
        { id: 'socket', label: 'Socket', x: 560, y: 115, kind: 'network' },
        { id: 'pipe', label: 'Pipe', x: 560, y: 205, kind: 'data' },
        { id: 'proc', label: '/proc/4242\nstatus · fd · maps', x: 265, y: 285, kind: 'control' },
        { id: 'kernel', label: 'Linux kernel', x: 790, y: 160, kind: 'control' },
      ],
      edges: [
        { from: 'process', to: 'fd' },
        { from: 'fd', to: 'file' },
        { from: 'fd', to: 'socket' },
        { from: 'fd', to: 'pipe' },
        { from: 'process', to: 'proc', label: 'exposed state' },
        { from: 'file', to: 'kernel' },
        { from: 'socket', to: 'kernel' },
        { from: 'pipe', to: 'kernel' },
        { from: 'proc', to: 'kernel', bidirectional: true },
      ],
      sources: [linuxSources.proc],
    },
    recursos: {
      title: 'Filesystem cheio: blocos e inodes são recursos diferentes',
      description: 'Um filesystem pode ficar incapaz de criar novos arquivos mesmo com bytes livres se todos os inodes estiverem alocados. df -h observa capacidade em blocos; df -i observa disponibilidade de inodes.',
      width: 1030,
      height: 400,
      nodes: [
        { id: 'fs', label: 'Filesystem', x: 30, y: 145, kind: 'data' },
        { id: 'blocks', label: 'Data blocks\nbytes capacity', x: 260, y: 60, kind: 'data' },
        { id: 'inodes', label: 'Inode table\nfile metadata', x: 260, y: 235, kind: 'data' },
        { id: 'dfh', label: 'df -h', x: 520, y: 60, kind: 'control' },
        { id: 'dfi', label: 'df -i', x: 520, y: 235, kind: 'control' },
        { id: 'many', label: 'Millions of tiny files', x: 760, y: 235, kind: 'workload' },
        { id: 'fail', label: 'No free inodes\nnew file creation fails', x: 835, y: 60, width: 170, kind: 'decision' },
      ],
      edges: [
        { from: 'fs', to: 'blocks' },
        { from: 'fs', to: 'inodes' },
        { from: 'blocks', to: 'dfh' },
        { from: 'inodes', to: 'dfi' },
        { from: 'many', to: 'inodes', label: 'consumes', animated: true },
        { from: 'inodes', to: 'fail', label: '100% used' },
      ],
      sources: [linuxSources.inode],
    },
    'rede-kernel': {
      title: 'Da aplicação ao socket e à pilha de rede do kernel',
      description: 'Aplicações usam sockets por meio de syscalls. ss consulta informações de sockets no kernel; ip inspeciona endereços, links e rotas que influenciam o caminho do pacote.',
      width: 1050,
      height: 400,
      nodes: [
        { id: 'app', label: 'Application process', x: 25, y: 145, kind: 'workload' },
        { id: 'socket', label: 'Socket FD', x: 235, y: 145, kind: 'network' },
        { id: 'tcp', label: 'TCP / UDP stack', x: 450, y: 145, kind: 'network' },
        { id: 'route', label: 'Routing table', x: 670, y: 65, kind: 'control' },
        { id: 'nic', label: 'Network interface', x: 855, y: 145, kind: 'network' },
        { id: 'ss', label: 'ss -lntp\nss -s', x: 450, y: 270, kind: 'control' },
        { id: 'ip', label: 'ip addr / route / link', x: 670, y: 270, kind: 'control' },
      ],
      edges: [
        { from: 'app', to: 'socket', label: 'read/write' },
        { from: 'socket', to: 'tcp', animated: true },
        { from: 'tcp', to: 'route' },
        { from: 'route', to: 'nic', animated: true },
        { from: 'ss', to: 'tcp', label: 'inspect' },
        { from: 'ip', to: 'route', label: 'inspect/configure' },
        { from: 'ip', to: 'nic', label: 'inspect/configure' },
      ],
      sources: [linuxSources.ss, linuxSources.proc],
    },
    especialista: {
      title: 'Troubleshooting por evidência: processo → syscall → kernel → recurso',
      description: 'Ferramentas avançadas observam camadas diferentes. lsof mapeia descritores, strace observa syscalls, /proc expõe estado e métricas de sistema ajudam a confirmar CPU, memória e I/O antes de uma mudança.',
      width: 1110,
      height: 430,
      nodes: [
        { id: 'symptom', label: 'Symptom\nhigh load / leak / hang', x: 25, y: 165, kind: 'decision' },
        { id: 'process', label: 'Process / PID', x: 240, y: 165, kind: 'workload' },
        { id: 'lsof', label: 'lsof\nopen files + sockets', x: 455, y: 45, kind: 'control' },
        { id: 'strace', label: 'strace\nsyscalls + signals', x: 455, y: 165, kind: 'control' },
        { id: 'proc', label: '/proc/PID\nstatus + fd + maps', x: 455, y: 285, kind: 'control' },
        { id: 'kernel', label: 'Kernel behavior', x: 710, y: 165, kind: 'control' },
        { id: 'metrics', label: 'vmstat / iostat / free / ss', x: 895, y: 165, kind: 'data' },
      ],
      edges: [
        { from: 'symptom', to: 'process', animated: true },
        { from: 'process', to: 'lsof' },
        { from: 'process', to: 'strace' },
        { from: 'process', to: 'proc' },
        { from: 'lsof', to: 'kernel' },
        { from: 'strace', to: 'kernel', animated: true },
        { from: 'proc', to: 'kernel' },
        { from: 'kernel', to: 'metrics' },
      ],
      sources: [linuxSources.lsof, linuxSources.strace, linuxSources.proc],
    },
  },
  interviews: {
    'O que é um inode e como pode causar filesystem cheio?': {
      answer: 'Um inode armazena metadados associados a um objeto do filesystem, como tipo, permissões, ownership, timestamps e referências aos dados. Filesystems possuem uma quantidade finita de inodes. Se muitos arquivos pequenos consumirem todos os inodes, novas criações podem falhar mesmo quando df -h ainda mostra espaço em bytes. Compare df -h com df -i e investigue diretórios com grandes quantidades de arquivos.',
      diagram: {
        title: 'Espaço em bytes livre, mas nenhum inode disponível',
        description: 'Capacidade de dados e capacidade de criar novos objetos são dimensões distintas.',
        width: 960,
        height: 360,
        nodes: [
          { id: 'tiny', label: 'Many small files', x: 30, y: 130, kind: 'workload' },
          { id: 'inode', label: 'Inode table\n100% used', x: 270, y: 60, kind: 'data' },
          { id: 'blocks', label: 'Data blocks\nspace still free', x: 270, y: 220, kind: 'data' },
          { id: 'create', label: 'touch / new file', x: 565, y: 130, kind: 'client' },
          { id: 'error', label: 'Creation fails\nno inode available', x: 775, y: 130, kind: 'decision' },
        ],
        edges: [
          { from: 'tiny', to: 'inode', label: 'consumes' },
          { from: 'create', to: 'inode', label: 'needs inode' },
          { from: 'inode', to: 'error', label: 'exhausted' },
          { from: 'blocks', to: 'error', label: 'bytes are not the limit' },
        ],
        sources: [linuxSources.inode],
      },
    },
    'Qual é a diferença entre processo e thread?': {
      answer: 'Um processo é uma instância de programa com um espaço de endereçamento e conjunto de recursos. Threads pertencentes ao mesmo processo compartilham o espaço de memória e vários recursos do processo, mas possuem contexto de execução próprio, como stack e estado de scheduling. No Linux, threads são representadas por tasks e podem ser observadas em /proc.',
      diagram: {
        title: 'Processo com múltiplas threads',
        description: 'Threads compartilham recursos do processo, mas cada uma possui fluxo de execução próprio.',
        width: 920,
        height: 360,
        nodes: [
          { id: 'process', label: 'Process\naddress space', x: 40, y: 130, kind: 'workload' },
          { id: 'memory', label: 'Shared memory\nheap + mappings', x: 310, y: 45, kind: 'data' },
          { id: 'fds', label: 'Shared file descriptors', x: 310, y: 215, kind: 'data' },
          { id: 't1', label: 'Thread 1\nstack + CPU state', x: 610, y: 25, kind: 'workload' },
          { id: 't2', label: 'Thread 2\nstack + CPU state', x: 610, y: 130, kind: 'workload' },
          { id: 't3', label: 'Thread 3\nstack + CPU state', x: 610, y: 235, kind: 'workload' },
        ],
        edges: [
          { from: 'process', to: 'memory' },
          { from: 'process', to: 'fds' },
          { from: 'memory', to: 't1' },
          { from: 'memory', to: 't2' },
          { from: 'memory', to: 't3' },
          { from: 'fds', to: 't2' },
        ],
        sources: [linuxSources.proc],
      },
    },
    'Como investigar alta carga com CPU aparentemente baixa?': {
      answer: 'Load average não mede apenas percentagem de CPU. Tarefas executáveis e certas tarefas bloqueadas contribuem para a carga. Confirme o padrão com uptime ou /proc/loadavg, veja estados de processos, depois correlacione vmstat, I/O, memória e locks. strace pode ajudar quando um processo específico está bloqueado em syscalls, mas deve ser usado com cuidado em produção.',
      diagram: {
        title: 'Load alto não implica CPU saturada',
        description: 'A investigação separa tarefas que querem CPU de tarefas que estão bloqueadas esperando recursos.',
        width: 1040,
        height: 400,
        nodes: [
          { id: 'load', label: 'High load average', x: 25, y: 145, kind: 'decision' },
          { id: 'run', label: 'Runnable tasks', x: 260, y: 65, kind: 'workload' },
          { id: 'blocked', label: 'Blocked tasks\nI/O / kernel wait', x: 260, y: 235, kind: 'workload' },
          { id: 'cpu', label: 'CPU utilisation', x: 500, y: 65, kind: 'data' },
          { id: 'vmstat', label: 'vmstat / ps / top', x: 500, y: 235, kind: 'control' },
          { id: 'io', label: 'iostat / storage latency', x: 745, y: 235, kind: 'control' },
          { id: 'trace', label: 'strace / process evidence', x: 745, y: 65, kind: 'control' },
        ],
        edges: [
          { from: 'load', to: 'run' },
          { from: 'load', to: 'blocked' },
          { from: 'run', to: 'cpu' },
          { from: 'blocked', to: 'vmstat' },
          { from: 'vmstat', to: 'io' },
          { from: 'cpu', to: 'trace', label: 'identify process' },
          { from: 'vmstat', to: 'trace', label: 'identify process' },
        ],
        sources: [linuxSources.proc, linuxSources.strace],
      },
    },
  },
};

const catalog: Record<string, Catalog> = { docker, linux };

export function getDockerLinuxSectionDiagram(articleSlug: string, sectionId: string) {
  return catalog[articleSlug]?.sections[sectionId];
}

export function getDockerLinuxInterviewVisual(articleSlug: string, question: string) {
  return catalog[articleSlug]?.interviews[question];
}
