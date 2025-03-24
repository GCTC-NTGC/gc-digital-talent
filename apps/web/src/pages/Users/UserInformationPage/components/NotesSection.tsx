import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";
import { useMutation } from "urql";

import { Well } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { BasicForm, TextArea, Submit } from "@gc-digital-talent/forms";
import { graphql } from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";

import { BasicUserInformationProps } from "../types";

const AdminUpdatePoolCandidateNotes_Mutation = graphql(/* GraphQL */ `
  mutation AdminUpdatePoolCandidateNotes($id: UUID!, $notes: String) {
    updatePoolCandidateNotes(id: $id, notes: $notes) {
      id
      notes
    }
  }
`);

const NotesSection = ({ user }: BasicUserInformationProps) => {
  const intl = useIntl();

  const [, executeMutation] = useMutation(
    AdminUpdatePoolCandidateNotes_Mutation,
  );

  const handleUpdateCandidate = async (id: string, notes: string) => {
    const res = await executeMutation({ id, notes });
    if (res.data?.updatePoolCandidateNotes) {
      return res.data.updatePoolCandidateNotes;
    }
    return Promise.reject(new Error(res.error?.toString()));
  };

  const handleSubmit = (formValues: Record<string, string>) => {
    user?.poolCandidates?.forEach((candidate) => {
      if (candidate && (candidate.notes ?? "") !== formValues[candidate.id]) {
        handleUpdateCandidate(candidate.id, formValues[candidate.id] ?? "")
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
                  poolName: getShortPoolTitleHtml(intl, {
                    workStream: candidate.pool.workStream,
                    name: candidate.pool.name,
                    publishingGroup: candidate.pool.publishingGroup,
                    classification: candidate.pool.classification,
                  }),
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
                  poolName: getShortPoolTitleHtml(intl, {
                    workStream: candidate.pool.workStream,
                    name: candidate.pool.name,
                    publishingGroup: candidate.pool.publishingGroup,
                    classification: candidate.pool.classification,
                  }),
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
                        poolName: getShortPoolTitleHtml(intl, {
                          workStream: candidate.pool.workStream,
                          name: candidate.pool.name,
                          publishingGroup: candidate.pool.publishingGroup,
                          classification: candidate.pool.classification,
                        }),
                      },
                    )}
                    defaultValue={candidate.notes ?? ""}
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
