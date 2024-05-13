import { UserProfile_FragmentText as frontendQuery } from "./ProfilePage";
import { diffLinesUnified } from "jest-diff";

const fs = require("fs");
const path = require("path");

describe("Profile snapshot tests", () => {
  test("Should have both queries matching", () => {
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

    const difference = diffLinesUnified(
      frontendQuery.split("\n"),
      backendQuery.split("\n"),
    );

    if (difference) {
      console.error(difference);
    }
  });
});
