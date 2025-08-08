import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { commonMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Dialog } from "@gc-digital-talent/ui";

import { DialogType } from "./useDialogType";
import screeningDialogMessages from "./messages";
import { DIALOG_TYPE, getSkillLevelMessage } from "./utils";

const ScreeningDialogHeaderStep_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogHeaderStep on AssessmentStep {
    title {
      localized
    }
    type {
      label {
        localized
      }
    }
  }
`);

const ScreeningDialogHeaderPoolSkill_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogHeaderPoolSkill on PoolSkill {
    requiredLevel
    skill {
      name {
        localized
      }
      category {
        value
      }
    }
  }
`);

interface HeaderProps {
  stepQuery?: FragmentType<typeof ScreeningDialogHeaderStep_Fragment>;
  poolSkillQuery?: FragmentType<typeof ScreeningDialogHeaderPoolSkill_Fragment>;
  dialogType: DialogType;
  candidateName: string;
}

const Header = ({
  stepQuery,
  poolSkillQuery,
  dialogType,
  candidateName,
}: HeaderProps) => {
  const intl = useIntl();
  const step = getFragment(ScreeningDialogHeaderStep_Fragment, stepQuery);
  const poolSkill = getFragment(
    ScreeningDialogHeaderPoolSkill_Fragment,
    poolSkillQuery,
  );
  const title =
    step?.type?.label.localized ??
    intl.formatMessage(commonMessages.notApplicable);
  const skillName =
    poolSkill?.skill?.name.localized ??
    intl.formatMessage(commonMessages.notAvailable);
  const skillLevel = getSkillLevelMessage(intl, {
    requiredLevel: poolSkill?.requiredLevel,
    skill: poolSkill?.skill,
  });

  let header: ReactNode = step?.title?.localized
    ? intl.formatMessage(screeningDialogMessages.customTitle, {
        customTitle: step.title.localized,
        title,
        skillName,
      })
    : intl.formatMessage(screeningDialogMessages.title, { title, skillName });

  let subtitle: ReactNode = skillLevel
    ? intl.formatMessage(screeningDialogMessages.reviewRecordSkillLevel, {
        candidateName,
        skillName,
        skillLevel,
      })
    : intl.formatMessage(screeningDialogMessages.reviewAndRecord, {
        candidateName,
        skillName,
      });

  switch (dialogType) {
    case DIALOG_TYPE.Education:
      header = intl.formatMessage(screeningDialogMessages.educationTitle);
      subtitle = intl.formatMessage(screeningDialogMessages.educationSubtitle, {
        candidateName,
      });
      break;
    case DIALOG_TYPE.ApplicationScreening:
      header = intl.formatMessage(screeningDialogMessages.appScreeningTitle, {
        skillName,
      });
      break;
    case DIALOG_TYPE.ScreeningQuestions:
      header = intl.formatMessage(
        screeningDialogMessages.screeningQuestionsTitle,
        { skillName },
      );
  }

  return <Dialog.Header subtitle={subtitle}>{header}</Dialog.Header>;
};

export default Header;
