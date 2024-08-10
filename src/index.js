#!/usr/bin/env node

import gyt from "./commands/gyt.js";
import login from "./commands/login.js";
import { Command } from "commander";
const program = new Command();

const TEXT = {
  // Text colors
  COLOR: {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
  },

  // Background colors
  BG: {
    BLACK: "\x1b[40m",
    RED: "\x1b[41m",
    GREEN: "\x1b[42m",
    YELLOW: "\x1b[43m",
    BLUE: "\x1b[44m",
    MAGENTA: "\x1b[45m",
    CYAN: "\x1b[46m",
    WHITE: "\x1b[47m",
  },

  // Text styles
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  DIM: "\x1b[2m",
  UNDERSCORE: "\x1b[4m",
  BLINK: "\x1b[5m",
  REVERSE: "\x1b[7m",
  HIDDEN: "\x1b[8m",
};

program
  .name("gyt")
  .description("Comando para enviar commits com ia")
  .action(async (args) => {
    try {
      await gyt(args);
    } catch (e) {
      console.clear();
      if (e instanceof Error) {
        if (e.message.includes("force closed")) {
          console.log("\n\n🔴 Operação abortada pelo usuário. Saindo...\n");
          process.exit();
          return;
        }

        // console.log(`${TEXT.COLOR.RED}❌ Erro: ${TEXT.COLOR.YELLOW}${e.message}`);
        return;
      }

      // console.log(`${TEXT.COLOR.RED}❌ Erro: ${TEXT.COLOR.YELLOW}${String(e)}`);
    }
  });

program
  .name("gyt")
  .command("login")
  .option("-r, --remove", "Remover o seu login")
  .description("Comando para se logar na sua IA.")
  .action(async (args) => {
    try {
      await login(args.remove ?? false);
    } catch (e) {
      console.clear();
      if (e instanceof Error) {
        if (e.message.includes("force closed")) {
          console.log("\n\n🔴 Operação abortada pelo usuário. Saindo...\n");
          process.exit();
          return;
        }

        console.log(`${TEXT.COLOR.RED}❌ Erro: ${TEXT.COLOR.YELLOW}${e.message}`);
        return;
      }

      console.log(`${TEXT.COLOR.RED}❌ Erro: ${TEXT.COLOR.YELLOW}${String(e)}`);
    }
  });

program.parse(process.argv);
