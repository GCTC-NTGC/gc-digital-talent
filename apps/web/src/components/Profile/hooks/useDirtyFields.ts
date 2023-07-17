import { useEffect } from "react";
import { useFormState } from "react-hook-form";

import { useProfileFormContext } from "../components/ProfileFormContext";
import { SectionKey } from "../types";

const useDirtyFields = (section: SectionKey): void => {
  const { toggleDirty } = useProfileFormContext();
  const { isDirty } = useFormState();

  useEffect(() => {
    toggleDirty(section, isDirty);
    /**
     * Note: toggleDirty is updated after toggling causing and infinite
     * state update loop
     *
     * This is necessary to facilitate validating all of the forms at once
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);
};

export default useDirtyFields;
