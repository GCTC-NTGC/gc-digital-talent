import React from "react";
import { User } from "../../api/generated";
//import background from ""

const ProfilePage: React.FC<User> = ({ firstName, lastName }) => {
  return (
    <div data-h2-bg-color="b(grey)">
      <p data-h2-padding="b(top-bottom, xxl)" data-h2-text-align="b(center)">
        {`${firstName} ${lastName}`}
      </p>
    </div>
  );
};

export default ProfilePage;
