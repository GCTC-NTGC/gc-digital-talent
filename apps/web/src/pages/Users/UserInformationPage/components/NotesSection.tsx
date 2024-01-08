import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Well } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { BasicForm, TextArea, Submit } from "@gc-digital-talent/forms";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import {
  UpdatePoolCandidateAsAdminInput,
  useUpdatePoolCandidateMutation,
} from "~/api/generated";

import { BasicUserInformationProps } from "../types";

const NotesSection = ({ user }: BasicUserInformationProps) => {
  const intl = useIntl();

  const [, executeMutation] = useUpdatePoolCandidateMutation();

  const handleUpdateCandidate = async (
    id: string,
    values: UpdatePoolCandidateAsAdminInput,
  ) => {
    const res = await executeMutation({ id, poolCandidate: values });
    if (res.data?.updatePoolCandidateAsAdmin) {
      return res.data.updatePoolCandidateAsAdmin;
    }
    return Promise.reject(res.error);
  };

  const handleSubmit = async (formValues: { [x: string]: string }) => {
    user?.poolCandidates?.forEach(async (candidate) => {
      if (candidate && (candidate.notes || "") !== formValues[candidate.id]) {
        await handleUpdateCandidate(candidate.id, {
          notes: formValues[candidate.id],
        })
          .then(() => {
            toast.success(
              intl.formatMessage(
                {
                  defaultMessage:
                    "Successfully updated notes for candidate in {poolName}",
                  id: "CoUFQ5",
                  description:
                    "Toast notification for successful update of candidates notes in specified pool",
                },
                {
                  poolName: getFullPoolTitleHtml(intl, candidate.pool),
                },
              ),
            );
          })
          .catch(() => {
            toast.error(
              intl.formatMessage(
                {
                  defaultMessage:
                    "Failed updating notes for candidate in {poolName}",
                  id: "kXAnJt",
                  description:
                    "Toast notification for failed update of candidates notes in specified pool",
                },
                {
                  poolName: getFullPoolTitleHtml(intl, candidate.pool),
                },
              ),
            );
          });
      }
    });
  };

  return (
    <>
      <p data-h2-margin="base(x1, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "These notes are shared between all managers of this pool, but not to candidates.",
          id: "JDQvla",
          description: "Description of pool candidate notes field",
        })}
      </p>
      {isEmpty(user.poolCandidates) ? (
        <Well>
          {intl.formatMessage({
            defaultMessage: "This user is not in any pools yet",
            id: "W58QTT",
            description:
              "Message on view-user page that the user is not in any pools",
          })}
        </Well>
      ) : (
        <BasicForm onSubmit={handleSubmit}>
          {user?.poolCandidates?.map((candidate) => {
            if (candidate) {
              return (
                <div data-h2-padding="base(0, 0, x.5, 0)" key={candidate.id}>
                  <TextArea
                    id={candidate.id}
                    name={candidate.id}
                    label={intl.formatMessage(
                      {
                        defaultMessage: "Notes - {poolName}",
                        id: "9Aa5c0",
                        description:
                          "Label for the notes field for a specific pool",
                      },
                      {
                        poolName: getFullPoolTitleHtml(intl, candidate.pool),
                      },
                    )}
                    defaultValue={candidate.notes ? candidate.notes : ""}
                    rows={4}
                  />
                </div>
              );
            }
            return null;
          })}
          <Submit
            mode="solid"
            color="secondary"
            text={intl.formatMessage({
              defaultMessage: "Save notes",
              id: "ZNne50",
              description:
                "Button to save notes for a pool candidate on the view-user page",
            })}
          />
        </BasicForm>
      )}
    </>
  );
};

export default NotesSection;
