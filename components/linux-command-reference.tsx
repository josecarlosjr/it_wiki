'use client';

import { useLanguage } from './language-provider';

const groupsPt = [
  { title: 'Arquivos, inodes e descritores', rows: [
    ['df -h', 'Mostra uso de espaço por filesystem em unidades legíveis. Diagnostica falta de blocos, não falta de inodes.'], ['df -i', 'Mostra uso de inodes. É o comando-chave quando há espaço em bytes, mas novos arquivos não podem ser criados.'], ['stat arquivo', 'Exibe inode, permissões, tamanho, timestamps e outros metadados do arquivo.'], ['lsof /caminho', 'Lista processos que mantêm arquivos abertos sob um caminho ou filesystem.'], ['lsof -p <PID>', 'Lista descritores de arquivo de um processo específico.'], ['lsof -iTCP -sTCP:LISTEN -nP', 'Mostra processos com sockets TCP em LISTEN sem resolver DNS ou nomes de portas.'], ['lsof +L1', 'Ajuda a localizar arquivos removidos do diretório, mas ainda mantidos abertos por algum processo; o espaço pode continuar ocupado até o descritor ser fechado.'], ['find /var -xdev -type f | wc -l', 'Conta arquivos no mesmo filesystem. Pode ser caro em árvores muito grandes; use de forma consciente em produção.'],
  ]},
  { title: 'Processos, memória e carga', rows: [
    ['ps -eo pid,ppid,stat,ni,%cpu,%mem,comm --sort=-%cpu', 'Exibe processos com estado, nice, CPU e memória, ordenados por CPU.'], ['top / htop', 'Visão interativa de processos, CPU, memória e load average. htop não costuma vir instalado por padrão.'], ['free -h', 'Resume memória física e swap. Observe available, não apenas free, porque cache recuperável é utilizável.'], ['vmstat 1', 'Amostra processos runnable/bloqueados, memória, swap, I/O, interrupts e CPU a cada segundo.'], ['uptime', 'Exibe load average de 1, 5 e 15 minutos além do tempo ligado. Load não equivale diretamente a percentagem de CPU.'], ['cat /proc/loadavg', 'Expõe load average e informações adicionais diretamente pelo procfs.'], ['ulimit -n', 'Mostra o limite de file descriptors da shell/processo. Limites baixos podem causar falhas em servidores com muitos sockets.'],
  ]},
  { title: 'Rede e sockets', rows: [
    ['ss -lntp', 'Lista sockets TCP em LISTEN e, quando permitido, o processo associado.'], ['ss -s', 'Resumo rápido do estado dos sockets TCP/UDP.'], ['ip addr', 'Mostra endereços configurados nas interfaces.'], ['ip route', 'Mostra a tabela de roteamento usada pelo kernel para decidir o próximo salto.'], ['ip link', 'Mostra estado e propriedades das interfaces de camada 2.'], ['ip neigh', 'Mostra a tabela de vizinhos, como ARP para IPv4 e Neighbor Discovery para IPv6.'],
  ]},
  { title: 'Serviços, logs e syscalls', rows: [
    ['systemctl status nginx', 'Mostra estado do serviço, PID principal e mensagens recentes quando systemd é usado.'], ['journalctl -u nginx --since "1 hour ago"', 'Filtra logs do journal por unit e intervalo de tempo.'], ['journalctl -p err..alert -b', 'Mostra mensagens de erro ou mais graves desde o boot atual.'], ['strace -p <PID>', 'Anexa a um processo para observar syscalls e sinais. Pode alterar timing e gerar muito output; use com cautela.'], ['strace -f -e trace=file,network comando', 'Segue processos filhos e limita a observação a syscalls relacionadas a arquivos e rede.'], ['cat /proc/<PID>/status', 'Mostra estado, IDs, memória, capabilities e outras informações de um processo.'], ['ls -l /proc/<PID>/fd', 'Mostra os descritores de arquivo de um processo por meio de links simbólicos do procfs.'],
  ]},
  { title: 'Kernel, I/O e desempenho', rows: [
    ['sysctl -a', 'Lista parâmetros do kernel expostos via sysctl. Não altere valores em produção sem hipótese e validação.'], ['sysctl net.ipv4.ip_forward', 'Consulta um parâmetro específico do kernel.'], ['iostat -xz 1', 'Com sysstat instalado, mostra utilização e latência de dispositivos de bloco em intervalos.'], ['pidstat 1', 'Com sysstat instalado, acompanha CPU, I/O e outros dados por processo ao longo do tempo.'], ['perf top', 'Amostra hotspots de CPU no sistema ou processo; exige permissões e suporte do kernel adequados.'], ['dmesg --level=err,warn', 'Mostra mensagens do ring buffer do kernel filtradas por severidade; permissões podem restringir acesso.'],
  ]},
];

