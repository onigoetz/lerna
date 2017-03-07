import ChildProcessUtilities from "../ChildProcessUtilities";
import logger from "../logger";
import escapeArgs from "command-join";

export default class GitUtilities {
  @logger.logifySync()
  static isInitialized() {
    try {
      ChildProcessUtilities.execSync("git rev-parse");
      return true;
    } catch (err) {
      return false;
    }
  }

  @logger.logifySync()
  static addFile(file) {
    ChildProcessUtilities.execSync("git add " + escapeArgs(file));
  }

  @logger.logifySync()
  static commit(message) {
    // Use echo to allow multi\nline strings.
    ChildProcessUtilities.execSync("git commit -m \"$(echo \"" + message + "\")\"");
  }

  @logger.logifySync()
  static addTag(tag, sha) { //eslint-disable-line no-unused-vars
    ChildProcessUtilities.execSync("git tag " + tag);
  }

  @logger.logifySync()
  static removeTag(tag) {
    ChildProcessUtilities.execSync("git tag -d " + tag);
  }

  @logger.logifySync()
  static hasTags() {
    return !!ChildProcessUtilities.execSync("git tag");
  }

  @logger.logifySync()
  static getLastTaggedCommit() {
    return ChildProcessUtilities.execSync("git rev-list --tags --max-count=1");
  }

  @logger.logifySync()
  static getLastTaggedCommitInBranch() {
    const tagName = GitUtilities.getLastTag();
    return ChildProcessUtilities.execSync("git rev-list -n 1 " + tagName);
  }

  @logger.logifySync()
  static getFirstCommit() {
    return ChildProcessUtilities.execSync("git rev-list --max-parents=0 HEAD");
  }

  @logger.logifySync()
  static pushWithTags(remote, tags) {

    if (!remote) {
      remote = "origin";
    }

    ChildProcessUtilities.execSync(`git push ${remote} ${GitUtilities.getCurrentBranch()}`);
    ChildProcessUtilities.execSync(`git push ${remote} ${tags.join(" ")}`);
  }

  @logger.logifySync()
  static getLastTag() {
    return ChildProcessUtilities.execSync("git describe --tags --abbrev=0");
  }

  @logger.logifySync()
  static describeTag(commit) {
    return ChildProcessUtilities.execSync("git describe --tags " + commit);
  }

  static associatedCommits(sha) {
    // if it's a merge commit, it will return all the commits that were part of the merge
    // ex: If `ab7533e` had 2 commits, ab7533e^..ab7533e would contain 2 commits + the merge commit
    return sha.slice(0, 8) + "^.." + sha.slice(0, 8);
  }

  @logger.logifySync()
  static diffSinceIn(since, location) {
    return ChildProcessUtilities.execSync("git diff --name-only " + since + " -- " + escapeArgs(location));
  }

  @logger.logifyAsync()
  static diff(lastCommit, location, callback) {
    ChildProcessUtilities.spawn("git", ["diff", lastCommit, "--color=auto", escapeArgs(location)], {}, (code) => {
      if (code) {
        callback(new Error("Errored while spawning `git diff`."));
      } else {
        callback(null, true);
      }
    });
  }

  @logger.logifySync()
  static getCurrentSHA() {
    return ChildProcessUtilities.execSync("git rev-parse HEAD");
  }

  @logger.logifySync()
  static getTopLevelDirectory() {
    return ChildProcessUtilities.execSync("git rev-parse --show-toplevel");
  }

  @logger.logifySync()
  static checkoutChanges(changes) {
    ChildProcessUtilities.execSync("git checkout -- " + changes);
  }

  @logger.logifySync()
  static getCurrentBranch() {
    return ChildProcessUtilities.execSync("git symbolic-ref --short HEAD");
  }

  @logger.logifySync()
  static getCurrentBranchDescription() {
    return ChildProcessUtilities.execSync("git symbolic-ref --short -q HEAD");
  }

  @logger.logifySync()
  static init() {
    return ChildProcessUtilities.execSync("git init");
  }

  @logger.logifySync()
  static hasCommit() {
    try {
      ChildProcessUtilities.execSync("git log");
      return true;
    } catch (e) {
      return false;
    }
  }
}
