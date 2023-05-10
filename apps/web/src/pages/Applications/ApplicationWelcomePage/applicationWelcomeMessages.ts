import { Maybe, PublishingGroup } from "@gc-digital-talent/graphql";
import { defineMessages } from "react-intl";

//TODO: This process only works if all the publishing groups messages have the same key names.
const applicationWelcomeMessages = (
  publishingGroup: Maybe<PublishingGroup>,
) => {
  switch (publishingGroup) {
    case PublishingGroup.Iap:
      return defineMessages({
        description: {
          defaultMessage:
            "The Program is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT). We focus on that passion, and your potential to grow and succeed in this field.",
          id: "eyI7JA",
          description:
            "Description of how the skills-based hiring platform assess candidates.",
        },
      });
    default:
      return defineMessages({
        description: {
          defaultMessage:
            "The GC Digital Talent platform is a skills-based hiring system. This means that your application will put a heavier focus on your skills and how you've used them in past experiences to help us get a stronger understanding of your fit.",
          id: "u/DBSl",
          description:
            "Description of how the skills-based hiring platform assess candidates.",
        },
      });
  }
};

export default applicationWelcomeMessages;
