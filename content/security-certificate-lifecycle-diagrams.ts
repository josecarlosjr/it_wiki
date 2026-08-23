import type { DiagramSpec } from './diagrams';

type Locale = 'pt' | 'en';
type CertificateDiagramKey = 'lifecycle' | 'baremetal';

const sources = [
  { label: 'OpenSSL — Certificate requests (CSR)', url: 'https://docs.openssl.org/3.4/man1/openssl-req/' },
  { label: "Let's Encrypt — Challenge types", url: 'https://letsencrypt.org/docs/challenge-types/' },
  { label: 'Certbot — Automated renewal', url: 'https://eff-certbot.readthedocs.io/en/stable/using.html#automated-renewals' },
  { label: 'NGINX — Controlling nginx / reload', url: 'https://nginx.org/en/docs/control.html' },
];

export function getSecurityCertificateDiagram(key: CertificateDiagramKey, locale: Locale): DiagramSpec {
  const en = locale === 'en';

  if (key === 'lifecycle') {
    return {
      title: en ? 'TLS certificate lifecycle on Bare Metal / VMs' : 'Ciclo de vida de certificados TLS em Bare Metal / VMs',
      description: en
        ? 'A practical lifecycle from private-key and CSR creation to identity/domain validation, CA issuance, installation, expiration monitoring, renewal, and safe service reload. The private key stays on the server or protected key store; only the CSR/public information is sent to a CA in a manual workflow.'
        : 'Fluxo prático desde a criação da chave privada e CSR até validação de identidade/domínio, emissão pela CA, instalação, monitoramento de validade, renovação e reload seguro do serviço. A chave privada permanece no servidor ou key store protegido; em fluxo manual, somente o CSR/informação pública é enviado à CA.',
      width: 1240,
      height: 475,
      nodes: [
        { id: 's1', label: en ? '1. Private key + CSR\nOpenSSL / ACME client' : '1. Chave privada + CSR\nOpenSSL / cliente ACME', x: 20, y: 70, width: 155, height: 80, kind: 'security' },
        { id: 's2', label: en ? '2. Validate control\nidentity / HTTP-01 / DNS-01' : '2. Validar controle\nidentidade / HTTP-01 / DNS-01', x: 195, y: 70, width: 160, height: 80, kind: 'decision' },
        { id: 's3', label: en ? '3. CA issues\ncertificate + chain' : '3. CA emite\ncertificado + cadeia', x: 375, y: 70, width: 155, height: 80, kind: 'security' },
        { id: 's4', label: en ? '4. Install\nNginx / Apache / HAProxy / app' : '4. Instalar\nNginx / Apache / HAProxy / app', x: 550, y: 70, width: 175, height: 80, kind: 'workload' },
        { id: 's5', label: en ? '5. Monitor validity\nexternal TLS + expiry alert' : '5. Monitorar validade\nTLS externo + alerta de expiração', x: 745, y: 70, width: 170, height: 80, kind: 'data' },
        { id: 's6', label: en ? '6. Renew\nACME / CA workflow' : '6. Renovar\nACME / workflow da CA', x: 935, y: 70, width: 145, height: 80, kind: 'control' },
        { id: 's7', label: en ? '7. Reload + validate\nnew certificate active' : '7. Reload + validar\nnovo certificado ativo', x: 1100, y: 70, width: 125, height: 80, kind: 'workload' },
        { id: 'keynote', label: en ? 'PRIVATE KEY\nNever send by email, commit to Git, or copy into logs.\nRestrict permissions and back up only through a protected process.' : 'CHAVE PRIVADA\nNunca enviar por e-mail, versionar no Git ou copiar em logs.\nRestringir permissões e fazer backup somente por processo protegido.', x: 205, y: 255, width: 390, height: 105, kind: 'security' },
        { id: 'paths', label: en ? 'Two common paths\nManual / internal CA: key → CSR → CA → cert\nACME / Certbot: client automates key/CSR/challenge/renewal' : 'Dois caminhos comuns\nManual / CA interna: chave → CSR → CA → cert\nACME / Certbot: cliente automatiza chave/CSR/challenge/renovação', x: 680, y: 255, width: 410, height: 105, kind: 'control' },
      ],
      edges: [
        { from: 's1', to: 's2', label: en ? 'CSR / ACME order' : 'CSR / ordem ACME', animated: true },
        { from: 's2', to: 's3', label: en ? 'validated' : 'validado', animated: true },
        { from: 's3', to: 's4', label: 'cert + chain', animated: true },
        { from: 's4', to: 's5', label: en ? 'serve HTTPS' : 'serve HTTPS', animated: true },
        { from: 's5', to: 's6', label: en ? 'near expiry / policy' : 'perto de expirar / policy', animated: true },
        { from: 's6', to: 's7', label: en ? 'successful issuance' : 'emissão bem-sucedida', animated: true },
        { from: 's7', to: 's5', label: en ? 'continuous monitoring' : 'monitoramento contínuo' },
        { from: 's1', to: 'keynote', label: en ? 'protect' : 'proteger' },
        { from: 's1', to: 'paths', label: en ? 'choose workflow' : 'escolher fluxo' },
      ],
      sources,
    };
  }

  return {
    title: en ? 'Bare Metal / VM certificate issuance and renewal — detailed steps 3 to 7' : 'Certificados em Bare Metal / VMs — passos 3 a 7 detalhados',
    description: en
      ? 'Detailed operational flow using Let’s Encrypt/Certbot with Nginx as an example. Validation can use HTTP-01 or DNS-01; after issuance, the service references the managed certificate paths. A scheduled renewal checks certificates periodically and a deploy hook reloads the service only after a successful renewal.'
      : 'Fluxo operacional detalhado usando Let’s Encrypt/Certbot com Nginx como exemplo. A validação pode usar HTTP-01 ou DNS-01; após a emissão, o serviço referencia os caminhos gerenciados do certificado. A renovação agendada verifica certificados periodicamente e um deploy hook recarrega o serviço somente após renovação bem-sucedida.',
    width: 1240,
    height: 650,
    nodes: [
      { id: 'v3', label: en ? '3. VALIDATE DOMAIN\nHTTP-01 :80\nor DNS-01 TXT' : '3. VALIDAR DOMÍNIO\nHTTP-01 :80\nou DNS-01 TXT', x: 20, y: 55, width: 205, height: 90, kind: 'decision' },
      { id: 'http', label: en ? 'HTTP-01\n/.well-known/acme-challenge/…' : 'HTTP-01\n/.well-known/acme-challenge/…', x: 20, y: 220, width: 205, height: 74, kind: 'network' },
      { id: 'dns', label: en ? 'DNS-01\n_acme-challenge TXT\nworks for wildcard certs' : 'DNS-01\nTXT _acme-challenge\npermite wildcard', x: 20, y: 340, width: 205, height: 82, kind: 'network' },

      { id: 'v4', label: en ? '4. OBTAIN CERTIFICATE\nCA signs / ACME issues' : '4. OBTER CERTIFICADO\nCA assina / ACME emite', x: 260, y: 55, width: 205, height: 90, kind: 'security' },
      { id: 'files', label: 'cert.pem\nchain.pem\nfullchain.pem\nprivkey.pem', x: 260, y: 245, width: 205, height: 115, kind: 'data' },

      { id: 'v5', label: en ? '5. INSTALL / CONFIGURE\nNginx / Apache / HAProxy' : '5. INSTALAR / CONFIGURAR\nNginx / Apache / HAProxy', x: 500, y: 55, width: 205, height: 90, kind: 'workload' },
      { id: 'reload', label: en ? 'nginx -t\nsystemctl reload nginx\nNo full restart required' : 'nginx -t\nsystemctl reload nginx\nSem restart completo', x: 500, y: 245, width: 205, height: 105, kind: 'control' },

      { id: 'v6', label: en ? '6. AUTOMATE RENEWAL\nsystemd timer / cron' : '6. AUTOMATIZAR RENOVAÇÃO\nsystemd timer / cron', x: 740, y: 55, width: 205, height: 90, kind: 'control' },
      { id: 'renew', label: 'certbot renew\n↓\n' + (en ? 'renew only when due' : 'renova somente quando necessário'), x: 740, y: 220, width: 205, height: 95, kind: 'decision' },
      { id: 'hook', label: en ? 'Deploy hook\nvalidate config → reload service' : 'Deploy hook\nvalidar config → reload do serviço', x: 740, y: 370, width: 205, height: 88, kind: 'control' },

      { id: 'v7', label: en ? '7. MONITOR / VALIDATE\nexpiry + HTTPS + logs' : '7. MONITORAR / VALIDAR\nexpiração + HTTPS + logs', x: 980, y: 55, width: 225, height: 90, kind: 'data' },
      { id: 'checks', label: en ? 'openssl x509\nopenssl s_client\ncurl -I https://…\ncertbot renew --dry-run' : 'openssl x509\nopenssl s_client\ncurl -I https://…\ncertbot renew --dry-run', x: 980, y: 230, width: 225, height: 125, kind: 'data' },
      { id: 'alert', label: en ? 'Alert before expiry\nand on challenge / renewal failures' : 'Alertar antes da expiração\ne em falhas de challenge / renovação', x: 980, y: 410, width: 225, height: 92, kind: 'security' },
    ],
    edges: [
      { from: 'v3', to: 'http', label: en ? 'option A' : 'opção A' },
      { from: 'v3', to: 'dns', label: en ? 'option B' : 'opção B' },
      { from: 'v3', to: 'v4', label: en ? 'challenge valid' : 'challenge válido', animated: true },
      { from: 'v4', to: 'files', label: en ? 'certificate material' : 'arquivos emitidos' },
      { from: 'v4', to: 'v5', label: en ? 'install' : 'instalar', animated: true },
      { from: 'v5', to: 'reload', label: en ? 'test + reload' : 'testar + reload' },
      { from: 'v5', to: 'v6', label: en ? 'after first issuance' : 'após emissão inicial', animated: true },
      { from: 'v6', to: 'renew', label: en ? 'scheduled check' : 'checagem agendada' },
      { from: 'renew', to: 'hook', label: en ? 'if renewed successfully' : 'se renovou com sucesso', animated: true },
      { from: 'hook', to: 'v7', label: en ? 'new cert active' : 'novo cert ativo', animated: true },
      { from: 'v7', to: 'checks', label: en ? 'technical checks' : 'checagens técnicas' },
      { from: 'checks', to: 'alert', label: en ? 'monitor continuously' : 'monitorar continuamente' },
      { from: 'alert', to: 'v6', label: en ? 'renewal loop' : 'ciclo de renovação' },
    ],
    sources,
  };
}
