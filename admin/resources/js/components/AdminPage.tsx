import * as React from "react";
import jsonServerProvider from 'ra-data-json-server';
import { Admin, Resource } from 'react-admin';
import { UserList } from './Users';
import { PostCreate, PostEdit, PostList } from "./Posts";
import Dashboard from './Dashboard';
import authProvider from '../authProvider';
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const AdminPage = () => {
  return (
    <>
      {!dataProvider ? (
        <div>Loading</div>
        ) : (
          <Admin dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
            <Resource name="users" list={UserList} icon={UserIcon} />
            <Resource name="posts" list={PostList} edit={PostEdit} create={PostCreate} icon={PostIcon} />
          </Admin>
      )}
    </>
  );
};

export default AdminPage;

