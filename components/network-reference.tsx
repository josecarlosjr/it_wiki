'use client';

import { useLanguage } from './language-provider';

const portsPt = [
  ['22/TCP', 'SSH', 'Administração remota segura e tunelamento.'], ['25/TCP', 'SMTP', 'Transferência de e-mail entre servidores.'], ['53/UDP + TCP', 'DNS', 'Resolução de nomes; TCP também é usado em respostas grandes e transferências de zona.'], ['67/68 UDP', 'DHCP', 'Atribuição dinâmica de configuração IPv4 entre servidor e cliente.'], ['80/TCP', 'HTTP', 'Web sem TLS.'], ['110/TCP', 'POP3', 'Acesso legado a caixas de e-mail.'], ['123/UDP', 'NTP', 'Sincronização de tempo.'], ['143/TCP', 'IMAP', 'Acesso a e-mail mantendo mensagens no servidor.'], ['161/162 UDP', 'SNMP', 'Consultas de gestão e traps/notifications.'], ['389/TCP + UDP', 'LDAP', 'Serviço de diretório sem TLS implícito.'], ['443/TCP', 'HTTPS', 'HTTP protegido por TLS.'], ['445/TCP', 'SMB', 'Compartilhamento de ficheiros e serviços Microsoft.'], ['500/UDP', 'IKE / IPsec', 'Negociação de Security Associations para IPsec.'], ['636/TCP', 'LDAPS', 'LDAP sobre TLS implícito.'], ['3389/TCP + UDP', 'RDP', 'Remote Desktop Protocol.'], ['4500/UDP', 'IPsec NAT-T', 'Encapsulamento UDP de ESP quando há NAT no caminho.'],
];
const portsEn = [
  ['22/TCP', 'SSH', 'Secure remote administration and tunneling.'], ['25/TCP', 'SMTP', 'Email transfer between mail servers.'], ['53/UDP + TCP', 'DNS', 'Name resolution; TCP is also used for large responses and zone transfers.'], ['67/68 UDP', 'DHCP', 'Dynamic IPv4 configuration assignment between server and client.'], ['80/TCP', 'HTTP', 'Web traffic without TLS.'], ['110/TCP', 'POP3', 'Legacy mailbox access.'], ['123/UDP', 'NTP', 'Time synchronization.'], ['143/TCP', 'IMAP', 'Mailbox access while messages remain on the server.'], ['161/162 UDP', 'SNMP', 'Management queries and traps/notifications.'], ['389/TCP + UDP', 'LDAP', 'Directory service without implicit TLS.'], ['443/TCP', 'HTTPS', 'HTTP protected by TLS.'], ['445/TCP', 'SMB', 'File sharing and Microsoft network services.'], ['500/UDP', 'IKE / IPsec', 'Security Association negotiation for IPsec.'], ['636/TCP', 'LDAPS', 'LDAP over implicit TLS.'], ['3389/TCP + UDP', 'RDP', 'Remote Desktop Protocol.'], ['4500/UDP', 'IPsec NAT-T', 'UDP encapsulation of ESP when NAT exists on the path.'],
];

const vpnPt = [
  ['Remote-access VPN', 'Conecta um utilizador ou dispositivo individual a uma rede privada. O cliente recebe rotas para prefixos corporativos e normalmente autentica identidade/dispositivo antes de estabelecer o túnel.'],
  ['Site-to-site VPN', 'Conecta duas redes através de gateways. É comum usar IPsec/IKE ou WireGuard. Rotas, prefixos remotos, regras de firewall e caminho de retorno precisam estar corretos nos dois lados.'],
  ['Full tunnel vs split tunnel', 'No full tunnel, o tráfego do cliente é enviado pela VPN. No split tunnel, apenas prefixos definidos usam o túnel. A escolha muda segurança, latência, largura de banda e visibilidade operacional.'],
];
const vpnEn = [
  ['Remote-access VPN', 'Connects an individual user or device to a private network. The client receives routes for corporate prefixes and normally authenticates the user/device before the tunnel is established.'],
  ['Site-to-site VPN', 'Connects two networks through gateways. IPsec/IKE or WireGuard are common choices. Routes, remote prefixes, firewall rules, and the return path must be correct on both sides.'],
  ['Full tunnel vs split tunnel', 'With full tunnel, client traffic is sent through the VPN. With split tunnel, only selected prefixes use the tunnel. The choice changes security, latency, bandwidth usage, and operational visibility.'],
];

const checklistPt = [
  'Confirme que os blocos CIDR não se sobrepõem. Sobreposição torna o encaminhamento ambíguo e frequentemente exige renumbering ou NAT especializado.', 'Defina o mecanismo L3: router dedicado, peering, transit gateway/router, MPLS ou VPN site-to-site.', 'Instale rotas de ida e de retorno. Uma rota apenas num lado gera falhas assimétricas.', 'Libere o tráfego necessário em firewalls, ACLs e security policies. Evite "allow any" como solução permanente.', 'Analise NAT. Em conectividade privada roteada, preserve endereços quando possível; use NAT quando houver necessidade real ou sobreposição inevitável.', 'Valide MTU/MSS quando existe encapsulamento VPN, porque headers adicionais reduzem o payload disponível.', 'Valide DNS separadamente de conectividade IP. Dois hosts podem comunicar por IP e ainda falhar por resolução de nomes.', 'Teste por camadas: ip route, ping quando permitido, traceroute/tracepath, ss, tcpdump e finalmente o cliente de aplicação.',
];
const checklistEn = [
  'Confirm that CIDR blocks do not overlap. Overlap makes routing ambiguous and often requires renumbering or specialized NAT.', 'Choose the Layer 3 mechanism: dedicated router, peering, transit gateway/router, MPLS, or site-to-site VPN.', 'Install forward and return routes. A route on only one side creates asymmetric failures.', 'Allow only the required traffic through firewalls, ACLs, and security policies. Avoid "allow any" as a permanent fix.', 'Review NAT. In routed private connectivity, preserve addresses when possible; use NAT only for a real requirement or unavoidable overlap.', 'Validate MTU/MSS when VPN encapsulation is present because additional headers reduce usable payload size.', 'Validate DNS separately from IP connectivity. Hosts may communicate by IP while name resolution still fails.', 'Test layer by layer: ip route, ping when permitted, traceroute/tracepath, ss, tcpdump, and finally the application client.',
];

