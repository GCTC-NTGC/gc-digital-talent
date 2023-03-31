import { Role } from "@gc-digital-talent/graphql";
import toLocalizedString from "./fakeLocalizedString";

export default (): Role[] => {
  return [
    {
      id: "role1",
      name: "role_active",
      isTeamBased: false,
      displayName: toLocalizedString("Active Role"),
    },
    {
      id: "role2",
      name: "role_inactive",
      isTeamBased: false,
      displayName: toLocalizedString("Inactive Role"),
    },
    {
      id: "role3",
      name: "membership_active",
      isTeamBased: true,
      displayName: toLocalizedString("Active Membership"),
    },
    {
      id: "role4",
      name: "membership_inactive",
      isTeamBased: true,
      displayName: toLocalizedString("Inactive Membership"),
    },
  ];
};
