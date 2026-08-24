'use client';

import { getSecurityCertificateDiagram } from '@/content/security-certificate-lifecycle-diagrams';
import { useLanguage } from './language-provider';
import { TopicDiagram } from './topic-diagram';

const opensslManual = `# 1) Gerar chave privada RSA 3072
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out server.key
chmod 600 server.key

# 2) Gerar CSR com SAN
openssl req -new \
  -key server.key \
  -out server.csr \
  -subj "/CN=api.example.com" \
  -addext "subjectAltName=DNS:api.example.com,DNS:www.api.example.com"

# 3) Inspecionar o CSR antes de enviar à CA
openssl req -in server.csr -noout -text`;

const certbotInstall = `# Ubuntu / Debian — exemplo Nginx
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx \
  -d api.example.com \
  -d www.api.example.com \
  --redirect \
  --non-interactive \
  --agree-tos \
  -m admin@example.com`;

const nginxConfig = `server {
  listen 443 ssl http2;
  server_name api.example.com www.api.example.com;

  ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}`;

const renewalCommands = `# Ver agendamento
systemctl list-timers | grep certbot

# Simular renovação
sudo certbot renew --dry-run

# Executar renovação
sudo certbot renew

# Reload somente após renovação bem-sucedida
sudo certbot renew \
  --deploy-hook "nginx -t && systemctl reload nginx"`;

const validationCommands = `# Validar o arquivo local
openssl x509 \
  -in /etc/letsencrypt/live/api.example.com/fullchain.pem \
  -noout -subject -issuer -dates

# Validar o certificado servido em 443
openssl s_client \
  -connect api.example.com:443 \
  -servername api.example.com \
  -showcerts </dev/null

# Testar HTTPS
curl -I https://api.example.com

# Logs
journalctl -u certbot.timer -n 50
journalctl -u certbot.service -n 50`;

const dnsNote = `_acme-challenge.api.example.com. 300 IN TXT "<token-acme>"`;

function Code({ children }: { children: string }) {
  return <pre className="certificate-code"><code>{children}</code></pre>;
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="certificate-step">
      <div className="certificate-step-header">
        <span className="certificate-step-number">{number}</span>
        <h3 className="certificate-step-title">{title}</h3>
      </div>
      <div className="certificate-step-body">{children}</div>
    </section>
  );
}

