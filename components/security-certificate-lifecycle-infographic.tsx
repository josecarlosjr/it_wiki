'use client';

import { useLanguage } from './language-provider';

type InfographicStep = {
  number: string;
  title: string;
  detail: string;
};

function StepList({ steps }: { steps: InfographicStep[] }) {
  return (
    <ol className="certificate-column-steps">
      {steps.map((step) => (
        <li key={`${step.number}-${step.title}`}>
          <span className="certificate-column-step-number" aria-hidden="true">{step.number}</span>
          <div>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function SecurityCertificateLifecycleInfographic() {
  const { t } = useLanguage();

  const overview: InfographicStep[] = [
    {
      number: '1',
      title: t('Gerar chave + CSR', 'Generate key + CSR'),
      detail: t('A identidade criptográfica nasce no servidor ou no controlador que gerencia o certificado.', 'The cryptographic identity is created on the server or by the controller managing the certificate.'),
    },
    {
      number: '2',
      title: t('Validar identidade', 'Validate identity'),
      detail: t('A CA valida domínio ou identidade, por exemplo com HTTP-01 ou DNS-01.', 'The CA validates domain control or identity, for example with HTTP-01 or DNS-01.'),
    },
    {
      number: '3',
      title: t('CA emite', 'CA issues'),
      detail: t('A CA assina o certificado e entrega a cadeia necessária.', 'The CA signs the certificate and returns the required chain.'),
    },
    {
      number: '4',
      title: t('Instalar / publicar', 'Install / publish'),
      detail: t('O serviço, Ingress ou Gateway passa a usar o certificado emitido.', 'The service, Ingress, or Gateway starts using the issued certificate.'),
    },
    {
      number: '5',
      title: t('Monitorar validade', 'Monitor validity'),
      detail: t('A operação acompanha expiração, hostname, cadeia e falhas de emissão.', 'Operations monitor expiry, hostname, chain, and issuance failures.'),
    },
    {
      number: '6',
      title: t('Renovar + ativar', 'Renew + activate'),
      detail: t('Antes de expirar, um novo certificado é emitido e ativado com reload ou atualização automática.', 'Before expiry, a new certificate is issued and activated through reload or automatic update.'),
    },
  ];

  const bareMetalSteps: InfographicStep[] = [
    { number: '1', title: t('Gerar chave privada e CSR', 'Generate private key and CSR'), detail: t('OpenSSL ou cliente ACME cria o material no servidor.', 'OpenSSL or an ACME client creates the material on the server.') },
    { number: '2', title: t('Enviar o pedido à CA', 'Submit the request to the CA'), detail: t('Em fluxo manual, envie o CSR; nunca a chave privada.', 'In a manual flow, submit the CSR; never the private key.') },
    { number: '3', title: t('Validar domínio / identidade', 'Validate domain / identity'), detail: t('HTTP-01, DNS-01 ou processo corporativo de PKI.', 'HTTP-01, DNS-01, or a corporate PKI validation process.') },
    { number: '4', title: t('Receber certificado + cadeia', 'Receive certificate + chain'), detail: t('Confirme SAN, emissor, datas e intermediários.', 'Verify SAN, issuer, validity dates, and intermediates.') },
    { number: '5', title: t('Configurar o serviço', 'Configure the service'), detail: t('Nginx, Apache, HAProxy ou a própria aplicação referencia os arquivos corretos.', 'Nginx, Apache, HAProxy, or the application itself references the correct files.') },
    { number: '6', title: t('Automatizar a renovação', 'Automate renewal'), detail: t('Certbot, acme.sh, cron ou systemd timer executa o fluxo quando elegível.', 'Certbot, acme.sh, cron, or a systemd timer executes the flow when eligible.') },
    { number: '7', title: t('Recarregar e validar', 'Reload and validate'), detail: t('Ative o novo certificado sem downtime desnecessário e valide o endpoint real.', 'Activate the new certificate without unnecessary downtime and validate the real endpoint.') },
  ];

  const kubernetesSteps: InfographicStep[] = [
    { number: '1', title: t('Criar Issuer / ClusterIssuer', 'Create Issuer / ClusterIssuer'), detail: t('Define qual CA ou endpoint ACME emitirá os certificados.', 'Defines which CA or ACME endpoint will issue certificates.') },
    { number: '2', title: t('Criar Certificate', 'Create Certificate'), detail: t('Declara DNS names, Secret de destino e issuerRef.', 'Declares DNS names, destination Secret, and issuerRef.') },
    { number: '3', title: t('cert-manager cria o pedido', 'cert-manager creates the request'), detail: t('O controlador gera a chave e o CertificateRequest conforme a configuração.', 'The controller generates the key and CertificateRequest according to configuration.') },
    { number: '4', title: t('Resolver o challenge', 'Solve the challenge'), detail: t('HTTP-01 usa Ingress/Gateway; DNS-01 publica o TXT necessário.', 'HTTP-01 uses Ingress/Gateway; DNS-01 publishes the required TXT record.') },
    { number: '5', title: t('CA emite o certificado', 'CA issues the certificate'), detail: t('Após validação, o material assinado retorna ao cluster.', 'After validation, the signed material returns to the cluster.') },
    { number: '6', title: t('Gravar no Secret TLS', 'Store in TLS Secret'), detail: t('cert-manager mantém certificado e chave no Secret indicado pelo Certificate.', 'cert-manager stores the certificate and key in the Secret referenced by the Certificate.') },
    { number: '7', title: t('Ingress / Gateway consome o Secret', 'Ingress / Gateway consumes the Secret'), detail: t('O componente que termina TLS referencia o Secret e serve HTTPS.', 'The TLS termination component references the Secret and serves HTTPS.') },
    { number: '8', title: t('Renovar automaticamente', 'Renew automatically'), detail: t('cert-manager calcula a janela de renovação, reemite e atualiza o Secret.', 'cert-manager calculates the renewal window, reissues, and updates the Secret.') },
  ];

  return (
    <figure className="certificate-infographic" aria-label={t('Fluxo visual de criação e renovação de certificados TLS', 'Visual flow for TLS certificate creation and renewal')}>
      <figcaption>{t('Como funciona a criação e renovação de certificados TLS', 'How TLS certificate creation and renewal works')}</figcaption>
      <p className="certificate-infographic-subtitle">{t(
        'O objetivo é o mesmo nos dois ambientes: provar identidade, obter um certificado confiável, ativá-lo no ponto que termina TLS e renovar antes da expiração. O que muda é quem gerencia arquivos, Secrets e reloads.',
        'The goal is the same in both environments: prove identity, obtain a trusted certificate, activate it at the TLS termination point, and renew it before expiry. What changes is who manages files, Secrets, and reloads.'
      )}</p>

      <div className="certificate-overview-flow" role="list" aria-label={t('Resumo do ciclo', 'Lifecycle summary')}>
        {overview.map((step) => (
          <div className="certificate-overview-step" role="listitem" key={step.number}>
            <span className="certificate-overview-number">{step.number}</span>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="certificate-private-key-warning">
        <span className="certificate-warning-label">{t('Regra crítica', 'Critical rule')}</span>
        <strong>{t('A chave privada não deve sair do servidor ou do Secret/key store protegido.', 'The private key must not leave the server or protected Secret/key store.')}</strong>
        <p>{t('Nunca envie por e-mail, grave em logs ou faça commit no Git. Em um fluxo CSR normal, a CA recebe o CSR com a chave pública, não a private key.', 'Never send it by email, write it to logs, or commit it to Git. In a normal CSR flow, the CA receives the CSR containing the public key, not the private key.')}</p>
      </div>

      <div className="certificate-environment-grid">
        <article className="certificate-environment-card is-baremetal">
          <div className="certificate-environment-heading">
            <span className="certificate-environment-kicker">{t('Ambiente 1', 'Environment 1')}</span>
            <h3>{t('Servidores Bare Metal / VMs', 'Bare Metal / VM servers')}</h3>
            <p>{t('Você controla diretamente arquivos, permissões, paths, timers e reload do processo que termina TLS.', 'You directly control files, permissions, paths, timers, and reloads for the process terminating TLS.')}</p>
          </div>
          <StepList steps={bareMetalSteps} />
          <div className="certificate-automation-box">
            <strong>{t('Automatizar', 'Automate')}</strong>
            <p>{t('Checagem de expiração → renovação → atualização dos arquivos → teste de configuração → graceful reload.', 'Expiry check → renewal → file update → configuration test → graceful reload.')}</p>
            <code>certbot renew --deploy-hook &quot;nginx -t &amp;&amp; systemctl reload nginx&quot;</code>
          </div>
        </article>

        <article className="certificate-environment-card is-kubernetes">
          <div className="certificate-environment-heading">
            <span className="certificate-environment-kicker">{t('Ambiente 2', 'Environment 2')}</span>
            <h3>{t('Aplicações no Kubernetes', 'Applications on Kubernetes')}</h3>
            <p>{t('O cert-manager reconcilia recursos declarativos, executa a emissão/renovação e mantém o material no Secret TLS.', 'cert-manager reconciles declarative resources, performs issuance/renewal, and keeps the material in the TLS Secret.')}</p>
          </div>
          <StepList steps={kubernetesSteps} />
          <div className="certificate-automation-box">
            <strong>{t('Automatizar', 'Automate')}</strong>
            <p>{t('Issuer/ClusterIssuer → Certificate → challenge → Secret TLS → Ingress/Gateway, com renovação reconciliada pelo cert-manager.', 'Issuer/ClusterIssuer → Certificate → challenge → TLS Secret → Ingress/Gateway, with renewal reconciled by cert-manager.')}</p>
            <code>kubectl get certificate,certificaterequest,order,challenge -A</code>
          </div>
        </article>
      </div>

      <section className="certificate-difference-section" aria-labelledby="certificate-difference-title">
        <h3 id="certificate-difference-title">{t('Diferença principal', 'Main difference')}</h3>
        <div className="certificate-comparison-grid">
          <div>
            <span>{t('Bare Metal / VMs', 'Bare Metal / VMs')}</span>
            <strong>{t('Automação orientada a arquivos e processos', 'Automation centered on files and processes')}</strong>
            <p>{t('Você instala o material em paths conhecidos, controla permissões e executa reload no serviço.', 'You install certificate material at known paths, control permissions, and reload the service.')}</p>
          </div>
          <div>
            <span>Kubernetes</span>
            <strong>{t('Automação orientada a recursos declarativos', 'Automation centered on declarative resources')}</strong>
            <p>{t('O estado desejado fica em Issuer/Certificate; o controlador mantém o Secret atualizado e o consumidor TLS referencia esse Secret.', 'Desired state lives in Issuer/Certificate; the controller keeps the Secret updated and the TLS consumer references that Secret.')}</p>
          </div>
        </div>
      </section>

      <section className="certificate-practices-section" aria-labelledby="certificate-practices-title">
        <h3 id="certificate-practices-title">{t('Boas práticas operacionais', 'Operational best practices')}</h3>
        <div className="certificate-practices-grid">
          <div><strong>{t('Proteja a chave privada', 'Protect the private key')}</strong><p>{t('Permissões mínimas, sem Git, e-mail ou logs.', 'Minimum permissions; keep it out of Git, email, and logs.')}</p></div>
          <div><strong>{t('Monitore antes de expirar', 'Monitor before expiry')}</strong><p>{t('Alerte por expiração, challenge e falha de renovação.', 'Alert on expiry, challenge, and renewal failures.')}</p></div>
          <div><strong>{t('Valide o endpoint real', 'Validate the real endpoint')}</strong><p>{t('Confirme o certificado servido, não apenas o arquivo ou Secret.', 'Confirm the served certificate, not only the file or Secret.')}</p></div>
          <div><strong>{t('Teste a automação', 'Test the automation')}</strong><p>{t('Use dry-run/staging e valide reload ou reconciliação antes de depender do fluxo em produção.', 'Use dry-run/staging and validate reload or reconciliation before relying on the flow in production.')}</p></div>
        </div>
      </section>

      <div className="certificate-infographic-sources">
        <span>{t('Fontes técnicas:', 'Technical sources:')}</span>
        <a href="https://docs.openssl.org/3.4/man1/openssl-req/" target="_blank" rel="noreferrer">OpenSSL CSR</a>
        <a href="https://letsencrypt.org/docs/challenge-types/" target="_blank" rel="noreferrer">Let&apos;s Encrypt challenges</a>
        <a href="https://cert-manager.io/docs/usage/certificate/" target="_blank" rel="noreferrer">cert-manager Certificate</a>
        <a href="https://cert-manager.io/docs/configuration/acme/" target="_blank" rel="noreferrer">cert-manager ACME</a>
      </div>
    </figure>
  );
}
