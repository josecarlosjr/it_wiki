import type { DiagramSpec, InterviewVisual } from './diagrams';

type Catalog = {
  sections: Record<string, DiagramSpec>;
  interviews: Record<string, InterviewVisual>;
  extraQuestions?: string[];
};

const networkSources = {
  ianaPorts: { label: 'IANA — Service Name and Port Number Registry', url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml' },
  rfc1918: { label: 'RFC 1918 — Private Address Space', url: 'https://www.rfc-editor.org/rfc/rfc1918' },
  routing: { label: 'RFC 1812 — IPv4 Router Requirements', url: 'https://www.rfc-editor.org/rfc/rfc1812' },
  ikev2: { label: 'RFC 7296 — IKEv2', url: 'https://www.rfc-editor.org/rfc/rfc7296' },
  ipsecNat: { label: 'RFC 3948 — UDP Encapsulation of IPsec ESP', url: 'https://www.rfc-editor.org/rfc/rfc3948' },
  wireguard: { label: 'WireGuard — Quick Start', url: 'https://www.wireguard.com/quickstart/' },
  dns: { label: 'RFC 1035 — DNS', url: 'https://www.rfc-editor.org/rfc/rfc1035' },
  tcp: { label: 'RFC 9293 — TCP', url: 'https://www.rfc-editor.org/rfc/rfc9293' },
  udp: { label: 'RFC 768 — UDP', url: 'https://www.rfc-editor.org/rfc/rfc768' },
};

const securitySources = {
  tls: { label: 'RFC 8446 — TLS 1.3', url: 'https://www.rfc-editor.org/rfc/rfc8446' },
  oauth: { label: 'RFC 6749 — OAuth 2.0', url: 'https://www.rfc-editor.org/rfc/rfc6749' },
  oidc: { label: 'OpenID Connect Core 1.0', url: 'https://openid.net/specs/openid-connect-core-1_0.html' },
  zeroTrust: { label: 'NIST SP 800-207 — Zero Trust Architecture', url: 'https://csrc.nist.gov/pubs/sp/800/207/final' },
  nistIncident: { label: 'NIST SP 800-61 — Incident Response', url: 'https://csrc.nist.gov/pubs/sp/800/61/r2/final' },
};

const redes: Catalog = {
  sections: {
    fundamentos: {
      title: 'Comunicação local e roteada entre hosts',
      description: 'Dentro da mesma subnet, hosts resolvem o próximo salto local e trocam frames. Para outra subnet, o host envia o pacote ao default gateway; routers encaminham com base na tabela de rotas até a rede de destino.',
      width: 1080,
      height: 410,
      nodes: [
        { id: 'hostA', label: 'Host A\n10.10.1.10/24', x: 25, y: 150, kind: 'client' },
        { id: 'lanA', label: 'LAN A\n10.10.1.0/24', x: 220, y: 150, kind: 'network' },
        { id: 'gwA', label: 'Gateway A\n10.10.1.1', x: 420, y: 150, kind: 'network' },
        { id: 'router', label: 'Router / L3', x: 620, y: 150, kind: 'control' },
        { id: 'lanB', label: 'LAN B\n10.20.1.0/24', x: 805, y: 150, kind: 'network' },
        { id: 'hostB', label: 'Host B\n10.20.1.20/24', x: 995, y: 150, width: 75, kind: 'client' },
      ],
      edges: [
        { from: 'hostA', to: 'lanA', label: 'frame', animated: true },
        { from: 'lanA', to: 'gwA', label: 'default gateway', animated: true },
        { from: 'gwA', to: 'router', label: 'IP forwarding', animated: true },
        { from: 'router', to: 'lanB', label: 'route match', animated: true },
        { from: 'lanB', to: 'hostB', label: 'local delivery', animated: true },
      ],
      sources: [networkSources.routing, networkSources.rfc1918],
    },
    transporte: {
      title: 'Do nome DNS à sessão de aplicação',
      description: 'Uma aplicação pode resolver um nome via DNS, abrir uma sessão TCP quando o protocolo exige transporte confiável e então trocar dados de aplicação. UDP remove o estabelecimento de conexão e entrega datagramas sem as garantias de TCP.',
      width: 1060,
      height: 420,
      nodes: [
        { id: 'client', label: 'Application client', x: 20, y: 165, kind: 'client' },
        { id: 'dns', label: 'DNS resolver\nUDP/TCP 53', x: 220, y: 55, kind: 'network' },
        { id: 'ip', label: 'Destination IP', x: 430, y: 55, kind: 'data' },
        { id: 'tcp', label: 'TCP session\nSYN → SYN/ACK → ACK', x: 430, y: 220, kind: 'control' },
        { id: 'udp', label: 'UDP datagram\nno handshake', x: 650, y: 305, kind: 'network' },
        { id: 'app', label: 'Application protocol\nHTTP · SSH · SMTP · etc.', x: 715, y: 135, kind: 'workload' },
        { id: 'server', label: 'Server socket', x: 930, y: 135, width: 105, kind: 'workload' },
      ],
      edges: [
        { from: 'client', to: 'dns', label: 'query name', animated: true },
        { from: 'dns', to: 'ip', label: 'A / AAAA' },
        { from: 'ip', to: 'tcp', label: 'connect' },
        { from: 'tcp', to: 'app', label: 'reliable byte stream', animated: true },
        { from: 'client', to: 'udp', label: 'datagram' },
        { from: 'udp', to: 'server', label: 'UDP service' },
        { from: 'app', to: 'server', label: 'request / response', animated: true },
      ],
      sources: [networkSources.dns, networkSources.tcp, networkSources.udp, networkSources.ianaPorts],
    },
    infraestrutura: {
      title: 'Duas redes comunicando-se por roteamento ou VPN site-to-site',
      description: 'Para duas redes distintas se comunicarem, cada lado precisa conhecer a rota para a rede remota e os dispositivos de segurança devem permitir o tráfego. Quando há Internet entre os sites, um túnel VPN pode transportar os pacotes privados de forma protegida.',
      width: 1120,
      height: 450,
      nodes: [
        { id: 'lanA', label: 'Rede A\n10.10.0.0/16', x: 20, y: 170, kind: 'network' },
        { id: 'fwA', label: 'Router / Firewall A', x: 225, y: 170, kind: 'security' },
        { id: 'vpnA', label: 'VPN endpoint A', x: 430, y: 105, kind: 'security' },
        { id: 'internet', label: 'Internet / WAN', x: 635, y: 105, kind: 'network' },
        { id: 'vpnB', label: 'VPN endpoint B', x: 830, y: 105, kind: 'security' },
        { id: 'fwB', label: 'Router / Firewall B', x: 830, y: 255, kind: 'security' },
        { id: 'lanB', label: 'Rede B\n10.20.0.0/16', x: 1010, y: 255, width: 95, kind: 'network' },
        { id: 'routeA', label: 'Route: 10.20.0.0/16\nvia tunnel', x: 220, y: 315, kind: 'decision' },
        { id: 'routeB', label: 'Route: 10.10.0.0/16\nvia tunnel', x: 610, y: 315, kind: 'decision' },
      ],
      edges: [
        { from: 'lanA', to: 'fwA', animated: true },
        { from: 'fwA', to: 'vpnA', label: 'remote subnet' },
        { from: 'vpnA', to: 'internet', label: 'encrypted tunnel', animated: true },
        { from: 'internet', to: 'vpnB', animated: true },
        { from: 'vpnB', to: 'fwB', label: 'decapsulate' },
        { from: 'fwB', to: 'lanB', animated: true },
        { from: 'routeA', to: 'fwA', label: 'forward path' },
        { from: 'routeB', to: 'fwB', label: 'return path' },
      ],
      sources: [networkSources.routing, networkSources.ikev2, networkSources.ipsecNat, networkSources.wireguard],
    },
    especialista: {
      title: 'Troubleshooting por camadas: rota, política, transporte e aplicação',
      description: 'Uma investigação eficiente verifica primeiro endereçamento e rota, depois políticas de firewall/NAT, estados de transporte e finalmente o protocolo de aplicação. Ferramentas como ping, traceroute, ip route, ss, tcpdump e dig ajudam a separar as camadas.',
      width: 1080,
      height: 390,
      nodes: [
        { id: 'symptom', label: 'Sintoma\n"não conecta"', x: 20, y: 145, kind: 'client' },
        { id: 'route', label: 'IP + route\nip addr / ip route', x: 210, y: 55, kind: 'decision' },
        { id: 'policy', label: 'Firewall / NAT\nrules + counters', x: 430, y: 55, kind: 'security' },
        { id: 'transport', label: 'TCP/UDP\nss + tcpdump', x: 650, y: 55, kind: 'control' },
        { id: 'dns', label: 'DNS\ndig / resolv.conf', x: 430, y: 235, kind: 'network' },
        { id: 'app', label: 'Application\ncurl / protocol logs', x: 860, y: 145, kind: 'workload' },
      ],
      edges: [
        { from: 'symptom', to: 'route', animated: true },
        { from: 'route', to: 'policy', label: 'path exists' },
        { from: 'policy', to: 'transport', label: 'allowed' },
        { from: 'transport', to: 'app', label: 'session established' },
        { from: 'symptom', to: 'dns', label: 'name-based failure' },
        { from: 'dns', to: 'app', label: 'resolved endpoint' },
      ],
      sources: [networkSources.routing, networkSources.dns, networkSources.tcp, networkSources.udp],
    },
  },
  interviews: {
    'Como funciona uma VPN site-to-site e o que precisa estar correto para duas redes se comunicarem?': {
      answer: 'Uma VPN site-to-site cria uma associação protegida entre gateways de redes distintas. Para o tráfego funcionar, os prefixos locais e remotos devem ser definidos corretamente, não devem se sobrepor de forma ambígua, cada lado precisa encaminhar a rede remota para o túnel e as políticas de firewall devem permitir o tráfego. Também é necessário validar o caminho de retorno, MTU e, conforme a tecnologia, negociação de chaves e encapsulamento.',
      diagram: {
        title: 'VPN site-to-site com roteamento bidirecional',
        description: 'O túnel sozinho não cria conectividade completa: rotas e políticas precisam existir nos dois sentidos.',
        width: 1040,
        height: 380,
        nodes: [
          { id: 'a', label: '10.10.0.0/16', x: 20, y: 135, kind: 'network' },
          { id: 'ga', label: 'Gateway A', x: 220, y: 135, kind: 'security' },
          { id: 'tun', label: 'IPsec / WireGuard\nencrypted tunnel', x: 430, y: 135, kind: 'security' },
          { id: 'gb', label: 'Gateway B', x: 680, y: 135, kind: 'security' },
          { id: 'b', label: '10.20.0.0/16', x: 870, y: 135, kind: 'network' },
          { id: 'ra', label: 'route 10.20.0.0/16', x: 210, y: 265, kind: 'decision' },
          { id: 'rb', label: 'route 10.10.0.0/16', x: 665, y: 265, kind: 'decision' },
        ],
        edges: [
          { from: 'a', to: 'ga', animated: true },
          { from: 'ga', to: 'tun', animated: true },
          { from: 'tun', to: 'gb', animated: true },
          { from: 'gb', to: 'b', animated: true },
          { from: 'ra', to: 'ga' },
          { from: 'rb', to: 'gb' },
        ],
        sources: [networkSources.ikev2, networkSources.wireguard, networkSources.routing],
      },
    },
    'Como você faria duas redes diferentes se comunicarem?': {
      answer: 'Primeiro confirme que os blocos de endereçamento não se sobrepõem. Em seguida escolha o mecanismo de conectividade — roteamento direto, peering, transit router ou VPN — e adicione rotas nos dois sentidos. Depois ajuste firewalls/ACLs, valide NAT quando aplicável, confirme DNS se os sistemas usam nomes e teste o caminho de ida e volta. Em ambientes dinâmicos, protocolos de roteamento podem substituir rotas estáticas.',
      diagram: {
        title: 'Checklist de comunicação entre duas redes',
        description: 'Conectividade exige caminho de ida, caminho de retorno e política permissiva; apenas criar um link entre redes não é suficiente.',
        width: 1030,
        height: 390,
        nodes: [
          { id: 'address', label: '1. Prefixos\nsem overlap', x: 25, y: 135, kind: 'decision' },
          { id: 'connect', label: '2. Conectividade L3\nrouter / peering / VPN', x: 230, y: 135, kind: 'network' },
          { id: 'routes', label: '3. Rotas\nida + retorno', x: 470, y: 135, kind: 'control' },
          { id: 'policy', label: '4. Firewall / ACL', x: 675, y: 135, kind: 'security' },
          { id: 'test', label: '5. Validar\nping · traceroute · tcpdump', x: 860, y: 135, kind: 'workload' },
        ],
        edges: [
          { from: 'address', to: 'connect', animated: true },
          { from: 'connect', to: 'routes', animated: true },
          { from: 'routes', to: 'policy', animated: true },
          { from: 'policy', to: 'test', animated: true },
        ],
        sources: [networkSources.rfc1918, networkSources.routing],
      },
    },
    'Quais portas e protocolos de rede você considera essenciais conhecer em uma entrevista?': {
      answer: 'É mais importante entender serviço, transporte e direção do tráfego do que apenas memorizar números. Um conjunto básico inclui SSH 22/TCP, DNS 53/UDP e TCP, HTTP 80/TCP, HTTPS 443/TCP, SMTP 25/TCP, DHCP 67/68 UDP, NTP 123/UDP, SNMP 161/162 UDP, LDAP 389, LDAPS 636, SMB 445/TCP, RDP 3389/TCP e UDP, além de IKE 500/UDP e IPsec NAT traversal 4500/UDP. ICMP e ESP são protocolos IP e não usam portas TCP/UDP.',
      diagram: {
        title: 'Porta pertence ao transporte; nem todo protocolo usa porta',
        description: 'Serviços de aplicação normalmente usam TCP ou UDP. Protocolos como ICMP e ESP ficam diretamente sobre IP e portanto não possuem porta TCP/UDP.',
        width: 980,
        height: 400,
        nodes: [
          { id: 'app', label: 'Application services\nDNS · HTTPS · SSH · SMTP', x: 25, y: 80, kind: 'workload' },
          { id: 'tcp', label: 'TCP\nports', x: 335, y: 40, kind: 'control' },
          { id: 'udp', label: 'UDP\nports', x: 335, y: 150, kind: 'network' },
          { id: 'ip', label: 'IP', x: 610, y: 100, kind: 'network' },
          { id: 'icmp', label: 'ICMP\nno TCP/UDP port', x: 790, y: 40, kind: 'decision' },
          { id: 'esp', label: 'ESP (IPsec)\nIP protocol 50', x: 790, y: 170, kind: 'security' },
        ],
        edges: [
          { from: 'app', to: 'tcp' },
          { from: 'app', to: 'udp' },
          { from: 'tcp', to: 'ip' },
          { from: 'udp', to: 'ip' },
          { from: 'ip', to: 'icmp' },
          { from: 'ip', to: 'esp' },
        ],
        sources: [networkSources.ianaPorts, networkSources.ikev2, networkSources.ipsecNat],
      },
    },
  },
  extraQuestions: [
    'Como funciona uma VPN site-to-site e o que precisa estar correto para duas redes se comunicarem?',
    'Como você faria duas redes diferentes se comunicarem?',
    'Quais portas e protocolos de rede você considera essenciais conhecer em uma entrevista?',
  ],
};

const seguranca: Catalog = {
  sections: {
    fundamentos: {
      title: 'Identidade, autorização e proteção de dados',
      description: 'Segurança combina controles complementares: autenticação estabelece quem é a identidade, autorização limita o que ela pode fazer e criptografia protege dados em trânsito ou repouso.',
      width: 1020,
      height: 390,
      nodes: [
        { id: 'user', label: 'User / workload', x: 25, y: 135, kind: 'client' },
        { id: 'authn', label: 'Authentication\nWho are you?', x: 230, y: 55, kind: 'security' },
        { id: 'authz', label: 'Authorization\nWhat can you do?', x: 455, y: 55, kind: 'security' },
        { id: 'resource', label: 'Protected resource', x: 700, y: 55, kind: 'workload' },
        { id: 'transit', label: 'Encryption in transit', x: 455, y: 230, kind: 'security' },
        { id: 'rest', label: 'Encryption at rest', x: 700, y: 230, kind: 'data' },
      ],
      edges: [
        { from: 'user', to: 'authn', animated: true },
        { from: 'authn', to: 'authz', animated: true },
        { from: 'authz', to: 'resource', animated: true },
        { from: 'user', to: 'transit', label: 'protected channel' },
        { from: 'transit', to: 'resource' },
        { from: 'resource', to: 'rest', label: 'stored data' },
      ],
      sources: [securitySources.zeroTrust, securitySources.tls],
    },
    protocolos: {
      title: 'TLS 1.3: autenticação do servidor e estabelecimento de chaves',
      description: 'No handshake TLS 1.3, cliente e servidor negociam parâmetros criptográficos e derivam chaves de tráfego. O servidor normalmente apresenta um certificado para provar sua identidade antes do canal de aplicação protegido.',
      width: 1040,
      height: 420,
      nodes: [
        { id: 'client', label: 'Client', x: 25, y: 145, kind: 'client' },
        { id: 'hello', label: 'ClientHello\nkey share', x: 210, y: 60, kind: 'control' },
        { id: 'server', label: 'ServerHello\nkey share', x: 430, y: 60, kind: 'control' },
        { id: 'cert', label: 'Certificate +\nCertificateVerify', x: 650, y: 60, kind: 'security' },
        { id: 'finished', label: 'Finished', x: 850, y: 60, kind: 'security' },
        { id: 'keys', label: 'Traffic keys', x: 430, y: 245, kind: 'data' },
        { id: 'https', label: 'Encrypted application data', x: 720, y: 245, kind: 'workload' },
      ],
      edges: [
        { from: 'client', to: 'hello', animated: true },
        { from: 'hello', to: 'server', animated: true },
        { from: 'server', to: 'cert', animated: true },
        { from: 'cert', to: 'finished', animated: true },
        { from: 'server', to: 'keys', label: 'derive secrets' },
        { from: 'finished', to: 'https', label: 'handshake complete' },
        { from: 'keys', to: 'https', animated: true },
      ],
      sources: [securitySources.tls],
    },
    arquitetura: {
      title: 'Arquitetura em camadas: edge, identidade, aplicação e secrets',
      description: 'Uma arquitetura segura combina segmentação e controles em diferentes pontos. WAF/firewall reduzem exposição no edge, identidade limita acesso, workloads ficam segmentados e segredos são obtidos de um sistema dedicado em vez de embutidos em código.',
      width: 1100,
      height: 430,
      nodes: [
        { id: 'internet', label: 'Internet / clients', x: 20, y: 155, kind: 'client' },
        { id: 'edge', label: 'WAF / Firewall', x: 210, y: 155, kind: 'security' },
        { id: 'idp', label: 'Identity Provider', x: 420, y: 55, kind: 'security' },
        { id: 'app', label: 'Application', x: 455, y: 210, kind: 'workload' },
        { id: 'secrets', label: 'Secrets manager', x: 680, y: 55, kind: 'security' },
        { id: 'db', label: 'Data store', x: 700, y: 220, kind: 'data' },
        { id: 'audit', label: 'Central audit logs', x: 900, y: 220, kind: 'data' },
      ],
      edges: [
        { from: 'internet', to: 'edge', animated: true },
        { from: 'edge', to: 'app', animated: true },
        { from: 'app', to: 'idp', label: 'authenticate / token' },
        { from: 'app', to: 'secrets', label: 'workload identity' },
        { from: 'app', to: 'db', label: 'least privilege' },
        { from: 'edge', to: 'audit' },
        { from: 'app', to: 'audit' },
        { from: 'idp', to: 'audit' },
      ],
      sources: [securitySources.zeroTrust, securitySources.oauth, securitySources.oidc],
    },
    especialista: {
      title: 'Zero Trust: decisão de acesso baseada em identidade e contexto',
      description: 'Zero Trust não considera a localização de rede como prova suficiente de confiança. Cada acesso é avaliado usando identidade, política e contexto, com privilégio mínimo e monitorização contínua.',
      width: 1050,
      height: 400,
      nodes: [
        { id: 'subject', label: 'User / workload', x: 25, y: 145, kind: 'client' },
        { id: 'context', label: 'Identity + device +\ncontext signals', x: 230, y: 55, kind: 'data' },
        { id: 'policy', label: 'Policy decision', x: 475, y: 145, kind: 'decision' },
        { id: 'allow', label: 'Scoped access', x: 715, y: 55, kind: 'security' },
        { id: 'deny', label: 'Deny / challenge', x: 715, y: 235, kind: 'security' },
        { id: 'resource', label: 'Specific resource', x: 900, y: 55, kind: 'workload' },
        { id: 'telemetry', label: 'Continuous telemetry', x: 460, y: 285, kind: 'data' },
      ],
      edges: [
        { from: 'subject', to: 'context', animated: true },
        { from: 'context', to: 'policy' },
        { from: 'policy', to: 'allow', label: 'policy satisfied' },
        { from: 'policy', to: 'deny', label: 'policy failed' },
        { from: 'allow', to: 'resource', animated: true },
        { from: 'telemetry', to: 'policy', label: 'context update' },
      ],
      sources: [securitySources.zeroTrust],
    },
  },
  interviews: {
    'Qual é a diferença entre OAuth 2.0 e OpenID Connect?': {
      answer: 'OAuth 2.0 é um framework de autorização: permite que um cliente obtenha acesso delegado a recursos com escopos definidos. OpenID Connect adiciona uma camada de identidade sobre OAuth 2.0, incluindo o ID Token e endpoints/claims voltados à autenticação do utilizador.',
      diagram: {
        title: 'OAuth 2.0 autoriza; OpenID Connect adiciona identidade',
        description: 'O access token é usado para acessar recursos protegidos. Em OIDC, o ID Token carrega afirmações sobre a autenticação e identidade do utilizador.',
        width: 1030,
        height: 380,
        nodes: [
          { id: 'user', label: 'End user', x: 25, y: 130, kind: 'client' },
          { id: 'client', label: 'Client application', x: 220, y: 130, kind: 'workload' },
          { id: 'as', label: 'Authorization Server / OP', x: 450, y: 70, kind: 'security' },
          { id: 'access', label: 'Access Token\nOAuth 2.0', x: 675, y: 50, kind: 'data' },
          { id: 'idtoken', label: 'ID Token\nOIDC', x: 675, y: 205, kind: 'data' },
          { id: 'api', label: 'Protected API', x: 875, y: 50, kind: 'workload' },
        ],
        edges: [
          { from: 'user', to: 'client', animated: true },
          { from: 'client', to: 'as', label: 'authorization request' },
          { from: 'as', to: 'access', label: 'authorization' },
          { from: 'as', to: 'idtoken', label: 'identity when OIDC' },
          { from: 'access', to: 'api', animated: true },
          { from: 'idtoken', to: 'client', label: 'authenticated identity' },
        ],
        sources: [securitySources.oauth, securitySources.oidc],
      },
    },
    'Como funciona uma cadeia de confiança de certificados?': {
      answer: 'O cliente valida o certificado do servidor construindo uma cadeia até uma autoridade certificadora raiz confiável. Ele verifica assinaturas, validade temporal, nomes/identidades e outras restrições aplicáveis. Certificados intermediários permitem que a raiz permaneça mais protegida enquanto autoridades intermediárias emitem certificados finais.',
      diagram: {
        title: 'Cadeia de confiança PKI',
        description: 'A confiança flui do trust store local para a raiz, desta para uma CA intermediária e então para o certificado do servidor, desde que todas as verificações sejam válidas.',
        width: 930,
        height: 350,
        nodes: [
          { id: 'store', label: 'Client trust store', x: 25, y: 120, kind: 'client' },
          { id: 'root', label: 'Root CA', x: 235, y: 120, kind: 'security' },
          { id: 'inter', label: 'Intermediate CA', x: 450, y: 120, kind: 'security' },
          { id: 'server', label: 'Server certificate', x: 685, y: 120, kind: 'security' },
          { id: 'identity', label: 'Expected hostname', x: 685, y: 245, kind: 'decision' },
        ],
        edges: [
          { from: 'store', to: 'root', label: 'trusted root' },
          { from: 'root', to: 'inter', label: 'signature' },
          { from: 'inter', to: 'server', label: 'signature' },
          { from: 'identity', to: 'server', label: 'name check' },
        ],
        sources: [securitySources.tls],
      },
    },
    'O que significa Zero Trust na prática?': {
      answer: 'Na prática, Zero Trust significa não conceder confiança implícita apenas porque um utilizador ou workload está numa rede interna. O acesso deve ser explicitamente autenticado e autorizado, limitado ao recurso necessário, avaliado com contexto e continuamente observado. Segmentação e identidade forte reduzem o raio de impacto de credenciais ou hosts comprometidos.',
      diagram: {
        title: 'Acesso Zero Trust por recurso',
        description: 'A política decide cada acesso com base em identidade e contexto, em vez de liberar toda a rede após uma conexão inicial.',
        width: 980,
        height: 360,
        nodes: [
          { id: 'subject', label: 'Subject', x: 20, y: 120, kind: 'client' },
          { id: 'verify', label: 'Verify identity\n+ context', x: 215, y: 120, kind: 'security' },
          { id: 'policy', label: 'Policy decision', x: 450, y: 120, kind: 'decision' },
          { id: 'resourceA', label: 'Resource A\nallowed', x: 705, y: 55, kind: 'workload' },
          { id: 'resourceB', label: 'Resource B\nnot granted', x: 705, y: 210, kind: 'workload' },
        ],
        edges: [
          { from: 'subject', to: 'verify', animated: true },
          { from: 'verify', to: 'policy' },
          { from: 'policy', to: 'resourceA', label: 'least privilege', animated: true },
          { from: 'policy', to: 'resourceB', label: 'deny' },
        ],
        sources: [securitySources.zeroTrust],
      },
    },
  },
};

const catalog: Record<string, Catalog> = { redes, seguranca };

export function getNetworkSecuritySectionDiagram(articleSlug: string, sectionId: string) {
  return catalog[articleSlug]?.sections[sectionId];
}

export function getNetworkSecurityInterviewVisual(articleSlug: string, question: string) {
  return catalog[articleSlug]?.interviews[question];
}

export function getNetworkSecurityExtraQuestions(articleSlug: string) {
  return catalog[articleSlug]?.extraQuestions ?? [];
}
