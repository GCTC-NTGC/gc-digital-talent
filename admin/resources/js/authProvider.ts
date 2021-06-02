// eslint-disable-next-line import/no-anonymous-default-export
const authProvider = {
  // called when the user attempts to log in
  login: (data: { username: string }): Promise<void> => {
    localStorage.setItem("username", data.username);
    // accept all username/password combinations
    return Promise.resolve();
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("username");
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: (data: { status: number }): Promise<void> => {
    if (data.status === 401 || data.status === 403) {
      localStorage.removeItem("username");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: (): Promise<void> => {
    return localStorage.getItem("username")
      ? Promise.resolve()
      : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: (): Promise<void> => Promise.resolve(),
};

export default authProvider;
