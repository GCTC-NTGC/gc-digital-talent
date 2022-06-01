import React from "react";
import { useIntl } from "react-intl";

import Dialog from "@common/components/Dialog";
import Heading from "../Heading/Heading";
import CloseButton from "./CloseButton";

import type { BasicDialogProps } from "./types";

const LearnDialog: React.FC<BasicDialogProps> = ({ isOpen, onDismiss }) => {
  const intl = useIntl();
  const Close = React.useMemo(
    () => <CloseButton onClick={onDismiss} />,
    [onDismiss],
  );
  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ia-secondary"
      title={intl.formatMessage({
        defaultMessage:
          "Learn More About the Government of Canada IT Apprenticeship Program for Indigenous Peoples",
        description: "Heading for the Learn more dialog",
      })}
      footer={Close}
    >
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage:
            "Who can apply to become an apprentice as part of the Government of Canada IT Apprenticeship Program for Indigenous Peoples?",
          description: "Learn more dialog question one heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "If you are First Nations, Inuk, or Métis, and you live in Canada, then you can apply to become an apprentice in this program.",
          description: "Learn more dialog question on paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage: "How long is the program?",
          description: "Learn more dialog question two heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The program is 24 months in length, with supports  available to apprentices during their time in the program.",
          description: "Learn more dialog question two paragraph one",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "All apprentices will be supported by carefully selected peer partners and mentors. Apprentices will also be invited to join an Indigenous Apprenticeship Network, where there will be opportunities to connect with other Indigenous employees in the Government of Canada, and with other Indigenous apprentices who are participating in this program.",
          description: "Learn more dialog question two paragraph two",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage:
            "What happens after a person completes the 24 month program?",
          description: "Learn more dialog question three heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Upon successful completion of the program, it is hoped that apprentices will consider remaining with the Government of Canada.",
          description: "Learn more dialog question three paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage: "Will apprentices be paid?",
          description: "Learn more dialog question four heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Absolutely! Your time is valuable. Apprentices will receive pay and benefits as employees of the Government of Canada. Apprentices will earn $31.02 per hour in the first year of the program, according to Government of Canada pay rates. This amount will increase to $32.17 in the second year of the program. Apprentices will be employed full-time, for a total of 37.5 hours per week.",
          description: "Learn more dialog question four paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage: "Will apprentices be entitled to any benefits?",
          description: "Learn more dialog question five heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "You bet! As employees of the Government of Canada, all apprentices will be entitled to vacation leave, sick leave, and family related leave. After six months, apprentices will also have access to medical and dental insurance coverage for themselves and their dependents, in addition to becoming a member of the federal public service pension plan.",
          description: "Learn more dialog question five paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage:
            "Do I have to move to Ottawa or to a specific location to participate in this program?",
          description: "Learn more dialog question six heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Not necessarily. Most apprenticeship opportunities can be done by working from home, as long as there is an internet connection. Some positions do have a location-specific requirement. We value the importance of family and community, and we encourage individuals to join our family without having to leave theirs, and to become part of our community while remaining in theirs. Talk to your hiring manager about your situation/preference and we will do our best to work with you to find a suitable solution.",
          description: "Learn more dialog question six paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage: "How do I know if this program is for me?",
          description: "Learn more dialog question seven heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "If you have an interest and a passion for technology and self-identify as Indigenous, then this program is for you.",
          description: "Learn more dialog question seven paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage:
            "What will apprentices have to do as part of the program?",
          description: "Learn more dialog question eight heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Apprentices will experience a combination of on-the-job learning and online training in one or more information technology areas. Apprentices are expected to demonstrate their interest and passion for technology by being willing to observe, learn, and practice new skills that are developed over the course of the program. On average, an apprentice will spend four days a week doing hands-on learning, while the fifth day of the week will be dedicated to personal and professional development through online training and through other developmental training opportunities.",
          description: "Learn more dialog question eight paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage:
            "In which department or agency will apprentices work?",
          description: "Learn more dialog question nine heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Opportunities exist in a large number of departments and agencies across the Government of Canada. The program will attempt to match apprentices with opportunities that best align with their interests.",
          description: "Learn more dialog question nine paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage: "Is there a cost to participate in the program?",
          description: "Learn more dialog question ten heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "All required computer equipment (laptop, mouse, monitor, phone) and training material will be provided at no-cost. If a person chooses to work from home, the cost of internet access will be the responsibility of the apprentice.",
          description: "Learn more dialog question ten paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage: "How can a person apply to become an apprentice?",
          description: "Learn more dialog question eleven heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Soon, an online application process will be available for people to express their interest. In the meantime, we encourage you to send your resumé and cover letter to: edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca",
          description: "Learn more dialog question eleven paragraph one",
        })}
      </p>
      <Heading
        as="h3"
        data-h2-font-size="b(h6)"
        data-h2-margin="b(bottom, xxs)"
      >
        {intl.formatMessage({
          defaultMessage:
            "What education requirements exist – can I apply if I don't have a college diploma or university degree?",
          description: "Learn more dialog question twelve heading",
        })}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "The minimum education requirement is a GED or high school diploma. A college or university education is not required. (edited) ",
          description: "Learn more dialog question twelve paragraph one",
        })}
      </p>
    </Dialog>
  );
};

export default LearnDialog;