const groupsEn = [
  { title: 'Files, inodes, and descriptors', rows: [
    ['df -h', 'Shows filesystem space usage in human-readable units. It diagnoses block exhaustion, not inode exhaustion.'], ['df -i', 'Shows inode usage. This is the key command when byte capacity remains but new files cannot be created.'], ['stat file', 'Displays inode, permissions, size, timestamps, and other file metadata.'], ['lsof /path', 'Lists processes holding files open under a path or filesystem.'], ['lsof -p <PID>', 'Lists file descriptors opened by a specific process.'], ['lsof -iTCP -sTCP:LISTEN -nP', 'Shows processes with TCP sockets in LISTEN without DNS or service-name resolution.'], ['lsof +L1', 'Finds unlinked files still held open by a process; disk space can remain allocated until the final descriptor closes.'], ['find /var -xdev -type f | wc -l', 'Counts files on the same filesystem. It can be expensive on very large trees, so use it deliberately in production.'],
  ]},
  { title: 'Processes, memory, and load', rows: [
    ['ps -eo pid,ppid,stat,ni,%cpu,%mem,comm --sort=-%cpu', 'Shows process state, nice value, CPU, and memory sorted by CPU usage.'], ['top / htop', 'Interactive view of processes, CPU, memory, and load average. htop is often not installed by default.'], ['free -h', 'Summarizes physical memory and swap. Focus on available rather than only free because reclaimable cache is usable.'], ['vmstat 1', 'Samples runnable/blocked tasks, memory, swap, I/O, interrupts, and CPU every second.'], ['uptime', 'Shows 1, 5, and 15 minute load averages plus uptime. Load is not equivalent to CPU percentage.'], ['cat /proc/loadavg', 'Reads load average and additional scheduler information directly from procfs.'], ['ulimit -n', 'Shows the shell/process file-descriptor limit. Low limits can break servers with many sockets.'],
  ]},
  { title: 'Networking and sockets', rows: [
    ['ss -lntp', 'Lists listening TCP sockets and, when permitted, the owning process.'], ['ss -s', 'Provides a quick summary of TCP/UDP socket state.'], ['ip addr', 'Shows addresses configured on interfaces.'], ['ip route', 'Shows the routing table used by the kernel to select next hops.'], ['ip link', 'Shows Layer 2 interface state and properties.'], ['ip neigh', 'Shows the neighbor table, including ARP for IPv4 and Neighbor Discovery for IPv6.'],
  ]},
  { title: 'Services, logs, and syscalls', rows: [
    ['systemctl status nginx', 'Shows service state, main PID, and recent messages when systemd is used.'], ['journalctl -u nginx --since "1 hour ago"', 'Filters journal entries by unit and time range.'], ['journalctl -p err..alert -b', 'Shows error-or-higher messages from the current boot.'], ['strace -p <PID>', 'Attaches to a process to observe syscalls and signals. It can affect timing and produce large output, so use it carefully.'], ['strace -f -e trace=file,network command', 'Follows child processes and limits tracing to file and network syscalls.'], ['cat /proc/<PID>/status', 'Shows state, IDs, memory, capabilities, and other process information.'], ['ls -l /proc/<PID>/fd', 'Shows process file descriptors through procfs symbolic links.'],
  ]},
  { title: 'Kernel, I/O, and performance', rows: [
    ['sysctl -a', 'Lists kernel parameters exposed through sysctl. Do not change production values without a hypothesis and validation.'], ['sysctl net.ipv4.ip_forward', 'Reads one specific kernel parameter.'], ['iostat -xz 1', 'With sysstat installed, samples utilization and latency for block devices.'], ['pidstat 1', 'With sysstat installed, tracks CPU, I/O, and other per-process data over time.'], ['perf top', 'Samples CPU hotspots in the system or a process; appropriate permissions and kernel support are required.'], ['dmesg --level=err,warn', 'Shows kernel ring-buffer messages filtered by severity; access may be restricted.'],
  ]},
];

