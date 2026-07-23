export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 mt-8">
      <h1 className="mb-2 text-3xl font-bold">Termos de Uso - Veloce</h1>
      <p className="text-muted-foreground mb-8 text-sm">Última atualização: Julho de 2026</p>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">
          1. Natureza do Projeto <span className="text-muted-foreground text-base font-normal">(Aviso Importante)</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          O Veloce é uma aplicação web desenvolvida exclusivamente para fins de demonstração técnica
          e portfólio profissional. Este site <strong>NÃO</strong> é um e-commerce real. Nenhuma
          transação comercial verdadeira é realizada, e nenhum produto físico ou digital será enviado
          ou entregue.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">2. Aceitação dos Termos</h2>
        <p className="text-muted-foreground leading-relaxed">
          Ao acessar e utilizar o Veloce, você concorda com estes Termos de Uso e reconhece a
          natureza fictícia da plataforma. Se você não concorda com estes termos, por favor, não
          utilize o site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">3. Contas de Usuário e Segurança</h2>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6 leading-relaxed">
          <li>Você pode criar uma conta usando seu e-mail ou autenticação via Google.</li>
          <li>
            <strong>Recomendação de Segurança:</strong> Como se trata de um ambiente de testes,
            recomendamos expressamente que você não utilize senhas pessoais ou sensíveis que já
            utiliza em outros serviços reais.
          </li>
          <li>
            Reservamo-nos o direito de apagar contas, zerar o banco de dados e remover informações
            a qualquer momento, sem aviso prévio, para manutenção do portfólio.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">4. Pagamentos e Compras Fictícias</h2>
        <p className="text-muted-foreground leading-relaxed">
          O sistema de checkout é integrado ao ambiente de testes do Stripe.
        </p>
        <ul className="text-muted-foreground mt-2 list-disc space-y-2 pl-6 leading-relaxed">
          <li>
            <strong>NUNCA</strong> insira dados de um cartão de crédito real.
          </li>
          <li>
            Para testar o fluxo de pagamento, utilize apenas os cartões de crédito fictícios
            fornecidos publicamente pela documentação do Stripe.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">5. Propriedade Intelectual</h2>
        <p className="text-muted-foreground leading-relaxed">
          O código-fonte e a arquitetura do Veloce são de propriedade do desenvolvedor. Imagens de
          produtos e logotipos de terceiros utilizados aqui são meramente ilustrativos e pertencem
          aos seus respectivos donos, configurando uso aceitável (fair use) para fins educacionais.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">6. Contato</h2>
        <p className="text-muted-foreground leading-relaxed">
          Para dúvidas técnicas, feedbacks ou propostas profissionais, entre em contato através do
          LinkedIn ou repositório do projeto.
        </p>
      </section>
    </div>
  );
}
