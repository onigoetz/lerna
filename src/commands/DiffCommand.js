import ScmUtilities from "../scm/ScmUtilities";
import Command from "../Command";
import find from "lodash/find";

export default class DiffCommand extends Command {
  initialize(callback) {
    this.packageName = this.input[0];

    if (this.packageName) {
      this.package = find(this.packages, (pkg) => {
        return pkg.name === this.packageName;
      });

      if (!this.package) {
        callback(new Error("Package '" + this.packageName + "' does not exist."));
        return;
      }
    }

    if (!ScmUtilities.hasCommit()) {
      callback(new Error("Can't diff. There are no commits in this repository, yet."));
      return;
    }

    this.filePath = this.package
      ? this.package.location
      : this.repository.rootPath;

    this.lastCommit = ScmUtilities.hasTags()
      ? ScmUtilities.getLastTaggedCommit()
      : ScmUtilities.getFirstCommit();

    callback(null, true);
  }

  execute(callback) {
    ScmUtilities.diff(this.lastCommit, this.filePath, callback);

  }
}
