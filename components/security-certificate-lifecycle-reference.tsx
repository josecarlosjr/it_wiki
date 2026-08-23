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

const renewalCommands = `# Ver o timer / scheduling
systemctl list-timers | grep certbot

# Testar renovação sem emitir certificado real
sudo certbot renew --dry-run

# Executar renovação manualmente
sudo certbot renew

# Exemplo de deploy hook: recarregar Nginx somente após renovação
sudo certbot renew \
  --deploy-hook "nginx -t && systemctl reload nginx"`;

const validationCommands = `# Validade e datas do certificado local
openssl x509 \
  -in /etc/letsencrypt/live/api.example.com/fullchain.pem \
  -noout -subject -issuer -dates

# Validar o certificado realmente servido pela porta 443
openssl s_client \
  -connect api.example.com:443 \
  -servername api.example.com \
  -showcerts </dev/null

# Verificar HTTPS externamente
curl -I https://api.example.com

# Logs de renovação
journalctl -u certbot.timer -n 50
journalctl -u certbot.service -n 50`;

const dnsNote = `_acme-challenge.api.example.com. 300 IN TXT "<token-acme>"`;

function Code({ children }: { children: string }) {
  return <pre className="reference-code"><code>{children}</code></pre>;
}

export function SecurityCertificateLifecycleReference() {
  const { locale, t } = useLanguage();

  return (
    <section className="article-section" id="security-certificates">
      <h2>{t('Criação e renovação de certificados TLS — Bare Metal / VMs', 'TLS certificate creation and renewal — Bare Metal / VMs')}</h2>
      <p>{t(
        'Este fluxo cobre o ciclo operacional completo: gerar a identidade criptográfica, pedir assinatura à CA, instalar o material correto no serviço, automatizar a renovação e provar que o certificado novo realmente está sendo servido. O exemplo usa OpenSSL, Let’s Encrypt/Certbot e Nginx, mas a lógica é a mesma para Apache, HAProxy e aplicações que terminam TLS diretamente.',
        'This flow covers the full operational lifecycle: create the cryptographic identity, request CA signing, install the correct material in the service, automate renewal, and prove that the new certificate is actually being served. The example uses OpenSSL, Let’s Encrypt/Certbot, and Nginx, but the same logic applies to Apache, HAProxy, and applications that terminate TLS directly.'
      )}</p>

      <TopicDiagram spec={getSecurityCertificateDiagram('lifecycle', locale)} />

      <div className="reference-note">
        <strong>{t('Regra essencial:', 'Essential rule:')}</strong>{' '}
        {t(
          'a chave privada não é enviada para a CA em um fluxo CSR normal. O servidor gera a chave, cria um CSR com a chave pública e mantém a private key protegida localmente. Em ACME, clientes como Certbot automatizam grande parte desse fluxo.',
          'the private key is not sent to the CA in a normal CSR workflow. The server generates the key, creates a CSR containing the public key, and keeps the private key protected locally. With ACME, clients such as Certbot automate much of this workflow.'
        )}
      </div>

      <h3>{t('1–2. Chave privada, CSR e identidade', '1–2. Private key, CSR, and identity')}</h3>
      <p>{t(
        'CSR significa Certificate Signing Request. Ele contém a chave pública e informações de identidade que a CA vai assinar depois de validar o pedido. Para certificados de servidor modernos, coloque os nomes DNS no SAN (Subject Alternative Name); não dependa somente do CN.',
        'CSR means Certificate Signing Request. It contains the public key and identity information that the CA will sign after validating the request. For modern server certificates, put DNS names in SAN (Subject Alternative Name); do not rely only on CN.'
      )}</p>
      <Code>{opensslManual}</Code>

      <h3>{t('3. Validar domínio ou identidade', '3. Validate domain or identity')}</h3>
      <div className="reference-grid compact">
        <article className="reference-card">
          <h3>HTTP-01</h3>
          <p>{t(
            'A CA tenta buscar um token em http://dominio/.well-known/acme-challenge/... Normalmente exige que a porta 80 esteja alcançável publicamente e que DNS aponte para o servidor correto.',
            'The CA fetches a token from http://domain/.well-known/acme-challenge/... This normally requires public reachability on port 80 and DNS pointing to the correct server.'
          )}</p>
        </article>
        <article className="reference-card">
          <h3>DNS-01</h3>
          <p>{t(
            'A prova é um registro TXT em _acme-challenge. É apropriada quando HTTP-01 não é possível e é necessária para certificados wildcard. Para automação real, prefira integração com API do DNS em vez de edição manual.',
            'The proof is a TXT record under _acme-challenge. It is useful when HTTP-01 is not possible and is required for wildcard certificates. For real automation, prefer DNS-provider API integration instead of manual edits.'
          )}</p>
          <Code>{dnsNote}</Code>
        </article>
      </div>

      <TopicDiagram spec={getSecurityCertificateDiagram('baremetal', locale)} />

      <h3>{t('4. Obter o certificado inicial', '4. Obtain the initial certificate')}</h3>
      <p>{t(
        'Em uma CA interna, envie o CSR pela interface/processo da PKI e receba o certificado assinado e a cadeia intermediária. Com Let’s Encrypt/ACME, Certbot pode cuidar da ordem ACME, challenge, emissão, paths e integração com o web server.',
        'With an internal CA, submit the CSR through the PKI workflow and receive the signed certificate and intermediate chain. With Let’s Encrypt/ACME, Certbot can handle the ACME order, challenge, issuance, paths, and web-server integration.'
      )}</p>
      <Code>{certbotInstall}</Code>

      <div className="reference-note">
        <strong>{t('Arquivos comuns do Certbot:', 'Common Certbot files:')}</strong>{' '}
        <code>cert.pem</code>, <code>chain.pem</code>, <code>fullchain.pem</code> {t('e', 'and')} <code>privkey.pem</code>. {t(
          'Para Nginx, normalmente ssl_certificate aponta para fullchain.pem e ssl_certificate_key para privkey.pem.',
          'For Nginx, ssl_certificate normally points to fullchain.pem and ssl_certificate_key to privkey.pem.'
        )}
      </div>

      <h3>{t('5. Instalar e recarregar o serviço', '5. Install and reload the service')}</h3>
      <Code>{nginxConfig}</Code>
      <Code>{`sudo nginx -t
sudo systemctl reload nginx`}</Code>
      <p>{t(
        'Prefira reload gracioso quando o servidor suporta isso. O objetivo é fazer novos workers/conexões usarem o novo certificado sem provocar uma indisponibilidade desnecessária.',
        'Prefer a graceful reload when the server supports it. The goal is to make new workers/connections use the new certificate without causing unnecessary downtime.'
      )}</p>

      <h3>{t('6. Automatizar a renovação', '6. Automate renewal')}</h3>
      <p>{t(
        'Automação correta não é apenas executar renew. Ela precisa: verificar se a renovação é necessária, concluir o challenge, substituir o material gerenciado, executar hooks somente quando apropriado e recarregar o serviço de forma segura.',
        'Correct automation is more than running renew. It must determine whether renewal is needed, complete the challenge, replace managed certificate material, run hooks only when appropriate, and reload the service safely.'
      )}</p>
      <Code>{renewalCommands}</Code>

      <div className="reference-note">
        <strong>{t('Não fixe uma regra universal de “30 dias”.', 'Do not hard-code a universal “30 days” rule.')}</strong>{' '}
        {t(
          'O momento de renovação depende do cliente ACME, da política da CA e da lifetime do certificado. Deixe o cliente gerenciar a janela de renovação e monitore o resultado.',
          'The renewal point depends on the ACME client, CA policy, and certificate lifetime. Let the client manage its renewal window and monitor the result.'
        )}
      </div>

      <h3>{t('7. Monitorar e provar que a renovação funcionou', '7. Monitor and prove that renewal worked')}</h3>
      <Code>{validationCommands}</Code>
      <p>{t(
        'Validar apenas o arquivo no disco não é suficiente. Sempre verifique também o certificado servido pela porta TLS, porque o processo pode não ter recarregado, pode estar lendo outro path ou pode existir um load balancer/proxy terminando TLS antes do servidor.',
        'Validating only the file on disk is not enough. Always verify the certificate actually served on the TLS port, because the process may not have reloaded, may be reading another path, or a load balancer/proxy may terminate TLS before the server.'
      )}</p>

      <div className="reference-grid compact">
        <article className="reference-card">
          <h3>{t('Alertas recomendados', 'Recommended alerts')}</h3>
          <ul className="knowledge-list">
            <li>{t('Dias até expiração abaixo do limite definido pela operação.', 'Days to expiry below the operational threshold.')}</li>
            <li>{t('Falha em certbot renew / challenge ACME.', 'Failure in certbot renew / ACME challenge.')}</li>
            <li>{t('Certificado servido diferente do arquivo esperado.', 'Served certificate differs from the expected file.')}</li>
            <li>{t('Hostname/SAN incorreto ou cadeia incompleta.', 'Incorrect hostname/SAN or incomplete chain.')}</li>
          </ul>
        </article>
        <article className="reference-card">
          <h3>{t('Falhas comuns', 'Common failure modes')}</h3>
          <ul className="knowledge-list">
            <li>{t('Porta 80 bloqueada durante HTTP-01.', 'Port 80 blocked during HTTP-01.')}</li>
            <li>{t('DNS aponta para IP errado ou TXT ainda não propagou.', 'DNS points to the wrong IP or TXT has not propagated yet.')}</li>
            <li>{t('Permissão da private key impede o processo de ler o arquivo.', 'Private-key permissions prevent the process from reading the file.')}</li>
            <li>{t('Nginx/HAProxy mantém certificado antigo porque não houve reload.', 'Nginx/HAProxy keeps serving the old certificate because no reload occurred.')}</li>
          </ul>
        </article>
      </div>

      <h3>{t('Checklist de produção', 'Production checklist')}</h3>
      <ul className="knowledge-list">
        <li>{t('Private key com permissões mínimas e fora de Git, e-mail e logs.', 'Private key with minimum permissions and kept out of Git, email, and logs.')}</li>
        <li>{t('SANs corretos para todos os nomes realmente usados pelos clientes.', 'Correct SANs for every hostname actually used by clients.')}</li>
        <li>{t('Cadeia intermediária completa e trust chain validada externamente.', 'Complete intermediate chain and trust chain validated externally.')}</li>
        <li>{t('Renewal dry-run testado antes de depender da automação.', 'Renewal dry-run tested before relying on automation.')}</li>
        <li>{t('Deploy hook valida configuração antes do reload.', 'Deploy hook validates configuration before reload.')}</li>
        <li>{t('Alerta de expiração e falha de renovação em canal operacional real.', 'Expiry and renewal-failure alert wired into a real operational channel.')}</li>
        <li>{t('Runbook documenta quem é a CA, ownership, caminhos, serviço, hook e rollback.', 'Runbook documents the CA, ownership, paths, service, hook, and rollback.')}</li>
      </ul>
    </section>
  );
}
