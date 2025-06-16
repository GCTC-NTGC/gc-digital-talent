import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { Select } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import { getExperienceFormLabels } from "~/utils/experienceUtils";
import experienceMessages from "~/messages/experienceMessages";

const SelectExperience = () => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <section>
      <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
        {experienceFormLabels.selectType}
      </Heading>
      <Select
        label={experienceFormLabels.type}
        name="experienceType"
        id="experienceType"
        doNotSort
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        nullSelection={experienceFormLabels.typeNullSelection}
        options={[
          {
            value: "work",
            label: intl.formatMessage(experienceMessages.work),
          },
          {
            value: "education",
            label: intl.formatMessage(experienceMessages.education),
          },
          {
            value: "community",
            label: intl.formatMessage(experienceMessages.community),
          },
          {
            value: "personal",
            label: intl.formatMessage(experienceMessages.personal),
          },
          {
            value: "award",
            label: intl.formatMessage(experienceMessages.award),
          },
        ]}
      />
    </section>
  );
};

export default SelectExperience;
