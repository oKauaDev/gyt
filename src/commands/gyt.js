import spinner from "../utils/spinner.js";
import chalk from "chalk";
import path from "path";
import inquirer from "inquirer";
import fs from "fs";
import exec from "../utils/exec.js";
import IA from "../utils/IA.js";
import config from "../utils/config.js";
import emoji from "../utils/emoji.js";

export default async function gyt() {
  function isGitRepository() {
    const directory = process.cwd();

    return new Promise((resolve) => {
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

  let diff = "";

  try {
    diff = await exec(`git diff -- . ':!package-lock.json'`);
  } catch {
    diff = await exec("git status");
  }

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

  console.log(` ${chalk.blue("◇")}  ${emoji(prompt)}`);

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
  prompt = prompt.replace(/"/g, '\\"');

  await exec(`git commit -m "${prompt}"`);

  closeSendCommitSpinner();

  console.log(` ${chalk.blue("◇")}  📃  Arquivos adicionados ao seu commit com sucesso.`);
  console.log("│");
  console.log(` ${chalk.blue("◇")}  🚀  Commit enviado com sucesso.`);
  console.log("│");

  const { confirmPush } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmPush",
      message: `${chalk.blue("◇")}  ❔ Você deseja efetuar o push (comando: "git push") ?`,
      default: true,
      theme: {
        prefix: "",
      },
    },
  ]);

  if (confirmPush) {
    console.log("│");
    const closePushSpinner = spinner(` ${chalk.blue("◇")}  🚀  Estamos enviando o commit...`);
    await exec(`git push`);
    closePushSpinner();
    console.log(` ${chalk.blue("◇")}  📦  Enviamos o seu commit para o repositório online.`);
    console.log("│");
  }
}
