import { exec as _nodeExec } from "child_process";

export default function exec(command) {
  return new Promise((resolve, reject) => {
    _nodeExec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        reject(`Erro ao executar o comando: ${stderr}`);
      } else {
        resolve(stdout);
      }
    });
  });
}
