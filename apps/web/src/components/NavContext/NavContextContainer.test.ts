import { chooseNavRole } from "./NavContextContainer";

describe("NavContextContainer", () => {
  // if no authorized roles are provided it falls back to guest
  it("falls back to null", () => {
    expect(chooseNavRole("admin", [])).toBe(null);
  });

  // if it has a choice, it will keep the existing nav role
  it("keeps the existing nav role if possible", () => {
    expect(
      chooseNavRole("community", [
        "guest",
        "base_user",
        "applicant",
        "community_manager",
        "process_operator",
        "community_recruiter",
        "community_admin",
        "platform_admin",
      ]),
    ).toBe("community");
  });

  // if it does not have a choice, it choose the least privileged nav role possible
  it("chooses the least privileged nav role if it has to change", () => {
    expect(
      chooseNavRole("admin", [
        "applicant",
        "community_manager",
        "process_operator",
        "community_recruiter",
        "community_admin",
      ]),
    ).toBe("applicant");
  });
});
