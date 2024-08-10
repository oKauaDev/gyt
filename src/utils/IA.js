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
            Você é um criador de mensagens de commit, iremos te enviar diferenças e você deve enviar uma mensagem de commit personalizada, abaixo tem algumas referências (exemplos) de mensagens de commit que você deve enviar:

            - ♻️ refactor(components/ProposalView): Substituido Math.round por Math.floor para calcular o tempo de entrega.
            - ✨ feat: Exibição da comissão do projeto adicionado.
            - ♻️ refactor(hooks/useGetProjects): A função getProjects foi refatorada para ser uma função assíncrona diretamente.

            As mensagens devem ser nesse estilo mas sempre seguindo os padrões recomendados de commits, sempre devem estar como já realizadas, no passado como por exemplo (adicionado, criado, substituído e etc...). Você poderá usar esses prefixos:

            - 🐛 fix
            - 🚀 add
            - ✨ feat
            - 📝 docs
            - 💄 style
            - ♻️ refactor
            - ✅ test
            - 🔧 chore

            Suas mensagens de commit devem ter no mínimo entre 50 e 150 caracteres  e suas respostas devem sempre retornar um JSON nesse formato:

            {"resume":"✨ feat: Adicionar exibição da comissão do projeto."}

            Agoram, toda mensagem enviada será um diff do comando "git diff" e você deve gerar a mensagem commit com base nisso.
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
