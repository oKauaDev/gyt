import path from "path";
import { fileURLToPath } from "url";
import { WebpackProgressOraPlugin } from "webpack-progress-ora-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.js",
  output: {
    filename: "bundle.jcs",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
  target: "node",
  resolve: {
    extensions: [".js", ".json"],
  },
  mode: "production", // production or development
  plugins: [new WebpackProgressOraPlugin({})],
};
