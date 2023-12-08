import React from "react";

import { BasicForm, Input, Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";

import {
  useCreateDemoJobRequestMutation,
  useMyNotificationsQuery,
} from "~/api/generated";

type FormValues = {
  delaySeconds: string;
  magicWord: string;
};

const NotificationBar = () => {
  const [, executeJobMutation] = useCreateDemoJobRequestMutation();
  const [notificationsResult, executeNotificationsQuery] =
    useMyNotificationsQuery();

  // https://medium.com/sesame-engineering/from-apollo-to-urql-part-2-3ea41fa22bc5
  // https://github.com/urql-graphql/urql/pull/1374
  React.useEffect(() => {
    if (!notificationsResult?.fetching) {
      const id = setTimeout(
        () => executeNotificationsQuery({ requestPolicy: "network-only" }),
        5000,
      );
      return () => clearTimeout(id);
    }
  }, [notificationsResult.fetching, executeNotificationsQuery]);

  const handleSubmit = (formValues: FormValues) => {
    executeJobMutation({
      delaySeconds: parseInt(formValues.delaySeconds, 10) ?? 0,
      magicWord: formValues.magicWord,
    })
      .then((res) => {
        if (!res.error) {
          toast.success("Successfully submitted demo request!");
        }
      })
      .catch(() => {
        toast.error("Error: submitting demo request failed");
      });
  };

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(1fr 2fr) "
      data-h2-gap="base(x.5)"
    >
      <div>
        <p>Request a demo here</p>
        <BasicForm onSubmit={handleSubmit}>
          <Input
            id="delaySeconds"
            label="Delay seconds"
            name="delaySeconds"
            type="number"
          />
          <Input
            id="magicWord"
            label="Magic word"
            name="magicWord"
            type="text"
          />
          <Submit />
        </BasicForm>
      </div>
      <div>
        <p>See notifications here</p>
        <ul>
          {notificationsResult?.data?.me?.notifications?.map((notification) => (
            <li key={notification.id}>
              {"message" in notification ? notification.message : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationBar;
