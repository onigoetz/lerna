import ChildProcessUtilities from "../ChildProcessUtilities";
import logger from "../logger";
import escapeArgs from "command-join";

export default class HgUtilities {
  @logger.logifySync()
  static isInitialized() {

    //TODO :: test for hg binary existence

    try {
      ChildProcessUtilities.execSync("hg identify");
      return true;
    } catch (err) {
      return false;
    }
  }

  @logger.logifySync()
  static addFile(file) {
    ChildProcessUtilities.execSync("hg add " + escapeArgs(file));
  }

  @logger.logifySync()
  static commit(message) {
    // Use echo to allow multi\nline strings.
    ChildProcessUtilities.execSync("hg commit -m \"$(echo \"" + message + "\")\"");
  }

  @logger.logifySync()
  static addTag(tag, sha) {
    ChildProcessUtilities.execSync("hg tag -r " + sha + " " + tag);
  }

  @logger.logifySync()
  static removeTag(tag) {
    ChildProcessUtilities.execSync("hg tag --remove " + tag);
  }

  @logger.logifySync()
  static hasTags() {
    return ChildProcessUtilities.execSync("hg log -r '.' --template '{latesttag}'") !== "null";
  }

  @logger.logifySync()
  static getLastTaggedCommit() {
    return ChildProcessUtilities.execSync("hg log -r 'last(tagged())' --template '{node}'");
  }

  @logger.logifySync()
  static getLastTaggedCommitInBranch() {
    const tagName = HgUtilities.getLastTag();
    return ChildProcessUtilities.execSync(`hg log -r "${tagName}" --template '{node}'`);
  }

  @logger.logifySync()
  static getFirstCommit() {
    return ChildProcessUtilities.execSync("hg log -r '0' -l 1 --template '{node}'");
  }

  @logger.logifySync()
  static pushWithTags(remote, tags) { //eslint-disable-line no-unused-vars

    if (!remote) {
      remote = "default";
    }

    ChildProcessUtilities.execSync(`hg push ${remote}`);
  }

  @logger.logifySync()
  static getLastTag() {
    return ChildProcessUtilities.execSync("hg parents --template '{latesttag}'");
  }

  @logger.logifySync()
  static describeTag(commit) {
    // We don't want the tag name as we can use the commit revision
    // to query hg log, also, returning mutiple tags doesn't work
    return commit;
  }

  static associatedCommits(sha) {
    //TODO :: check if this is sufficient
    return sha;
  }

  @logger.logifySync()
  static diffSinceIn(since, location) {
    return ChildProcessUtilities.execSync("hg status --rev " + since + " -- " + escapeArgs(location));
  }

  @logger.logifyAsync()
  static diff(lastCommit, location, callback) {
    ChildProcessUtilities.spawn("hg", ["diff", lastCommit, "--color=auto", escapeArgs(location)], {}, (code) => {
      if (code) {
        callback(new Error("Errored while spawning `hg diff`."));
      } else {
        callback(null, true);
      }
    });
  }

  @logger.logifySync()
  static getCurrentSHA() {
    return ChildProcessUtilities.execSync("hg parent --template '{node}'");
  }

  @logger.logifySync()
  static getTopLevelDirectory() {
    return ChildProcessUtilities.execSync("hg root");
  }

  @logger.logifySync()
  static checkoutChanges(changes) {
    ChildProcessUtilities.execSync("hg revert --no-backup " + changes);
  }

  @logger.logifySync()
  static getCurrentBranch() {
    return ChildProcessUtilities.execSync("hg branch");
  }

  @logger.logifySync()
  static getCurrentBranchDescription() {
    return ChildProcessUtilities.execSync("hg branch");
  }

  @logger.logifySync()
  static init() {
    return ChildProcessUtilities.execSync("hg init");
  }

  @logger.logifySync()
  static hasCommit() {
    try {
      ChildProcessUtilities.execSync("hg log");
      return true;
    } catch (e) {
      return false;
    }
  }
}
