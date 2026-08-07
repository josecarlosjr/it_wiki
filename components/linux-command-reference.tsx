const groups = [
  {
    title: 'Arquivos, inodes e descritores',
    rows: [
      ['df -h', 'Mostra uso de espaço por filesystem em unidades legíveis. Diagnostica falta de blocos, não falta de inodes.'],
      ['df -i', 'Mostra uso de inodes. É o comando-chave quando há espaço em bytes, mas novos arquivos não podem ser criados.'],
      ['stat arquivo', 'Exibe inode, permissões, tamanho, timestamps e outros metadados do arquivo.'],
      ['lsof /caminho', 'Lista processos que mantêm arquivos abertos sob um caminho ou filesystem.'],
      ['lsof -p <PID>', 'Lista descritores de arquivo de um processo específico.'],
      ['lsof -iTCP -sTCP:LISTEN -nP', 'Mostra processos com sockets TCP em LISTEN sem resolver DNS ou nomes de portas.'],
      ['lsof +L1', 'Ajuda a localizar arquivos removidos do diretório, mas ainda mantidos abertos por algum processo; o espaço pode continuar ocupado até o descritor ser fechado.'],
      ['find /var -xdev -type f | wc -l', 'Conta arquivos no mesmo filesystem. Pode ser caro em árvores muito grandes; use de forma consciente em produção.'],
    ],
  },
  {
    title: 'Processos, memória e carga',
    rows: [
      ['ps -eo pid,ppid,stat,ni,%cpu,%mem,comm --sort=-%cpu', 'Exibe processos com estado, nice, CPU e memória, ordenados por CPU.'],
      ['top / htop', 'Visão interativa de processos, CPU, memória e load average. htop não costuma vir instalado por padrão.'],
      ['free -h', 'Resume memória física e swap. Observe available, não apenas free, porque cache recuperável é utilizável.'],
      ['vmstat 1', 'Amostra processos runnable/bloqueados, memória, swap, I/O, interrupts e CPU a cada segundo.'],
      ['uptime', 'Exibe load average de 1, 5 e 15 minutos além do tempo ligado. Load não equivale diretamente a percentagem de CPU.'],
      ['cat /proc/loadavg', 'Expõe load average e informações adicionais diretamente pelo procfs.'],
      ['ulimit -n', 'Mostra o limite de file descriptors da shell/processo. Limites baixos podem causar falhas em servidores com muitos sockets.'],
    ],
  },
  {
    title: 'Rede e sockets',
    rows: [
      ['ss -lntp', 'Lista sockets TCP em LISTEN e, quando permitido, o processo associado.'],
      ['ss -s', 'Resumo rápido do estado dos sockets TCP/UDP.'],
      ['ip addr', 'Mostra endereços configurados nas interfaces.'],
      ['ip route', 'Mostra a tabela de roteamento usada pelo kernel para decidir o próximo salto.'],
      ['ip link', 'Mostra estado e propriedades das interfaces de camada 2.'],
      ['ip neigh', 'Mostra a tabela de vizinhos, como ARP para IPv4 e Neighbor Discovery para IPv6.'],
    ],
  },
  {
    title: 'Serviços, logs e syscalls',
    rows: [
      ['systemctl status nginx', 'Mostra estado do serviço, PID principal e mensagens recentes quando systemd é usado.'],
      ['journalctl -u nginx --since "1 hour ago"', 'Filtra logs do journal por unit e intervalo de tempo.'],
      ['journalctl -p err..alert -b', 'Mostra mensagens de erro ou mais graves desde o boot atual.'],
      ['strace -p <PID>', 'Anexa a um processo para observar syscalls e sinais. Pode alterar timing e gerar muito output; use com cautela.'],
      ['strace -f -e trace=file,network comando', 'Segue processos filhos e limita a observação a syscalls relacionadas a arquivos e rede.'],
      ['cat /proc/<PID>/status', 'Mostra estado, IDs, memória, capabilities e outras informações de um processo.'],
      ['ls -l /proc/<PID>/fd', 'Mostra os descritores de arquivo de um processo por meio de links simbólicos do procfs.'],
    ],
  },
  {
    title: 'Kernel, I/O e desempenho',
    rows: [
      ['sysctl -a', 'Lista parâmetros do kernel expostos via sysctl. Não altere valores em produção sem hipótese e validação.'],
      ['sysctl net.ipv4.ip_forward', 'Consulta um parâmetro específico do kernel.'],
      ['iostat -xz 1', 'Com sysstat instalado, mostra utilização e latência de dispositivos de bloco em intervalos.'],
      ['pidstat 1', 'Com sysstat instalado, acompanha CPU, I/O e outros dados por processo ao longo do tempo.'],
      ['perf top', 'Amostra hotspots de CPU no sistema ou processo; exige permissões e suporte do kernel adequados.'],
      ['dmesg --level=err,warn', 'Mostra mensagens do ring buffer do kernel filtradas por severidade; permissões podem restringir acesso.'],
    ],
  },
];

const terms = [
  ['Inode', 'Estrutura de metadados de um objeto do filesystem. Nome do arquivo pertence à entrada de diretório; inode guarda metadados e referências aos dados.'],
  ['File descriptor (FD)', 'Número inteiro usado por um processo para referenciar um arquivo aberto, socket, pipe ou outro objeto com interface de arquivo.'],
  ['Zombie process', 'Processo que terminou, mas cuja informação de saída ainda não foi coletada pelo processo pai via wait().'],
  ['D state', 'Estado de espera não interrompível, frequentemente associado a I/O ou espera dentro do kernel. Um grande número pode contribuir para load alto.'],
  ['Load average', 'Métrica de demanda do scheduler que inclui tarefas executáveis e certas tarefas em espera não interrompível; não é simplesmente uso percentual de CPU.'],
  ['/proc', 'Pseudo-filesystem que expõe informações de processos e do kernel. Muitos arquivos são interfaces geradas dinamicamente, não dados persistidos em disco.'],
  ['Namespace', 'Mecanismo do kernel que fornece visões isoladas de recursos, como PIDs, rede, mounts, hostname e usuários.'],
  ['cgroup', 'Mecanismo para organizar processos e aplicar contabilização/controle de recursos como CPU, memória e I/O.'],
  ['Page cache', 'Cache do kernel para conteúdo de arquivos e I/O. Memória usada por cache pode ser recuperada quando aplicações precisam dela.'],
  ['Open-but-deleted file', 'Arquivo cujo nome foi removido, mas que permanece referenciado por um descritor aberto. Os blocos só são liberados quando a última referência é fechada.'],
];

export function LinuxCommandReference() {
  return (
    <section className="article-section" id="linux-commands">
      <h2>Comandos e termos avançados</h2>
      <p className="section-summary">Use os comandos para testar hipóteses. Em produção, prefira observação progressiva antes de comandos que percorrem árvores inteiras, anexam tracers ou alteram parâmetros do kernel.</p>
      <div className="command-group-list">
        {groups.map((group) => (
          <article className="command-group" key={group.title}>
            <h3>{group.title}</h3>
            <div className="command-table">
              {group.rows.map(([command, explanation]) => (
                <div className="command-row" key={command}>
                  <code>{command}</code>
                  <p>{explanation}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <h3>Termos que aparecem em troubleshooting avançado</h3>
      <div className="term-grid">
        {terms.map(([term, explanation]) => (
          <article className="term-card" key={term}>
            <strong>{term}</strong>
            <p>{explanation}</p>
          </article>
        ))}
      </div>
      <p className="technical-source-note">Referências principais: Linux kernel documentation, man7.org e projeto oficial lsof.</p>
    </section>
  );
}
