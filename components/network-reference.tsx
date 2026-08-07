const ports = [
  ['22/TCP', 'SSH', 'Administração remota segura e tunelamento.'],
  ['25/TCP', 'SMTP', 'Transferência de e-mail entre servidores.'],
  ['53/UDP + TCP', 'DNS', 'Resolução de nomes; TCP também é usado em respostas grandes e transferências de zona.'],
  ['67/68 UDP', 'DHCP', 'Atribuição dinâmica de configuração IPv4 entre servidor e cliente.'],
  ['80/TCP', 'HTTP', 'Web sem TLS.'],
  ['110/TCP', 'POP3', 'Acesso legado a caixas de e-mail.'],
  ['123/UDP', 'NTP', 'Sincronização de tempo.'],
  ['143/TCP', 'IMAP', 'Acesso a e-mail mantendo mensagens no servidor.'],
  ['161/162 UDP', 'SNMP', 'Consultas de gestão e traps/notifications.'],
  ['389/TCP + UDP', 'LDAP', 'Serviço de diretório sem TLS implícito.'],
  ['443/TCP', 'HTTPS', 'HTTP protegido por TLS.'],
  ['445/TCP', 'SMB', 'Compartilhamento de ficheiros e serviços Microsoft.'],
  ['500/UDP', 'IKE / IPsec', 'Negociação de Security Associations para IPsec.'],
  ['636/TCP', 'LDAPS', 'LDAP sobre TLS implícito.'],
  ['3389/TCP + UDP', 'RDP', 'Remote Desktop Protocol.'],
  ['4500/UDP', 'IPsec NAT-T', 'Encapsulamento UDP de ESP quando há NAT no caminho.'],
];

const vpnTypes = [
  {
    title: 'Remote-access VPN',
    text: 'Conecta um utilizador ou dispositivo individual a uma rede privada. O cliente recebe rotas para prefixos corporativos e normalmente autentica identidade/dispositivo antes de estabelecer o túnel.',
  },
  {
    title: 'Site-to-site VPN',
    text: 'Conecta duas redes através de gateways. É comum usar IPsec/IKE ou WireGuard. Rotas, prefixos remotos, regras de firewall e caminho de retorno precisam estar corretos nos dois lados.',
  },
  {
    title: 'Full tunnel vs split tunnel',
    text: 'No full tunnel, o tráfego do cliente é enviado pela VPN. No split tunnel, apenas prefixos definidos usam o túnel. A escolha muda segurança, latência, largura de banda e visibilidade operacional.',
  },
];

const checklist = [
  'Confirme que os blocos CIDR não se sobrepõem. Sobreposição torna o encaminhamento ambíguo e frequentemente exige renumbering ou NAT especializado.',
  'Defina o mecanismo L3: router dedicado, peering, transit gateway/router, MPLS ou VPN site-to-site.',
  'Instale rotas de ida e de retorno. Uma rota apenas num lado gera falhas assimétricas.',
  'Libere o tráfego necessário em firewalls, ACLs e security policies. Evite "allow any" como solução permanente.',
  'Analise NAT. Em conectividade privada roteada, preserve endereços quando possível; use NAT quando houver necessidade real ou sobreposição inevitável.',
  'Valide MTU/MSS quando existe encapsulamento VPN, porque headers adicionais reduzem o payload disponível.',
  'Valide DNS separadamente de conectividade IP. Dois hosts podem comunicar por IP e ainda falhar por resolução de nomes.',
  'Teste por camadas: ip route, ping quando permitido, traceroute/tracepath, ss, tcpdump e finalmente o cliente de aplicação.',
];

export function NetworkReference() {
  return (
    <>
      <section className="article-section" id="network-vpn">
        <h2>VPN: modelos e pontos de atenção</h2>
        <p className="section-summary">
          VPN cria conectividade protegida, mas não substitui roteamento e política. O túnel pode estar estabelecido e mesmo assim a aplicação continuar sem acesso por ausência de rota, retorno, regra ou DNS.
        </p>
        <div className="reference-grid">
          {vpnTypes.map((item) => (
            <article className="reference-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="reference-note">
          <strong>IPsec/IKE:</strong> IKEv2 normalmente usa UDP 500. Quando existe NAT no caminho, NAT Traversal encapsula ESP em UDP 4500. ESP é protocolo IP 50 e não possui porta TCP ou UDP.
        </div>
      </section>

      <section className="article-section" id="network-two-networks">
        <h2>Como fazer duas redes se comunicarem</h2>
        <p className="section-summary">
          O objetivo é construir um caminho L3 válido nos dois sentidos e permitir apenas o tráfego necessário.
        </p>
        <ol className="network-checklist">
          {checklist.map((item, index) => (
            <li key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
        <div className="command-block">
          <div><code>ip route get 10.20.1.10</code><span>Mostra qual rota e interface o kernel usaria para alcançar o destino.</span></div>
          <div><code>traceroute 10.20.1.10</code><span>Ajuda a observar saltos L3, embora firewalls possam filtrar respostas.</span></div>
          <div><code>ss -tnp</code><span>Mostra conexões TCP e processos associados.</span></div>
          <div><code>tcpdump -ni any host 10.20.1.10</code><span>Confirma se pacotes saem, chegam e retornam pela máquina observada.</span></div>
        </div>
      </section>

      <section className="article-section" id="network-ports">
        <h2>Principais portas e protocolos</h2>
        <p className="section-summary">
          Portas pertencem a protocolos de transporte, principalmente TCP e UDP. Protocolos diretamente sobre IP, como ICMP e ESP, não usam portas TCP/UDP.
        </p>
        <div className="table-wrap">
          <table className="reference-table">
            <thead>
              <tr><th>Porta/transporte</th><th>Serviço</th><th>Uso</th></tr>
            </thead>
            <tbody>
              {ports.map(([port, service, use]) => (
                <tr key={`${port}-${service}`}><td><code>{port}</code></td><td>{service}</td><td>{use}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="reference-grid compact">
          <article className="reference-card"><h3>ICMP</h3><p>Usado para controlo e diagnóstico IP, incluindo echo request/reply. Não usa porta TCP/UDP.</p></article>
          <article className="reference-card"><h3>ESP</h3><p>Encapsulating Security Payload é parte de IPsec e usa número de protocolo IP 50, não uma porta.</p></article>
          <article className="reference-card"><h3>GRE</h3><p>Generic Routing Encapsulation usa protocolo IP 47 e encapsula outros protocolos; também não possui porta TCP/UDP.</p></article>
          <article className="reference-card"><h3>BGP</h3><p>Protocolo de roteamento entre sistemas autónomos; usa TCP 179 para estabelecer sessões entre peers.</p></article>
        </div>
      </section>
    </>
  );
}
