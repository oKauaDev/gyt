import inquirer from "inquirer";
import chalk from "chalk";
import config from "../utils/config.js";

export default async function login(remove) {
  if (remove) {
    if (config().delete()) {
      console.log(`${chalk.blue("◇")}  ✅ API Key removida com sucesso.\n`);
      return;
    } else {
      console.log(`${chalk.blue("◇")}  ❌ Falha ao remover API Key.\n`);
      return;
    }
    return;
  }

  console.log("│");

  const { service } = await inquirer.prompt([
    {
      type: "list",
      name: "service",
      message: `${chalk.blue("◇")}  ⚙️  Escolha um serviço:`,
      choices: ["OpenAI", "NagaIA"],
      theme: {
        prefix: "",
      },
    },
  ]);

  console.log("│");

  const { apiKey } = await inquirer.prompt([
    {
      type: "input",
      name: "apiKey",
      message: `${chalk.blue("◇")}  🔌 Insira sua API Key para ${service}:`,
      theme: {
        prefix: "",
      },
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Por favor, insira uma API Key válida.";
        }
      },
    },
  ]);

  console.log("│");

  const { model } = await inquirer.prompt([
    {
      type: "list",
      name: "model",
      message: `${chalk.blue(
        "◇"
      )}  🤖  Escolha o seu modelo de IA (se form um modelo pago sua API key deve ter ela comprada):`,
      choices: [
        "gpt-4o",
        "gpt-4o-2024-08-06",
        "gpt-4o-2024-05-13",
        "gpt-4o-mini",
        "gpt-4o-mini-2024-07-18",
        "gpt-4-turbo",
        "gpt-4-turbo-2024-04-09",
        "gpt-4-turbo-preview",
        "gpt-4-0125-preview",
        "gpt-4-1106-preview",
        "gpt-4",
        "gpt-4-0613",
        "gpt-3.5-turbo",
        "gpt-3.5-turbo-0125",
        "gpt-3.5-turbo-1106",
      ],
      theme: {
        prefix: "",
      },
    },
  ]);

  console.log("│");

  if (config().save(service, apiKey, model)) {
    console.log(` ${chalk.blue("◇")}  ✅ API Key salva com sucesso.`);
    console.log("│");
    return;
  }

  console.log(` ${chalk.blue("◇")}  ❌ Falha ao salvar a API Key.`);

  console.log("│");
}
