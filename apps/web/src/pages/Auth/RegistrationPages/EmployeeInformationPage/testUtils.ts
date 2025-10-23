import { fakeLocalizedEnum } from "@gc-digital-talent/fake-data";
import { EmploymentCategory } from "@gc-digital-talent/graphql";

export const getFakeWorkFieldOptionsResponse = () => ({
  WorkFieldOptions: {
    data: {
      employmentCategoryTypes: fakeLocalizedEnum(EmploymentCategory).map(
        (c) => ({
          __typename: "LocalizedEmploymentCategory",
          ...c,
        }),
      ),
    },
  },
});
