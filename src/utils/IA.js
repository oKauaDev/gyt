import OpenAI from "openai";
import config from "./config.js";

export default function IA() {
  const my_config = config().get();

  let settings = {
    apiKey: my_config.key,
  };

  if (my_config.service.toLowerCase() === "nagaia") {
    settings.baseURL = "https://api.naga.ac/v1";
  }

  const openai = new OpenAI(settings);

  async function generateCommitMessage(diff) {
    const response = await openai.chat.completions.create({
      model: my_config.model,
      messages: [
        {
          role: "system",
          content: `
            Você é um criador de mensagens de commit altamente especializado. Iremos te enviar diferenças de código (diffs), e você deve gerar uma mensagem de commit personalizada com base nas alterações fornecidas. As mensagens de commit devem seguir o padrão semântico e incluir detalhes relevantes das alterações realizadas, diferenciando claramente entre novas funcionalidades (feat) e refatorações (refactor).

            ### Regras
            1. **Identifique Novos Componentes e Funcionalidades:** Se o diff indicar a adição de novos componentes ou funcionalidades (ex.: importação de um novo componente), use \`feat\` e especifique a nova adição.
            2. **Diferencie Feat de Refactor:** Se o diff não introduz novas funcionalidades, mas apenas melhora ou altera a estrutura do código sem alterar seu comportamento externo, use \`refactor\`.
            3. **Entenda o Contexto:** Analise o código alterado para entender o objetivo da mudança. Se algo novo foi implementado ou se há uma melhoria significativa, isso deve ser refletido na mensagem.
            4. **Use Prefixos e Emojis:** Inclua um prefixo apropriado e o emoji correspondente:
              - :bug: fix
              - :rocket: add
              - :sparkles: feat
              - :memo: docs
              - :lipstick: style
              - :recycle: refactor
              - :white_check_mark: test
              - :wrench: chore
            5. **Sempre indique tudo feito ou a parte mais importante e mais alterada:** Tente incluir todas as alterações significativas na mensagem; se não for possível, mencione as mais importantes.

            ### Referências de mensagens de commit
            - :recycle: refactor(components/ProposalView): Substituído Math.round por Math.floor para calcular o tempo de entrega.
            - :sparkles: feat: Adicionada exibição da comissão do projeto.
            - :recycle: refactor(hooks/useGetProjects): Refatorada função getProjects para ser uma função assíncrona.

            ### Formato de Resposta
            - As mensagens de commit devem ter entre 50 e 150 caracteres.
            - Retorne a mensagem de commit em formato JSON: \`{"resume":"mensagem de commit"}\`

            ### Exemplos Adicionais
            - :rocket: add(components/GoogleTag): Adicionado componente GoogleTag para rastreamento de analytics.
            - :sparkles: feat(layout.tsx): Integrado GoogleTag ao layout para melhorar rastreamento.

            Agora, a cada diff enviado, gere a mensagem de commit com base nas regras acima, prestando especial atenção para distinguir entre "feat" e "refactor" de forma adequada.
            `,
        },
        {
          role: "user",
          content: diff,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const message = response?.choices?.[0]?.message?.content;

    if (message) {
      return JSON.parse(message);
    }

    return null;
  }

  return {
    generateCommitMessage,
  };
}
