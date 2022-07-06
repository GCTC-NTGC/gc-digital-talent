import * as React from "react";
import { useIntl } from "react-intl";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { Button, Link } from "@common/components";
import {
  PoolAdvertisement,
  useGetPoolAdvertisementQuery,
  Scalars,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import { useAdminRoutes } from "../../adminRoutes";

interface EditPoolFormProps {
  poolAdvertisement: PoolAdvertisement;
  onSave: (poolAdvertisement: PoolAdvertisement) => void;
  onPublish: () => void;
  onDelete: () => void;
  onClose: () => void;
  onExtend: () => void;
}

const EditPoolForm = ({
  poolAdvertisement,
  onSave,
  onPublish,
  onDelete,
  onClose,
  onExtend,
}: EditPoolFormProps) => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  return (
    <>
      <h1>
        {intl.formatMessage({
          defaultMessage: "Edit pool advertisement",
          description: "Header for page to edit pool advertisements",
        })}
      </h1>
      <p>breadcrumbs</p>
      <p>on this page</p>

      {/* Pool name and target classification section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Pool name and target classification",
          description: "Section title for pool name and classification",
        })}
      </h2>
      <h3>
        {intl.formatMessage({
          defaultMessage:
            "Select the classification intended for this recruitment process.",
          description:
            "Helper message for selecting a classification for the pool",
        })}
      </h3>
      <Button
        onClick={() => onSave(poolAdvertisement)}
        color="cta"
        mode="solid"
      >
        {intl.formatMessage({
          defaultMessage: "Save pool name",
          description: "Text on a button to save the pool name",
        })}
      </Button>

      {/* Closing date section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Closing date",
          description: "Section title for pool closing date",
        })}
      </h2>
      <Button
        onClick={() => onSave(poolAdvertisement)}
        color="cta"
        mode="solid"
      >
        {intl.formatMessage({
          defaultMessage: "Save closing date",
          description: "Text on a button to save the pool closing date",
        })}
      </Button>

      {/* Your impact section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Your impact",
          description: "Section title for the pool introduction",
        })}
      </h2>
      <h3>
        {intl.formatMessage({
          defaultMessage:
            "This information lets applicants know what kind of work, and environment they are applying to. Use this space to talk about the area of government this process will aim to improve. And the value this kind of work creates.",
          description: "Helper message for filling in the pool introduction",
        })}
      </h3>
      <Button
        onClick={() => onSave(poolAdvertisement)}
        color="cta"
        mode="solid"
      >
        {intl.formatMessage({
          defaultMessage: "Save introduction",
          description: "Text on a button to save the pool introduction",
        })}
      </Button>

      {/* Work tasks section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Work tasks",
          description: "Section title for the pool work tasks",
        })}
      </h2>
      <h3>
        {intl.formatMessage({
          defaultMessage:
            "This information lets applicants know the type of work they will be expected to perform. Talk about the tasks and expectations related to this work.",
          description: "Helper message for filling in the pool work tasks",
        })}
      </h3>
      <Button
        onClick={() => onSave(poolAdvertisement)}
        color="cta"
        mode="solid"
      >
        {intl.formatMessage({
          defaultMessage: "Save work tasks",
          description: "Text on a button to save the pool work tasks",
        })}
      </Button>

      {/* Essential skills section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Essential skills (Need to have)",
          description: "Section title for the pool essential skills",
        })}
      </h2>
      <h3>
        {intl.formatMessage({
          defaultMessage:
            "Select the skills that you are looking for in applicants. Any skill selected here will be required for any applicant to apply. To increase the diversity of applications try to keep the selected number of skills to a minimum.",
          description:
            "Helper message for filling in the pool essential skills",
        })}
      </h3>
      <Button
        onClick={() => onSave(poolAdvertisement)}
        color="cta"
        mode="solid"
      >
        {intl.formatMessage({
          defaultMessage: "Save essential skills",
          description: "Text on a button to save the pool essential skills",
        })}
      </Button>

      {/* Asset skills section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Asset skills (Nice to have skills)",
          description: "Section title for the pool essential skills",
        })}
      </h2>
      <h3>
        {intl.formatMessage({
          defaultMessage:
            "Select skills that will improve the chances of quality matches with managers. These can typically be learned on the job and are not necessary to be accepted into the pool.",
          description: "Helper message for filling in the pool asset skills",
        })}
      </h3>
      <Button
        onClick={() => onSave(poolAdvertisement)}
        color="cta"
        mode="solid"
      >
        {intl.formatMessage({
          defaultMessage: "Save asset skills",
          description: "Text on a button to save the pool asset skills",
        })}
      </Button>

      {/* Other requirements section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Other requirements",
          description: "Section title for the pool other requirements",
        })}
      </h2>
      <h3>
        {intl.formatMessage({
          defaultMessage:
            "Select the requirements needed for this advertisement.",
          description:
            "Helper message for filling in the pool other requirements",
        })}
      </h3>
      <Button
        onClick={() => onSave(poolAdvertisement)}
        color="cta"
        mode="solid"
      >
        {intl.formatMessage({
          defaultMessage: "Save other requirements",
          description: "Text on a button to save the pool other requirements",
        })}
      </Button>

      {/* Advertisement status section */}
      <h2>
        {intl.formatMessage({
          defaultMessage: "Advertisement status",
          description: "Section title for the pool advertisement status",
        })}
      </h2>
      <h3>
        {intl.formatMessage({
          defaultMessage:
            "Use these options to publish or close your advertisement. A live advertisement will allow applicants to submit applications to this pool.",
          description:
            "Helper message for changing the pool advertisement status",
        })}
      </h3>
      <Button onClick={() => onPublish()} color="secondary" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Publish",
          description: "Text on a button to publish the pool",
        })}
      </Button>
      <Button onClick={() => onDelete()} color="secondary" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Delete",
          description: "Text on a button to delete the pool",
        })}
      </Button>
      <Button onClick={() => onClose()} color="secondary" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Close",
          description: "Text on a button to close the pool",
        })}
      </Button>
      <Button onClick={() => onExtend()} color="secondary" mode="solid">
        {intl.formatMessage({
          defaultMessage: "Extend the date",
          description: "Text on a button to extend the expiry date the pool",
        })}
      </Button>
      <Link
        href={paths.poolTable()}
        color="secondary"
        mode="solid"
        type="button"
      >
        {intl.formatMessage({
          defaultMessage: "Back to pool dashboard",
          description:
            "Text on a link to navigate back to the pool dashboard page",
        })}
      </Link>

      {JSON.stringify(poolAdvertisement)}
    </>
  );
};

const EditPool = ({ poolId }: { poolId: Scalars["ID"] }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetPoolAdvertisementQuery({
    variables: { poolId },
  });
  return (
    <Pending fetching={fetching} error={error}>
      <DashboardContentContainer>
        {data?.poolAdvertisement ? (
          <EditPoolForm
            poolAdvertisement={data.poolAdvertisement}
            onSave={() => console.warn("onSave not yet implemented")}
            onPublish={() => console.warn("onPublish not yet implemented")}
            onDelete={() => console.warn("onDelete not yet implemented")}
            onClose={() => console.warn("onClose not yet implemented")}
            onExtend={() => console.warn("onExtend not yet implemented")}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Pool {poolId} not found.",
                  description: "Message displayed for pool not found.",
                },
                { poolId },
              )}
            </p>
          </NotFound>
        )}
      </DashboardContentContainer>
    </Pending>
  );
};

export default EditPool;
