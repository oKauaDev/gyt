import { simpleGit } from "simple-git";

export default class GitManager {
  static diff() {
    return new Promise((resolve, reject) => {
      simpleGit().diff(undefined, (err, changes) => {
        if (err) {
          reject(err);
        } else {
          resolve(changes);
        }
      });
    });
  }

  static status() {
    return new Promise((resolve, reject) => {
      simpleGit().status(undefined, (err, status) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.stringify(status.files));
        }
      });
    });
  }
}
