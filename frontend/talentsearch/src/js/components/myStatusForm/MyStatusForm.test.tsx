/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fakeUsers } from "@common/fakeData";
import {
  GetMystatusQuery,
  WorkRegion,
  JobLookingStatus,
} from "../../api/generated";
import { render, screen, fireEvent, act, waitFor } from "../../tests/testUtils";
import { MyStatusForm, MyStatusFormProps } from "./MyStatusForm";

const renderMyStatusForm = ({
  initialData,
  handleMyStatus,
}: MyStatusFormProps) => {
  return render(
    <MyStatusForm initialData={initialData} handleMyStatus={handleMyStatus} />,
  );
};
const mockUser = fakeUsers()[0];

const mockInitialData: GetMystatusQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "thanka11",
    jobLookingStatus: JobLookingStatus.ActivelyLooking,
  },
};
const mockInitialEmptyData: GetMystatusQuery | undefined = {
  __typename: "Query",
  me: {
    __typename: "User",
    id: "thanka11",
    jobLookingStatus: undefined,
  },
};
