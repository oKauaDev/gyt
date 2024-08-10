import ora from "ora";

export default function spinner(message) {
  const spinner = ora({
    text: message,
    spinner: {
      frames: ["◐", "◓", "◑", "◒"],
      interval: 100,
    },
  }).start();

  return () => {
    spinner.stop();
  };
}
