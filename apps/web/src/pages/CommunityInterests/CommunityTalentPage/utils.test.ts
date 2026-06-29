import { extractUserIdsFromSelectedRows } from "./utils";

describe("extractUserIdsFromSelectedRows", () => {
  it("should extract user IDs from a list of row IDs", () => {
    const input = ["row123_userId#abc", "row456_userId#def"];
    const result = extractUserIdsFromSelectedRows(input);

    expect(result).toEqual(["abc", "def"]);
  });

  it("should return only unique IDs if duplicates are present", () => {
    const input = [
      "row1_userId#user123",
      "row2_userId#user123",
      "row3_userId#user456",
    ];
    const result = extractUserIdsFromSelectedRows(input);

    expect(result).toEqual(["user123", "user456"]);
    expect(result).toHaveLength(2);
  });

  it("should return an empty array when given an empty input", () => {
    const result = extractUserIdsFromSelectedRows([]);
    expect(result).toEqual([]);
  });

  it("should handle IDs that do not contain the prefix gracefully", () => {
    const input = ["invalid_string"];
    const result = extractUserIdsFromSelectedRows(input);

    expect(result).toEqual([undefined]);
  });
});
