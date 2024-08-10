import spinner from "../utils/spinner.js";
import chalk from "chalk";
import path from "path";
import inquirer from "inquirer";
import fs from "fs";
import exec from "../utils/exec.js";
import IA from "../utils/IA.js";
import config from "../utils/config.js";

export default async function gyt() {
  function isGitRepository() {
    const directory = process.cwd();

    return new Promise((resolve, reject) => {
      const gitDir = path.join(directory, ".git");

      fs.access(gitDir, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  if (!(await isGitRepository())) {
    console.log(
      `❌ Essa pasta não é um repositório, use o comando "git init" para iniciar um repositório.`
    );
    return;
  }

  const my_config = config().get();

  if (!my_config) {
    console.log(
      `❌ Você ainda não definiu suas credenciais. Use o comando "gyt login" para fazer isso.`
    );
    return;
  }

  const closeCheckDiff = spinner(`${chalk.blue("◇")}  🔎 Buscando alterações feitas no projeto...`);

  const diff = await exec(`git diff`);

  closeCheckDiff();

  if (diff.trim().length <= 0) {
    console.log(`❌ Não encontramos nenhuma diferença no código para efetuar um commit`);
    return;
  }

  console.log("│");

  const closeCommitMessgaeSpinner = spinner(
    ` ${chalk.blue("◇")}  ✍️  Estamos escrevendo sua mensagem de commit...`
  );

  const response_ia = await IA().generateCommitMessage(diff);

  closeCommitMessgaeSpinner();

  let prompt = response_ia.resume;

  console.log(` ${chalk.blue("◇")}  ${prompt}`);

  console.log("│");

  const { confirmPrompt } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmPrompt",
      message: `${chalk.blue("◇")}  ❔ Deseja confirmar esse commit ?`,
      default: true,
      theme: {
        prefix: "",
      },
    },
  ]);

  console.log("│");

  if (!confirmPrompt) {
    const { newCommitMessage } = await inquirer.prompt([
      {
        type: "input",
        name: "newCommitMessage",
        message: `${chalk.blue("◇")}  ✍️  Altere a sua mensagem de commit:`,
        default: prompt,
        theme: {
          prefix: "",
        },
      },
    ]);

    prompt = newCommitMessage;

    console.log("│");
  }

  const closeAddFilesSpinner = spinner(
    ` ${chalk.blue("◇")}  📃  Estamos adicionando os arquivos ao seu commit...`
  );

  await exec("git add .");

  closeAddFilesSpinner();

  const closeSendCommitSpinner = spinner(` ${chalk.blue("◇")}  🚀  Estamos enviando o commit...`);

  await exec(`git commit -m "${(prompt.replace(/\"/g), "\\")}"`);

  closeSendCommitSpinner();

  console.log(` ${chalk.blue("◇")}  📃  Arquivos adicionados ao seu commit com sucesso.`);
  console.log("│");
  console.log(` ${chalk.blue("◇")}  🚀  Commit enviado com sucesso.`);
  console.log("│");
}
