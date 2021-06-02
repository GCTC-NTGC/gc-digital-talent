import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  Edit,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  TextInput,
  Create,
  Filter,
  FilterProps,
  ListProps,
  Record,
  CreateProps,
  EditProps,
  TitleProps,
} from "react-admin";

const PostFilter = (props: FilterProps): React.ReactElement => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <ReferenceInput label="User" source="userId" reference="users">
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

// TODO: fix PostFilter children error
export const PostList = (props: ListProps): React.ReactElement => (
  <List filters={<PostFilter>{}</PostFilter>} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="title" />
      <EditButton />
    </Datagrid>
  </List>
);

const PostTitle = ({ record }: TitleProps): React.ReactElement => (
  <span>Post {record ? `"${record.title}"` : ""}</span>
);

export const PostEdit = (props: EditProps): React.ReactElement => (
  <Edit title={<PostTitle />} {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Edit>
);

export const PostCreate = (props: CreateProps): React.ReactElement => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Create>
);
