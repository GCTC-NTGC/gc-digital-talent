import { useIntl } from "react-intl";

import { Select } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";

import experienceMessages from "~/messages/experienceMessages";
import { getExperienceFormLabels } from "~/utils/experienceUtils";

const SelectExperience = () => {
  const intl = useIntl();
  const experienceFormLabels = getExperienceFormLabels(intl);

  return (
    <section>
      <Heading rank="h3" size="h4" className="mt-18 mb-6 font-bold">
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
