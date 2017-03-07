import assert from "assert";

import ScmUtilities from "../src/scm/ScmUtilities";
import HgUtilities from "../src/scm/HgUtilities";
import GitUtilities from "../src/scm/GitUtilities";

describe("ScmUtilities", () => {
  describe(".getSCM()", () => {
    it("should exist", () => {
      assert.ok(ScmUtilities.getSCM);
    });

    it("Should return Git by default", () => {
      assert.strictEqual(ScmUtilities.getSCM(), GitUtilities);
    });

    it("Should return Hg when it is set", () => {
      ScmUtilities.setSCM("hg");
      assert.strictEqual(ScmUtilities.getSCM(), HgUtilities);

      // Ugly global variable, resetting it for next tests
      ScmUtilities.setSCM("git");
    });
  });

  describe(".detectScm()", () => {
    it("should exist", () => {
      assert.ok(ScmUtilities.detectScm);
    });
  });
});
