import fs from "fs";
import path from "path";

export default function config() {
  const homeDir = process.env.USERPROFILE || process.env.HOME;

  if (!fs.existsSync(path.join(homeDir, "gyt"))) {
    fs.mkdirSync(path.join(homeDir, "gyt"), { recursive: true });
  }

  const file = path.join(homeDir, "gyt", "config.json");

  function save(service, key, model) {
    try {
      fs.writeFileSync(
        file,
        JSON.stringify(
          {
            service,
            key,
            model,
          },
          null,
          2
        )
      );

      return true;
    } catch {
      return false;
    }
  }

  function get() {
    try {
      fs.accessSync(file);
      const data = fs.readFileSync(file, "utf8");
      const jsonData = JSON.parse(data);

      return jsonData;
    } catch (error) {
      return null;
    }
  }

  function remove() {
    try {
      fs.accessSync(file);
      fs.unlinkSync(file);
      return true;
    } catch {
      return false;
    }
  }

  return {
    save,
    get,
    delete: remove,
  };
}
