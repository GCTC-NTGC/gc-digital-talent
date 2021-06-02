import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  UrlField,
  ReferenceField,
  ListProps,
} from "react-admin";
import MyUrlField from "./MyUrlField";

// eslint-disable-next-line import/prefer-default-export
export const UserList = (props: ListProps): React.ReactElement => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="phone" />
      <UrlField source="website" />
      <MyUrlField source="website" label="Custom Website Field" />
      <TextField source="company.name" />
    </Datagrid>
  </List>
);
