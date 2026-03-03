import { IntlShape } from "react-intl";

import { commonMessages } from "@gc-digital-talent/i18n";
import { CreatePoolDepartmentFragment as CreatePoolDepartmentFragmentType } from "@gc-digital-talent/graphql";
import { Card, Ul } from "@gc-digital-talent/ui";

import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";

interface DepartmentCardProps {
  selectedDepartment: CreatePoolDepartmentFragmentType;
  intl: IntlShape;
}

const DepartmentCard = ({ selectedDepartment, intl }: DepartmentCardProps) => {
  return (
    <Card>
      <p className="font-bold text-primary-600">
        {selectedDepartment.departmentName?.localized ??
          intl.formatMessage(commonMessages.notAvailable)}
      </p>
      <Ul className="mt-4" unStyled space="md">
        <li>
          <BoolCheckIcon
            value={selectedDepartment.isCorePublicAdministration}
            trueLabel={intl.formatMessage(commonMessages.yes)}
            falseLabel={intl.formatMessage(commonMessages.no)}
          >
            {intl.formatMessage({
              defaultMessage: "Core public administration (CPA)",
              id: "JaUbaI",
              description:
                "Label for a department that is part of the core public administration",
            })}
          </BoolCheckIcon>
        </li>
        <li>
          <BoolCheckIcon
            value={selectedDepartment.isCentralAgency}
            trueLabel={intl.formatMessage(commonMessages.yes)}
            falseLabel={intl.formatMessage(commonMessages.no)}
          >
            {intl.formatMessage({
              defaultMessage: "Central agency",
              id: "gbvOCW",
              description: "Label for a department that is a central agency",
            })}
          </BoolCheckIcon>
        </li>
        <li>
          <BoolCheckIcon
            value={selectedDepartment.isScience}
            trueLabel={intl.formatMessage(commonMessages.yes)}
            falseLabel={intl.formatMessage(commonMessages.no)}
          >
            {intl.formatMessage({
              defaultMessage: "Science",
              id: "z6EMbE",
              description: "Label for a science department",
            })}
          </BoolCheckIcon>
        </li>
        <li>
          <BoolCheckIcon
            value={selectedDepartment.isRegulatory}
            trueLabel={intl.formatMessage(commonMessages.yes)}
            falseLabel={intl.formatMessage(commonMessages.no)}
          >
            {intl.formatMessage({
              defaultMessage: "Regulatory",
              id: "uhoPHh",
              description: "Label for a regulatory department",
            })}
          </BoolCheckIcon>
        </li>
      </Ul>
    </Card>
  );
};

export default DepartmentCard;
