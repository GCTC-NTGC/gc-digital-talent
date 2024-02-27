import React from "react";

import { useCardRepeaterContext } from "@gc-digital-talent/ui";
import { ItemWithId } from "@gc-digital-talent/ui/src/components/CardRepeater/types";

import { FormValues as SkillBrowserDialogFormValues } from "~/components/SkillBrowser/types";
import SkillBrowserDialog, {
  SkillBrowserDialogProps,
} from "~/components/SkillBrowser/SkillBrowserDialog";

type SkillBrowserDialogInRepeaterProps = Pick<
  SkillBrowserDialogProps,
  "inLibrary" | "trigger" | "skills"
>;

const SkillBrowserDialogInRepeater = ({
  skills,
  trigger,
  inLibrary,
}: SkillBrowserDialogInRepeaterProps) => {
  const { append } = useCardRepeaterContext();
  return (
    <SkillBrowserDialog
      skills={skills}
      context="showcase"
      showCategory={false}
      noToast
      onSave={(values) => {
        const itemToAppend: ItemWithId<SkillBrowserDialogFormValues> = {
          id: values.skill ?? "unknown",
          ...values,
        };
        append(itemToAppend);
        return Promise.resolve();
      }}
      trigger={trigger}
      inLibrary={inLibrary}
    />
  );
};

export default SkillBrowserDialogInRepeater;
