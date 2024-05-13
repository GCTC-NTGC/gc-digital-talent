import { UserProfile_FragmentText as frontendQuery } from "./ProfilePage";
import { diffLinesRaw, DIFF_EQUAL, diffLinesUnified } from "jest-diff";

const fs = require("fs");
const path = require("path");

function normalizeQuery(q: string[]): string[] {
  const result = q.map((line) => {
    return line
      .replace(/#.*$/gm, "") // strip comments
      .trimEnd(); // strip trailing spaces
  });
  return result.filter((line) => line.length > 0); // strip empty lines
}

describe("Profile snapshot tests", () => {
  test("Should have both queries matching", () => {
    const frontendQueryLines = normalizeQuery(frontendQuery.split("\n"));
    if (frontendQueryLines[0].trimStart().startsWith("fragment UserProfile")) {
      // expect that first line will be different so remove it from test
      frontendQueryLines.splice(0, 1);
    }

    const backendQueryPath = path.resolve(
      "~/../../../api/app/GraphQL/Mutations/PoolCandidateSnapshot.graphql",
    );
    const backendQuery = fs.readFileSync(
      backendQueryPath,
      "utf8",
      function (err: any, data: any) {
        return data;
      },
    );
    const backendQueryLines = normalizeQuery(backendQuery.split("\n"));
    if (
      backendQueryLines[0].trimStart().startsWith("query getProfile(") &&
      backendQueryLines[1].trimStart().startsWith("user(")
    ) {
      // expect that first two lines will be different so remove them from test
      backendQueryLines.splice(0, 2);
    }

    const diffAnalysis = diffLinesRaw(frontendQueryLines, backendQueryLines);
    const unequalLineCount = diffAnalysis.filter(
      // filter for lines that are not equal
      (diff) => diff[0] != DIFF_EQUAL,
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
      console.debug(prettyDiff);
    }

    expect(unequalLineCount).toEqual(0);
  });
});
