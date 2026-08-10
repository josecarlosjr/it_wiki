'use client';

import { TopicDiagram } from './topic-diagram';
import { useLanguage } from './language-provider';
import { getSecurityDepthDiagram } from '@/content/security-depth-diagrams';

export function SecurityReference() {
  const { locale, t } = useLanguage();

  return (
    <>
      <section className="article-section" id="security-reference">
        <h2>{t('Segurança — arquitetura e controles em profundidade', 'Security — architecture and controls in depth')}</h2>
        <p className="section-summary">{t(
          'Esta seção aprofunda TLS, firewalls, proxies e identidade com foco em arquitetura, fluxo de tráfego, trust boundaries e troubleshooting.',
          'This section goes deeper into TLS, firewalls, proxies, and identity with an emphasis on architecture, traffic flow, trust boundaries, and troubleshooting.'
        )}</p>
      </section>

      <section className="article-section" id="security-tls">
        <h2>TLS 1.3</h2>
        <p>{t(
          'TLS protege dados em trânsito e, na forma mais comum, autentica o servidor por certificado. A aplicação deve validar cadeia de confiança, hostname, validade e políticas criptográficas; aceitar qualquer certificado elimina a proteção de identidade do canal.',
          'TLS protects data in transit and, in the common case, authenticates the server with a certificate. Applications must validate the trust chain, hostname, validity, and cryptographic policy; accepting any certificate removes endpoint identity protection.'
        )}</p>
        <ul className="knowledge-list">
          <li>{t('ClientHello e ServerHello negociam parâmetros e key shares.', 'ClientHello and ServerHello negotiate parameters and key shares.')}</li>
          <li>{t('Certificate e CertificateVerify vinculam a chave do servidor à identidade apresentada.', 'Certificate and CertificateVerify bind the server key to the presented identity.')}</li>
          <li>{t('Após Finished, os dados de aplicação usam chaves simétricas derivadas para a sessão.', 'After Finished, application data uses symmetric keys derived for the session.')}</li>
          <li>{t('mTLS adiciona autenticação do cliente por certificado quando o caso exige identidade forte entre serviços.', 'mTLS adds client-certificate authentication when strong service-to-service identity is required.')}</li>
        </ul>
        <TopicDiagram spec={getSecurityDepthDiagram('tls', locale)} />
      </section>

      <section className="article-section" id="security-firewalls">
        <h2>{t('Firewalls e segmentação', 'Firewalls and segmentation')}</h2>
        <p>{t(
          'Firewalls de rede controlam fluxos principalmente por endereços, protocolos, portas, interfaces/zonas e estado. WAF opera em outra camada: entende HTTP e aplica regras orientadas à aplicação. Um não substitui o outro.',
          'Network firewalls control flows mainly by addresses, protocols, ports, interfaces/zones, and connection state. A WAF operates at another layer: it understands HTTP and applies application-oriented rules. One does not replace the other.'
        )}</p>
        <ul className="knowledge-list">
          <li>{t('Stateful firewall acompanha conexões e reconhece tráfego de retorno associado.', 'A stateful firewall tracks connections and recognizes associated return traffic.')}</li>
          <li>{t('Default deny e least exposure reduzem superfície de ataque.', 'Default deny and least exposure reduce attack surface.')}</li>
          <li>{t('Segmentação entre DMZ, aplicação e banco reduz movimento lateral.', 'Segmentation between DMZ, application, and database tiers reduces lateral movement.')}</li>
          <li>{t('Troubleshooting deve verificar regra, ordem, zona/interface, NAT, state table, counters e caminho de retorno.', 'Troubleshooting should verify rules, ordering, zones/interfaces, NAT, state table, counters, and the return path.')}</li>
        </ul>
        <TopicDiagram spec={getSecurityDepthDiagram('firewall', locale)} />
      </section>

      <section className="article-section" id="security-proxies">
        <h2>{t('Proxy e reverse proxy', 'Proxy and reverse proxy')}</h2>
        <p>{t(
          'Forward proxy fica do lado do cliente e controla/representa acesso de saída. Reverse proxy fica à frente dos servidores e representa os backends perante os clientes.',
          'A forward proxy sits on the client side and controls or represents outbound access. A reverse proxy sits in front of servers and represents backend services to clients.'
        )}</p>
        <ul className="knowledge-list">
          <li>{t('Forward proxy: egress filtering, allowlists, logging, caching e isolamento do cliente.', 'Forward proxy: egress filtering, allowlists, logging, caching, and client isolation.')}</li>
          <li>{t('Reverse proxy: TLS termination, routing, load balancing, header policy, rate limiting e integração com WAF.', 'Reverse proxy: TLS termination, routing, load balancing, header policy, rate limiting, and WAF integration.')}</li>
          <li>{t('Ao terminar TLS no reverse proxy, decida conscientemente se o tráfego proxy→backend permanece cifrado.', 'When TLS terminates at the reverse proxy, deliberately decide whether proxy-to-backend traffic remains encrypted.')}</li>
          <li>{t('X-Forwarded-For/Forwarded e headers equivalentes devem ser aceitos apenas de proxies confiáveis para evitar spoofing.', 'X-Forwarded-For/Forwarded and similar headers should only be trusted from known proxies to prevent spoofing.')}</li>
        </ul>
        <TopicDiagram spec={getSecurityDepthDiagram('proxy', locale)} />
      </section>

      <section className="article-section" id="security-identity">
        <h2>{t('Identity, autenticação e autorização', 'Identity, authentication, and authorization')}</h2>
        <p>{t(
          'Identidade é um controle transversal. Autenticação prova quem é o principal; autorização decide o que pode fazer; policy enforcement aplica a decisão no caminho real da requisição.',
          'Identity is a cross-cutting control. Authentication establishes who the principal is; authorization decides what it may do; policy enforcement applies that decision on the actual request path.'
        )}</p>
        <ul className="knowledge-list">
          <li>{t('OIDC é usado para identidade/autenticação sobre OAuth 2.0; OAuth 2.0 é um framework de autorização delegada.', 'OIDC provides identity/authentication on top of OAuth 2.0; OAuth 2.0 is a delegated authorization framework.')}</li>
          <li>{t('Tokens devem validar issuer, audience, assinatura, validade e escopos/claims relevantes.', 'Tokens should validate issuer, audience, signature, validity, and relevant scopes/claims.')}</li>
          <li>{t('Workloads devem preferir identidades de serviço e credenciais temporárias em vez de secrets estáticos.', 'Workloads should prefer service identities and temporary credentials over static secrets.')}</li>
          <li>{t('RBAC decide por papel; ABAC usa atributos/contexto. Zero Trust combina identidade, contexto e policy para cada acesso.', 'RBAC makes decisions by role; ABAC uses attributes/context. Zero Trust combines identity, context, and policy for each access.')}</li>
        </ul>
        <TopicDiagram spec={getSecurityDepthDiagram('identity', locale)} />
      </section>
    </>
  );
}