export function NetworkReference() {
  const { locale, t } = useLanguage();
  const ports = locale === 'en' ? portsEn : portsPt;
  const vpnTypes = locale === 'en' ? vpnEn : vpnPt;
  const checklist = locale === 'en' ? checklistEn : checklistPt;
  return (
    <div id="network-reference-cards" className="network-security-card-grid">
      <section className="article-section" id="network-vpn">
        <h2>{t('VPN: modelos e pontos de atenção', 'VPN: models and design considerations')}</h2>
        <p className="section-summary">{t('VPN cria conectividade protegida, mas não substitui roteamento e política. O túnel pode estar estabelecido e mesmo assim a aplicação continuar sem acesso por ausência de rota, retorno, regra ou DNS.', 'A VPN creates protected connectivity but does not replace routing or policy. A tunnel can be established while the application still has no access because of missing routes, return paths, rules, or DNS.')}</p>
        <div className="reference-grid">{vpnTypes.map(([title, text]) => <article className="reference-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="reference-note"><strong>IPsec/IKE:</strong> {t('IKEv2 normalmente usa UDP 500. Quando existe NAT no caminho, NAT Traversal encapsula ESP em UDP 4500. ESP é protocolo IP 50 e não possui porta TCP ou UDP.', 'IKEv2 normally uses UDP 500. When NAT exists on the path, NAT Traversal encapsulates ESP in UDP 4500. ESP is IP protocol 50 and does not use a TCP or UDP port.')}</div>
      </section>

      <section className="article-section" id="network-two-networks">
        <h2>{t('Como fazer duas redes se comunicarem', 'How to make two networks communicate')}</h2>
        <p className="section-summary">{t('O objetivo é construir um caminho L3 válido nos dois sentidos e permitir apenas o tráfego necessário.', 'The goal is to build a valid Layer 3 path in both directions and allow only the traffic that is required.')}</p>
        <ol className="network-checklist">{checklist.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol>
        <div className="command-block">
          <div><code>ip route get 10.20.1.10</code><span>{t('Mostra qual rota e interface o kernel usaria para alcançar o destino.', 'Shows which route and interface the kernel would use to reach the destination.')}</span></div>
          <div><code>traceroute 10.20.1.10</code><span>{t('Ajuda a observar saltos L3, embora firewalls possam filtrar respostas.', 'Helps observe Layer 3 hops, although firewalls may filter responses.')}</span></div>
          <div><code>ss -tnp</code><span>{t('Mostra conexões TCP e processos associados.', 'Shows TCP connections and associated processes.')}</span></div>
          <div><code>tcpdump -ni any host 10.20.1.10</code><span>{t('Confirma se pacotes saem, chegam e retornam pela máquina observada.', 'Confirms whether packets leave, arrive, and return through the observed host.')}</span></div>
        </div>
      </section>

      <section className="article-section" id="network-ports">
        <h2>{t('Principais portas e protocolos', 'Key ports and protocols')}</h2>
        <p className="section-summary">{t('Portas pertencem a protocolos de transporte, principalmente TCP e UDP. Protocolos diretamente sobre IP, como ICMP e ESP, não usam portas TCP/UDP.', 'Ports belong to transport protocols, mainly TCP and UDP. Protocols carried directly over IP, such as ICMP and ESP, do not use TCP/UDP ports.')}</p>
        <div className="table-wrap"><table className="reference-table"><thead><tr><th>{t('Porta/transporte', 'Port/transport')}</th><th>{t('Serviço', 'Service')}</th><th>{t('Uso', 'Use')}</th></tr></thead><tbody>{ports.map(([port, service, use]) => <tr key={`${port}-${service}`}><td><code>{port}</code></td><td>{service}</td><td>{use}</td></tr>)}</tbody></table></div>
        <div className="reference-grid compact">
          <article className="reference-card"><h3>ICMP</h3><p>{t('Usado para controlo e diagnóstico IP, incluindo echo request/reply. Não usa porta TCP/UDP.', 'Used for IP control and diagnostics, including echo request/reply. It does not use a TCP/UDP port.')}</p></article>
          <article className="reference-card"><h3>ESP</h3><p>{t('Encapsulating Security Payload é parte de IPsec e usa número de protocolo IP 50, não uma porta.', 'Encapsulating Security Payload is part of IPsec and uses IP protocol number 50, not a port.')}</p></article>
          <article className="reference-card"><h3>GRE</h3><p>{t('Generic Routing Encapsulation usa protocolo IP 47 e encapsula outros protocolos; também não possui porta TCP/UDP.', 'Generic Routing Encapsulation uses IP protocol 47 to encapsulate other protocols; it also has no TCP/UDP port.')}</p></article>
          <article className="reference-card"><h3>BGP</h3><p>{t('Protocolo de roteamento entre sistemas autónomos; usa TCP 179 para estabelecer sessões entre peers.', 'Routing protocol between autonomous systems; it uses TCP 179 to establish peer sessions.')}</p></article>
        </div>
      </section>
    </div>
  );
}
