import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

import Heading from "../IAPHeading/Heading";
import CloseButton from "./CloseButton";
import { BasicDialogProps } from "./types";

const LearnDialog = ({ btnProps }: BasicDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary" {...btnProps}>
          {intl.formatMessage({
            defaultMessage: "Learn More",
            id: "CY+493",
            description: "Button text to learn more about the program",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        closeLabel={intl.formatMessage({
          defaultMessage: "Close",
          id: "4p0QdF",
          description: "Button text used to close an open modal",
        })}
      >
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage:
              "Learn More About the Government of Canada IT Apprenticeship Program for Indigenous Peoples",
            id: "L9yjr3",
            description: "Heading for the Learn more dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(0, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage:
                "Who can apply to become an apprentice as part of the Government of Canada IT Apprenticeship Program for Indigenous Peoples?",
              id: "p2sBh3",
              description: "Learn more dialog question one heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "If you are First Nations, Inuk, or Métis, and you live in Canada, then you can apply to become an apprentice in this program.",
              id: "jyQi0m",
              description: "Learn more dialog question on paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "How long is the program?",
              id: "Qt9Q8k",
              description: "Learn more dialog question two heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "The program is 24 months in length, with supports available to apprentices during their time in the program.",
              id: "YGM/D5",
              description: "Learn more dialog question two paragraph one",
            })}
          </p>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "All apprentices will be supported by carefully selected peer partners and mentors. Apprentices will also be invited to join an Indigenous Apprenticeship Network, where there will be opportunities to connect with other Indigenous employees in the Government of Canada, and with other Indigenous apprentices who are participating in this program.",
              id: "LGSw+f",
              description: "Learn more dialog question two paragraph two",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage:
                "What happens after a person completes the 24 month program?",
              id: "Ilot3b",
              description: "Learn more dialog question three heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Upon successful completion of the program, it is hoped that apprentices will consider remaining with the Government of Canada.",
              id: "OcIvN1",
              description: "Learn more dialog question three paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Will apprentices be paid?",
              id: "jA4kuU",
              description: "Learn more dialog question four heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Absolutely! Your time is valuable. Apprentices will receive pay and benefits as employees of the Government of Canada. Apprentices will earn between $29.00 and $33.00 per hour to start, with the exact salary to be determined at the time of hire and dependent upon the collective agreement in place within the hiring organization. Apprentices will be employed full-time, for a total of 37.5 hours per week.",
              id: "hSmKjD",
              description: "Learn more dialog question four paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Will apprentices be entitled to any benefits?",
              id: "rz21yp",
              description: "Learn more dialog question five heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "You bet! As employees of the Government of Canada, all apprentices will be entitled to vacation leave, sick leave, and family related leave. After six months, apprentices will also have access to medical and dental insurance coverage for themselves and their dependents, in addition to becoming a member of the federal public service pension plan.",
              id: "XS21o1",
              description: "Learn more dialog question five paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage:
                "Do I have to move to Ottawa or to a specific location to participate in this program?",
              id: "WDRWcu",
              description: "Learn more dialog question six heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Not necessarily. Most apprenticeship opportunities can be done by working from home, as long as there is an internet connection. Some positions do have a location-specific requirement. We value the importance of family and community, and we encourage individuals to join our family without having to leave theirs, and to become part of our community while remaining in theirs. Talk to your hiring manager about your situation/preference and we will do our best to work with you to find a suitable solution.",
              id: "sycoGU",
              description: "Learn more dialog question six paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "How do I know if this program is for me?",
              id: "KdXvmY",
              description: "Learn more dialog question seven heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "If you have an interest and a passion for technology and self-identify as Indigenous, then this program is for you.",
              id: "pkFLpT",
              description: "Learn more dialog question seven paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage:
                "What will apprentices have to do as part of the program?",
              id: "mfBsJY",
              description: "Learn more dialog question eight heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Apprentices will experience a combination of on-the-job learning and online training in one or more information technology areas. Apprentices are expected to demonstrate their interest and passion for technology by being willing to observe, learn, and practice new skills that are developed over the course of the program. On average, an apprentice will spend four days a week doing hands-on learning, while the fifth day of the week will be dedicated to personal and professional development through online training and through other developmental training opportunities.",
              id: "UQlyXu",
              description: "Learn more dialog question eight paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage:
                "In which department or agency will apprentices work?",
              id: "+JIfBy",
              description: "Learn more dialog question nine heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Opportunities exist in a large number of departments and agencies across the Government of Canada. The program will attempt to match apprentices with opportunities that best align with their interests.",
              id: "S/PXt/",
              description: "Learn more dialog question nine paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Is there a cost to participate in the program?",
              id: "CZGta2",
              description: "Learn more dialog question ten heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "All required computer equipment (laptop, mouse, monitor, phone) and training material will be provided at no-cost. If a person chooses to work from home, the cost of internet access will be the responsibility of the apprentice.",
              id: "hdBTPI",
              description: "Learn more dialog question ten paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "How can a person apply to become an apprentice?",
              id: "QkZ7Oy",
              description: "Learn more dialog question eleven heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Soon, an online application process will be available for people to express their interest. In the meantime, we encourage you to send your résumé and cover letter to: edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca",
              id: "v9mTgX",
              description: "Learn more dialog question eleven paragraph one",
            })}
          </p>
          <Heading
            as="h3"
            data-h2-font-size="base(h6, 1.1)"
            data-h2-margin="base(x2, 0, x.5, 0)"
          >
            {intl.formatMessage({
              defaultMessage:
                "What education requirements exist – can I apply if I don't have a college diploma or university degree?",
              id: "dgG8md",
              description: "Learn more dialog question twelve heading",
            })}
          </Heading>
          <p data-h2-margin="base(x.5, 0, 0, 0)">
            {intl.formatMessage({
              defaultMessage:
                "The minimum education requirement is a GED or high school diploma. A college or university education is not required.",
              id: "74Sg+4",
              description: "Learn more dialog question twelve paragraph one",
            })}
          </p>
          <Dialog.Footer>
            <CloseButton />
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default LearnDialog;
