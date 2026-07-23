export default function PrivacidadePage() {
  return (
    <div className="mx-auto mt-8 max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Política de Privacidade - Veloce</h1>
      <p className="text-muted-foreground mb-8 text-sm">Última atualização: Julho de 2026</p>

      <p className="text-muted-foreground mb-8 leading-relaxed">
        No Veloce, a sua privacidade é levada a sério, mesmo sendo este um ambiente de
        demonstração técnica. Esta política descreve como coletamos e usamos as informações geradas
        durante o seu teste na plataforma.
      </p>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">1. Informações que Coletamos</h2>
        <p className="text-muted-foreground mb-2 leading-relaxed">
          Para que você possa testar as funcionalidades (como carrinho, checkout e perfil),
          coletamos as seguintes informações:
        </p>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6 leading-relaxed">
          <li>
            <strong>Dados de Cadastro:</strong> Nome e endereço de e-mail (fornecidos manualmente ou
            via Google OAuth).
          </li>
          <li>
            <strong>Dados de Navegação:</strong> Seu endereço de IP é processado temporariamente por
            nossos sistemas de segurança (Rate Limiting) para prevenir abusos e ataques de força
            bruta na API.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">2. Como Usamos suas Informações</h2>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6 leading-relaxed">
          <li>Para autenticar seu acesso à plataforma.</li>
          <li>Para simular a criação de pedidos e o funcionamento de um painel de usuário real.</li>
          <li>Para garantir a segurança da infraestrutura técnica contra bots.</li>
        </ul>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          <strong>Atenção:</strong> Seus dados <strong>NUNCA</strong> serão vendidos, alugados ou
          utilizados para envio de marketing (spam).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">3. Serviços de Terceiros</h2>
        <p className="text-muted-foreground mb-2 leading-relaxed">
          Para simular um ambiente de produção moderno, o Veloce utiliza serviços de terceiros que
          podem processar dados:
        </p>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6 leading-relaxed">
          <li>
            <strong>Google Cloud (OAuth):</strong> Utilizado para permitir o login simplificado. O
            Google processa sua autenticação conforme suas próprias políticas de privacidade.
          </li>
          <li>
            <strong>Stripe:</strong> Utilizado para simular o gateway de pagamento. O processamento
            ocorre em ambiente de &quot;Test Mode&quot;. Nenhum dado financeiro real deve ser
            inserido.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">4. Retenção e Exclusão de Dados</h2>
        <p className="text-muted-foreground leading-relaxed">
          Como o Veloce é um portfólio, o banco de dados é limpo e resetado periodicamente. Todas
          as contas de teste e pedidos simulados são deletados de forma irreversível nessas
          manutenções. Caso deseje que seus dados de teste sejam removidos imediatamente, basta
          solicitar.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">5. Uso de Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          Utilizamos cookies estritamente necessários para manter sua sessão de usuário ativa e
          garantir a segurança das requisições entre o frontend e o backend.
        </p>
      </section>
    </div>
  );
}
