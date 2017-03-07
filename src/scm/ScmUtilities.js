import HgUtilities from "./HgUtilities";
import GitUtilities from "./GitUtilities";
import logger from "../logger";

let scm = "git"; // Keep git as default

export default class ScmUtilities {

  static setSCM(newScm) {
    scm = newScm;
  }

  static getSCM() {
    if (scm == "hg") {
      return HgUtilities;
    }

    return GitUtilities;
  }

  static detectScm() {
    if (GitUtilities.isInitialized()) {
      logger.info("Found Git Repository");
      return;
    }

    if (HgUtilities.isInitialized()) {
      logger.info("Found HG Repository");
      scm = "hg";
    }
  }

  static isInitialized() {
    return ScmUtilities.getSCM().isInitialized();
  }

  static addFile(file) {
    ScmUtilities.getSCM().addFile(file);
  }

  static commit(message) {
    ScmUtilities.getSCM().commit(message);
  }

  static addTag(tag, sha) {
    ScmUtilities.getSCM().addTag(tag, sha);
  }

  static removeTag(tag) {
    ScmUtilities.getSCM().removeTag(tag);
  }

  static hasTags() {
    return ScmUtilities.getSCM().hasTags();
  }

  static getLastTaggedCommit() {
    return ScmUtilities.getSCM().getLastTaggedCommit();
  }

  static getFirstCommit() {
    return ScmUtilities.getSCM().getFirstCommit();
  }

  static pushWithTags(origin, tags) {
    return ScmUtilities.getSCM().pushWithTags(origin, tags);
  }

  static describeTag(commit) {
    return ScmUtilities.getSCM().describeTag(commit);
  }

  static associatedCommits(sha) {
    return ScmUtilities.getSCM().associatedCommits(sha);
  }

  static diffSinceIn(since, location) {
    return ScmUtilities.getSCM().diffSinceIn(since, location);
  }

  static diff(lastCommit, location, callback) {
    ScmUtilities.getSCM().diff(lastCommit, location, callback);
  }

  static getCurrentSHA() {
    return ScmUtilities.getSCM().getCurrentSHA();
  }

  static getTopLevelDirectory() {
    return ScmUtilities.getSCM().getTopLevelDirectory();
  }

  static checkoutChanges(changes) {
    return ScmUtilities.getSCM().checkoutChanges(changes);
  }

  static getCurrentBranch() {
    return ScmUtilities.getSCM().getCurrentBranch();
  }

  static init() {
    return ScmUtilities.getSCM().init();
  }

  static hasCommit() {
    return ScmUtilities.getSCM().hasCommit();
  }
}
