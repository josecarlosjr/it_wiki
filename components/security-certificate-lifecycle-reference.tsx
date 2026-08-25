'use client';

import { getSecurityCertificateDiagram } from '@/content/security-certificate-lifecycle-diagrams';
import { useLanguage } from './language-provider';
import { SecurityCertificateLifecycleInfographic } from './security-certificate-lifecycle-infographic';
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

const certManagerManifest = `apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    email: admin@example.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-prod-account-key
    solvers:
      - http01:
          ingress:
            class: nginx
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: it-wiki-tls
  namespace: it-wiki
spec:
  secretName: it-wiki-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - wiki.example.com`;

const certManagerChecks = `# Estado declarativo
kubectl get issuer,clusterissuer -A
kubectl get certificate,certificaterequest -A

# Fluxo ACME
kubectl get order,challenge -A

# Detalhes e eventos
kubectl describe certificate it-wiki-tls -n it-wiki
kubectl describe challenge -A

# Secret entregue ao consumidor TLS
kubectl get secret it-wiki-tls -n it-wiki`;

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
      <h2>{t('Criação e renovação de certificados TLS — Bare Metal, VMs e Kubernetes', 'TLS certificate creation and renewal — Bare Metal, VMs, and Kubernetes')}</h2>
      <p className="certificate-intro">{t(
        'O processo fundamental é sempre o mesmo: gerar ou proteger a chave privada, provar identidade/controle do domínio, obter um certificado assinado, ativá-lo no ponto que termina TLS e renová-lo antes da expiração. A diferença é operacional: em Bare Metal/VMs você administra arquivos e reloads; no Kubernetes, cert-manager reconcilia recursos declarativos e mantém o Secret TLS atualizado.',
        'The fundamental process is always the same: create or protect the private key, prove identity/domain control, obtain a signed certificate, activate it at the TLS termination point, and renew it before expiry. The operational difference is that Bare Metal/VMs are file-and-reload oriented, while Kubernetes uses cert-manager to reconcile declarative resources and keep the TLS Secret updated.'
      )}</p>

      <SecurityCertificateLifecycleInfographic />

      <div className="certificate-step-list">
        <Step number="1–2" title={t('Bare Metal / VMs — chave privada, CSR e identidade', 'Bare Metal / VMs — private key, CSR, and identity')}>
          <p>{t('CSR significa Certificate Signing Request. Para certificados modernos, coloque todos os nomes DNS usados pelos clientes no SAN. Não dependa apenas do CN.', 'CSR means Certificate Signing Request. For modern certificates, place every DNS name used by clients in SAN. Do not rely only on CN.')}</p>
          <Code>{opensslManual}</Code>
        </Step>

        <Step number="3" title={t('Bare Metal / VMs — validar domínio ou identidade', 'Bare Metal / VMs — validate domain or identity')}>
          <div className="certificate-options-grid">
            <article className="certificate-option-card"><h4>HTTP-01</h4><p>{t('A CA busca um token em /.well-known/acme-challenge/. Normalmente exige DNS correto e porta 80 alcançável publicamente.', 'The CA fetches a token from /.well-known/acme-challenge/. It normally requires correct DNS and public reachability on port 80.')}</p></article>
            <article className="certificate-option-card"><h4>DNS-01</h4><p>{t('A validação usa um TXT em _acme-challenge. É necessária para wildcard e é idealmente automatizada via API do provedor DNS.', 'Validation uses a TXT record under _acme-challenge. It is required for wildcard certificates and should ideally be automated through the DNS provider API.')}</p><Code>{dnsNote}</Code></article>
          </div>
          <div className="certificate-diagram-block"><TopicDiagram spec={getSecurityCertificateDiagram('baremetal', locale)} /></div>
        </Step>

        <Step number="4" title={t('Bare Metal / VMs — obter o certificado inicial', 'Bare Metal / VMs — obtain the initial certificate')}>
          <p>{t('Com CA interna, envie o CSR pelo workflow da PKI e receba certificado + cadeia intermediária. Com Let’s Encrypt/ACME, o Certbot pode automatizar order, challenge, emissão e integração com o web server.', 'With an internal CA, submit the CSR through the PKI workflow and receive the certificate plus intermediate chain. With Let’s Encrypt/ACME, Certbot can automate the order, challenge, issuance, and web-server integration.')}</p>
          <Code>{certbotInstall}</Code>
          <p className="certificate-callout"><strong>{t('Arquivos comuns:', 'Common files:')}</strong> <code>cert.pem</code>, <code>chain.pem</code>, <code>fullchain.pem</code> {t('e', 'and')} <code>privkey.pem</code>. {t('No Nginx, normalmente use fullchain.pem em ssl_certificate e privkey.pem em ssl_certificate_key.', 'In Nginx, normally use fullchain.pem for ssl_certificate and privkey.pem for ssl_certificate_key.')}</p>
        </Step>

        <Step number="5" title={t('Bare Metal / VMs — instalar e recarregar o serviço', 'Bare Metal / VMs — install and reload the service')}>
          <Code>{nginxConfig}</Code>
          <Code>{`sudo nginx -t
sudo systemctl reload nginx`}</Code>
          <p>{t('Prefira graceful reload quando suportado. O objetivo é ativar o novo certificado sem interromper conexões existentes desnecessariamente.', 'Prefer a graceful reload when supported. The goal is to activate the new certificate without unnecessarily interrupting existing connections.')}</p>
        </Step>

        <Step number="6" title={t('Bare Metal / VMs — automatizar a renovação', 'Bare Metal / VMs — automate renewal')}>
          <p>{t('Uma automação correta verifica elegibilidade, conclui o challenge, atualiza os arquivos gerenciados e executa o reload somente quando necessário.', 'Correct automation checks eligibility, completes the challenge, updates managed files, and reloads only when needed.')}</p>
          <Code>{renewalCommands}</Code>
          <p className="certificate-callout"><strong>{t('Evite uma regra fixa de “30 dias”.', 'Avoid a fixed “30 days” rule.')}</strong> {t('A janela depende do cliente ACME, da CA e da lifetime. Deixe o cliente controlar a elegibilidade e monitore o resultado.', 'The renewal window depends on the ACME client, the CA, and the lifetime. Let the client control eligibility and monitor the result.')}</p>
        </Step>

        <Step number="7" title={t('Bare Metal / VMs — monitorar e validar a renovação', 'Bare Metal / VMs — monitor and validate renewal')}>
          <Code>{validationCommands}</Code>
          <p>{t('Não valide apenas o arquivo em disco. Confirme também o certificado realmente servido na porta 443, pois o processo pode não ter recarregado ou pode existir um proxy/load balancer terminando TLS antes do servidor.', 'Do not validate only the file on disk. Also confirm the certificate actually served on port 443, because the process may not have reloaded or a proxy/load balancer may terminate TLS before the server.')}</p>
        </Step>

        <Step number="K8s" title={t('Kubernetes — cert-manager, Certificate e Secret TLS', 'Kubernetes — cert-manager, Certificate, and TLS Secret')}>
          <p>{t('No Kubernetes, o fluxo ideal é declarativo. Um Issuer ou ClusterIssuer descreve a autoridade emissora; um Certificate declara os DNS names e o Secret de destino. O cert-manager cria requests, resolve challenges, grava tls.crt/tls.key no Secret e renova o material conforme a janela calculada.', 'In Kubernetes, the preferred flow is declarative. An Issuer or ClusterIssuer describes the issuing authority; a Certificate declares DNS names and the destination Secret. cert-manager creates requests, solves challenges, stores tls.crt/tls.key in the Secret, and renews the material according to the calculated renewal window.')}</p>
          <Code>{certManagerManifest}</Code>
          <p className="certificate-callout"><strong>{t('Importante:', 'Important:')}</strong> {t('não force rollout de Pods por padrão. Se o Ingress/Gateway observa o Secret e recarrega certificados dinamicamente, a atualização pode acontecer sem restart da aplicação. Faça rollout apenas quando o consumidor TLS realmente exigir.', 'do not force Pod rollouts by default. If the Ingress/Gateway watches the Secret and reloads certificates dynamically, the update can happen without restarting the application. Roll out only when the TLS consumer actually requires it.')}</p>
          <Code>{certManagerChecks}</Code>
        </Step>
      </div>

      <div className="certificate-final-grid certificate-final-grid-wide">
        <article className="certificate-final-card"><h4>{t('Alertas recomendados', 'Recommended alerts')}</h4><ul className="knowledge-list"><li>{t('Dias até expiração abaixo do limite operacional.', 'Days to expiry below the operational threshold.')}</li><li>{t('Falha em challenge, order ou renovação.', 'Challenge, order, or renewal failure.')}</li><li>{t('Certificado servido diferente do esperado.', 'Served certificate differs from the expected certificate.')}</li><li>{t('SAN incorreto ou cadeia incompleta.', 'Incorrect SAN or incomplete chain.')}</li></ul></article>
        <article className="certificate-final-card"><h4>{t('Falhas comuns', 'Common failure modes')}</h4><ul className="knowledge-list"><li>{t('Porta 80 bloqueada no HTTP-01.', 'Port 80 blocked during HTTP-01.')}</li><li>{t('DNS incorreto ou TXT ainda não propagado.', 'Incorrect DNS or TXT record not yet propagated.')}</li><li>{t('Permissões impedem leitura da private key/Secret.', 'Permissions prevent reading the private key/Secret.')}</li><li>{t('Consumidor TLS ainda serve o certificado antigo.', 'TLS consumer is still serving the old certificate.')}</li></ul></article>
      </div>

      <div className="certificate-checklist-wrap">
        <h3>{t('Checklist de produção', 'Production checklist')}</h3>
        <ul className="knowledge-list certificate-checklist"><li>{t('Private key com permissões mínimas e fora de Git, e-mail e logs.', 'Private key with minimum permissions and kept out of Git, email, and logs.')}</li><li>{t('SANs corretos para todos os nomes usados.', 'Correct SANs for every hostname in use.')}</li><li>{t('Cadeia intermediária completa.', 'Complete intermediate chain.')}</li><li>{t('Renovação testada com dry-run/staging quando disponível.', 'Renewal tested with dry-run/staging where available.')}</li><li>{t('Reload/reconciliação validado antes de produção.', 'Reload/reconciliation validated before production.')}</li><li>{t('Alerta de expiração e falha de renovação.', 'Expiry and renewal-failure alert configured.')}</li><li>{t('Runbook com CA, ownership, paths/Secrets, mecanismo de reload e rollback.', 'Runbook with CA, ownership, paths/Secrets, reload mechanism, and rollback.')}</li></ul>
      </div>
    </section>
  );
}