export function SecurityCertificateLifecycleReference() {
  const { locale, t } = useLanguage();

  return (
    <section className="article-section security-certificate-lifecycle" id="security-certificates">
      <h2>{t('Criação e renovação de certificados TLS — Bare Metal / VMs', 'TLS certificate creation and renewal — Bare Metal / VMs')}</h2>
      <p className="certificate-intro">{t(
        'Este fluxo cobre o ciclo operacional completo: gerar a identidade criptográfica, pedir assinatura à CA, instalar o material correto no serviço, automatizar a renovação e provar que o certificado novo realmente está sendo servido. O exemplo usa OpenSSL, Let’s Encrypt/Certbot e Nginx, mas a mesma lógica vale para Apache, HAProxy e aplicações que terminam TLS diretamente.',
        'This flow covers the complete operational lifecycle: create the cryptographic identity, request CA signing, install the correct material in the service, automate renewal, and prove that the new certificate is actually being served. The example uses OpenSSL, Let’s Encrypt/Certbot, and Nginx, but the same logic applies to Apache, HAProxy, and applications that terminate TLS directly.'
      )}</p>

      <div className="certificate-diagram-block"><TopicDiagram spec={getSecurityCertificateDiagram('lifecycle', locale)} /></div>

      <p className="certificate-callout"><strong>{t('Regra essencial:', 'Essential rule:')}</strong>{' '}{t(
        'em um fluxo CSR normal, a chave privada fica no servidor. A CA recebe o CSR com a chave pública e os dados da identidade. Em ACME, clientes como Certbot automatizam grande parte do processo.',
        'in a normal CSR workflow, the private key stays on the server. The CA receives the CSR containing the public key and identity data. With ACME, clients such as Certbot automate much of the process.'
      )}</p>

      <div className="certificate-step-list">
        <Step number="1–2" title={t('Chave privada, CSR e identidade', 'Private key, CSR, and identity')}>
          <p>{t('CSR significa Certificate Signing Request. Para certificados modernos, coloque todos os nomes DNS usados pelos clientes no SAN. Não dependa apenas do CN.', 'CSR means Certificate Signing Request. For modern certificates, place every DNS name used by clients in SAN. Do not rely only on CN.')}</p>
          <Code>{opensslManual}</Code>
        </Step>

        <Step number="3" title={t('Validar domínio ou identidade', 'Validate domain or identity')}>
          <div className="certificate-options-grid">
            <article className="certificate-option-card"><h4>HTTP-01</h4><p>{t('A CA busca um token em /.well-known/acme-challenge/. Normalmente exige DNS correto e porta 80 alcançável publicamente.', 'The CA fetches a token from /.well-known/acme-challenge/. It normally requires correct DNS and public reachability on port 80.')}</p></article>
            <article className="certificate-option-card"><h4>DNS-01</h4><p>{t('A validação usa um TXT em _acme-challenge. É necessária para wildcard e é idealmente automatizada via API do provedor DNS.', 'Validation uses a TXT record under _acme-challenge. It is required for wildcard certificates and should ideally be automated through the DNS provider API.')}</p><Code>{dnsNote}</Code></article>
          </div>
          <div className="certificate-diagram-block"><TopicDiagram spec={getSecurityCertificateDiagram('baremetal', locale)} /></div>
        </Step>

        <Step number="4" title={t('Obter o certificado inicial', 'Obtain the initial certificate')}>
          <p>{t('Com CA interna, envie o CSR pelo workflow da PKI e receba certificado + cadeia intermediária. Com Let’s Encrypt/ACME, o Certbot pode automatizar order, challenge, emissão e integração com o web server.', 'With an internal CA, submit the CSR through the PKI workflow and receive the certificate plus intermediate chain. With Let’s Encrypt/ACME, Certbot can automate the order, challenge, issuance, and web-server integration.')}</p>
          <Code>{certbotInstall}</Code>
          <p className="certificate-callout"><strong>{t('Arquivos comuns:', 'Common files:')}</strong> <code>cert.pem</code>, <code>chain.pem</code>, <code>fullchain.pem</code> {t('e', 'and')} <code>privkey.pem</code>. {t('No Nginx, normalmente use fullchain.pem em ssl_certificate e privkey.pem em ssl_certificate_key.', 'In Nginx, normally use fullchain.pem for ssl_certificate and privkey.pem for ssl_certificate_key.')}</p>
        </Step>

        <Step number="5" title={t('Instalar e recarregar o serviço', 'Install and reload the service')}>
          <Code>{nginxConfig}</Code>
          <Code>{`sudo nginx -t
sudo systemctl reload nginx`}</Code>
          <p>{t('Prefira graceful reload quando suportado. O objetivo é ativar o novo certificado sem interromper conexões existentes desnecessariamente.', 'Prefer a graceful reload when supported. The goal is to activate the new certificate without unnecessarily interrupting existing connections.')}</p>
        </Step>

        <Step number="6" title={t('Automatizar a renovação', 'Automate renewal')}>
          <p>{t('Uma automação correta verifica se o certificado está elegível, conclui o challenge, atualiza o material e executa o reload somente quando necessário.', 'Correct automation checks whether the certificate is eligible, completes the challenge, updates the certificate material, and reloads only when needed.')}</p>
          <Code>{renewalCommands}</Code>
          <p className="certificate-callout"><strong>{t('Evite uma regra fixa de “30 dias”.', 'Avoid a fixed “30 days” rule.')}</strong> {t('A janela depende do cliente ACME, da CA e da lifetime. Deixe o cliente controlar a elegibilidade e monitore o resultado.', 'The renewal window depends on the ACME client, the CA, and the lifetime. Let the client control eligibility and monitor the result.')}</p>
        </Step>

        <Step number="7" title={t('Monitorar e validar a renovação', 'Monitor and validate renewal')}>
          <Code>{validationCommands}</Code>
          <p>{t('Não valide apenas o arquivo em disco. Confirme também o certificado realmente servido na porta 443, pois o processo pode não ter recarregado ou pode existir um proxy/load balancer terminando TLS antes do servidor.', 'Do not validate only the file on disk. Also confirm the certificate actually served on port 443, because the process may not have reloaded or a proxy/load balancer may terminate TLS before the server.')}</p>
          <div className="certificate-final-grid">
            <article className="certificate-final-card"><h4>{t('Alertas recomendados', 'Recommended alerts')}</h4><ul className="knowledge-list"><li>{t('Dias até expiração abaixo do limite operacional.', 'Days to expiry below the operational threshold.')}</li><li>{t('Falha em challenge ou renew.', 'Challenge or renewal failure.')}</li><li>{t('Certificado servido diferente do esperado.', 'Served certificate differs from the expected certificate.')}</li><li>{t('SAN incorreto ou cadeia incompleta.', 'Incorrect SAN or incomplete chain.')}</li></ul></article>
            <article className="certificate-final-card"><h4>{t('Falhas comuns', 'Common failure modes')}</h4><ul className="knowledge-list"><li>{t('Porta 80 bloqueada no HTTP-01.', 'Port 80 blocked during HTTP-01.')}</li><li>{t('DNS incorreto ou TXT ainda não propagado.', 'Incorrect DNS or TXT record not yet propagated.')}</li><li>{t('Permissão da private key impede leitura.', 'Private-key permissions prevent reading.')}</li><li>{t('Serviço ainda usa o certificado antigo por falta de reload.', 'Service still uses the old certificate because reload did not happen.')}</li></ul></article>
          </div>
        </Step>
      </div>

      <div className="certificate-checklist-wrap">
        <h3>{t('Checklist de produção', 'Production checklist')}</h3>
        <ul className="knowledge-list certificate-checklist"><li>{t('Private key com permissões mínimas e fora de Git, e-mail e logs.', 'Private key with minimum permissions and kept out of Git, email, and logs.')}</li><li>{t('SANs corretos para todos os nomes usados.', 'Correct SANs for every hostname in use.')}</li><li>{t('Cadeia intermediária completa.', 'Complete intermediate chain.')}</li><li>{t('renew --dry-run testado.', 'renew --dry-run tested.')}</li><li>{t('Hook valida a configuração antes do reload.', 'Hook validates configuration before reload.')}</li><li>{t('Alerta de expiração e falha de renovação.', 'Expiry and renewal-failure alert configured.')}</li><li>{t('Runbook com CA, ownership, paths, hook e rollback.', 'Runbook with CA, ownership, paths, hook, and rollback.')}</li></ul>
      </div>
    </section>
  );
}