const termsPt = [
  ['Inode', 'Estrutura de metadados de um objeto do filesystem. Nome do arquivo pertence à entrada de diretório; inode guarda metadados e referências aos dados.'], ['File descriptor (FD)', 'Número inteiro usado por um processo para referenciar um arquivo aberto, socket, pipe ou outro objeto com interface de arquivo.'], ['Zombie process', 'Processo que terminou, mas cuja informação de saída ainda não foi coletada pelo processo pai via wait().'], ['D state', 'Estado de espera não interrompível, frequentemente associado a I/O ou espera dentro do kernel. Um grande número pode contribuir para load alto.'], ['Load average', 'Métrica de demanda do scheduler que inclui tarefas executáveis e certas tarefas em espera não interrompível; não é simplesmente uso percentual de CPU.'], ['/proc', 'Pseudo-filesystem que expõe informações de processos e do kernel. Muitos arquivos são interfaces geradas dinamicamente, não dados persistidos em disco.'], ['Namespace', 'Mecanismo do kernel que fornece visões isoladas de recursos, como PIDs, rede, mounts, hostname e usuários.'], ['cgroup', 'Mecanismo para organizar processos e aplicar contabilização/controle de recursos como CPU, memória e I/O.'], ['Page cache', 'Cache do kernel para conteúdo de arquivos e I/O. Memória usada por cache pode ser recuperada quando aplicações precisam dela.'], ['Open-but-deleted file', 'Arquivo cujo nome foi removido, mas que permanece referenciado por um descritor aberto. Os blocos só são liberados quando a última referência é fechada.'],
];
const termsEn = [
  ['Inode', 'Filesystem object metadata structure. The filename belongs to the directory entry; the inode stores metadata and references to file data.'], ['File descriptor (FD)', 'Integer used by a process to refer to an open file, socket, pipe, or another file-like object.'], ['Zombie process', 'A process that has exited but whose termination status has not yet been collected by its parent with wait().'], ['D state', 'Uninterruptible sleep, often associated with I/O or waiting inside the kernel. Large numbers of D-state tasks can raise load average.'], ['Load average', 'Scheduler-demand metric that includes runnable tasks and some tasks in uninterruptible sleep; it is not simply CPU utilization percentage.'], ['/proc', 'Pseudo-filesystem exposing process and kernel information. Many entries are dynamically generated interfaces rather than data stored on disk.'], ['Namespace', 'Kernel mechanism providing isolated views of resources such as PIDs, networking, mounts, hostname, and users.'], ['cgroup', 'Kernel mechanism for grouping processes and accounting for or controlling resources such as CPU, memory, and I/O.'], ['Page cache', 'Kernel cache for file content and I/O. Cache memory can be reclaimed when applications need it.'], ['Open-but-deleted file', 'A file whose directory entry was removed but remains referenced by an open descriptor. Blocks are released only when the final reference closes.'],
];

export function LinuxCommandReference() {
  const { locale, t } = useLanguage();
  const groups = locale === 'en' ? groupsEn : groupsPt;
  const terms = locale === 'en' ? termsEn : termsPt;
  return (
    <section className="article-section" id="linux-commands">
      <h2>{t('Comandos e termos avançados', 'Advanced commands and terms')}</h2>
      <p className="section-summary">{t(
        'Use os comandos para testar hipóteses. Em produção, prefira observação progressiva antes de comandos que percorrem árvores inteiras, anexam tracers ou alteram parâmetros do kernel.',
        'Use commands to test hypotheses. In production, prefer progressive observation before commands that scan entire trees, attach tracers, or change kernel parameters.'
      )}</p>
      <div className="command-group-list">{groups.map((group) => <article className="command-group" key={group.title}><h3>{group.title}</h3><div className="command-table">{group.rows.map(([command, explanation]) => <div className="command-row" key={command}><code>{command}</code><p>{explanation}</p></div>)}</div></article>)}</div>
      <h3>{t('Termos que aparecem em troubleshooting avançado', 'Terms that appear in advanced troubleshooting')}</h3>
      <div className="term-grid">{terms.map(([term, explanation]) => <article className="term-card" key={term}><strong>{term}</strong><p>{explanation}</p></article>)}</div>
      <p className="technical-source-note">{t('Referências principais: Linux kernel documentation, man7.org e projeto oficial lsof.', 'Primary references: Linux kernel documentation, man7.org, and the official lsof project.')}</p>
    </section>
  );
}
