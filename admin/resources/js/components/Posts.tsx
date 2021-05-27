import * as React from "react";
import { List, Datagrid, TextField, ReferenceField, EditButton, Edit, SimpleForm, ReferenceInput, SelectInput, TextInput, Create, Filter, FilterProps, ListProps, Record } from 'react-admin';

const PostFilter = (props: FilterProps) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <ReferenceInput label="User" source="userId" reference="users">
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

export const PostList = (props: ListProps) => (
    <List filters={<PostFilter children />} {...props}>
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

const PostTitle =({ record }: any) => (
   <span>Post {record ? `"${record.title}"` : ''}</span>
);

export const PostEdit = (props: any) => (
  <Edit title={<PostTitle />} {...props}>
      <SimpleForm>
          <TextInput disabled source="id" />
          <ReferenceInput source="userId" reference="users"><SelectInput optionText="name" /></ReferenceInput>
          <TextInput source="title" />
          <TextInput multiline source="body" />
      </SimpleForm>
  </Edit>
);

export const PostCreate = (props: any) => (
  <Create {...props}>
      <SimpleForm>
          <ReferenceInput source="userId" reference="users"><SelectInput optionText="name" /></ReferenceInput>
          <TextInput source="title" />
          <TextInput multiline source="body" />
      </SimpleForm>
  </Create>
);

