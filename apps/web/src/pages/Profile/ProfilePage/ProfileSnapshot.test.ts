import path from "path";
import { readFile } from "fs/promises";

import { diffLinesRaw, DIFF_EQUAL, diffLinesUnified } from "jest-diff";

import { UserProfile_FragmentText as frontendQuery } from "./ProfilePage";

function normalizeQuery(q: string[]): string[] {
  const result = q.map((line) => {
    return line
      .replace(/#.*$/gm, "") // strip comments
      .trimEnd(); // strip trailing spaces
  });
  return result.filter((line) => line.length > 0); // strip empty lines
}

describe("Profile snapshot tests", () => {
  // remove .skip in #12648.
  test.skip("Should have frontend and backend queries matching", async () => {
    const frontendQueryLines = normalizeQuery(frontendQuery.split("\n"));
    // expect that the outer layer will be different so remove it from test
    if (
      frontendQueryLines.at(0)?.trim() === "fragment UserProfile on User {" &&
      frontendQueryLines.at(-1)?.trim() === "}"
    ) {
      frontendQueryLines.splice(0, 1);
      frontendQueryLines.splice(-1, 1);
    }

    const backendQueryPath = path.resolve(
      "~/../../../api/app/GraphQL/Mutations/PoolCandidateSnapshot.graphql",
    );
    const backendQuery = await readFile(backendQueryPath, { encoding: "utf8" });
    const backendQueryLines = normalizeQuery(backendQuery.split("\n"));
    // expect that the outer two layers will be different so remove them from test
    if (
      backendQueryLines.at(0)?.trim() ===
        "query getProfile($userId: UUID!) {" &&
      backendQueryLines.at(1)?.trim() === "user(id: $userId) {" &&
      backendQueryLines.at(-2)?.trim() === "}" &&
      backendQueryLines.at(-1)?.trim() === "}"
    ) {
      backendQueryLines.splice(0, 2);
      backendQueryLines.splice(-2, 2);
    }

    const diffAnalysis = diffLinesRaw(frontendQueryLines, backendQueryLines);
    const unequalLineCount = diffAnalysis.filter(
      // filter for lines that are not equal
      (diff) => diff[0] !== DIFF_EQUAL,
    ).length;

    if (unequalLineCount > 0) {
      const prettyDiff = diffLinesUnified(
        frontendQueryLines,
        backendQueryLines,
        {
          aAnnotation: "Frontend",
          bAnnotation: "Backend",
          includeChangeCounts: true,
        },
      );
      process.stdout.write(prettyDiff);
    }

    expect(unequalLineCount).toEqual(0);
  });
});
