import React from "react";
import {
  ChatAlt2Icon,
  LightBulbIcon,
  LightningBoltIcon,
  ThumbUpIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { User } from "../../api/generated";

const ProfilePage: React.FC<User> = ({ firstName, lastName }) => {
  return (
    <>
      <div
        className="bg-profile-banner"
        data-h2-padding="b(top-bottom, l) b(right-left, s) m(all, l) l(all, xl) l(right-left, l)"
        data-h2-text-align="b(center)"
        data-h2-font-color="b(white)"
      >
        <p>{`${firstName} ${lastName}`}</p>
      </div>
      <div
        data-h2-position="b(relative)"
        data-h2-flex-grid="b(top, contained, flush, none)"
        data-h2-container="b(center, l)"
        data-h2-padding="b(top-bottom, s) b(right-left, l)"
      >
        <div
          data-h2-flex-item="b(1of1) s(1of4)"
          data-h2-visibility="b(hidden) s(visible)"
          data-h2-text-align="b(right)"
          data-h2-position="b(sticky)"
          style={{
            backgroundColor: "green",
          }}
        >
          <h2>On this page</h2>
        </div>
        <div
          data-h2-flex-item="b(1of1) s(3of4)"
          style={{
            backgroundColor: "grey",
          }}
        >
          <div data-h2-padding="b(left, l)">
            <div>
              <h2>
                <LightBulbIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;My status
              </h2>
              Status details
            </div>
            <div>
              <h2>
                <UserGroupIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;My pools
              </h2>
              Pool details
            </div>
            <div>
              <h2>
                <UserIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;About me
              </h2>
              Personal details
            </div>
            <div>
              <h2>
                <ChatAlt2Icon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;Language information
              </h2>
              Language details
            </div>
            <div>
              <h2>
                {
                  // TODO: Ask where to find this icon
                }
                <LightBulbIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;Government information
              </h2>
              Government status details
            </div>
            <div>
              <h2>
                {
                  // TODO: Ask where to find this icon
                }
                <LightBulbIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;Work location
              </h2>
              Work location details
            </div>
            <div>
              <h2>
                <ThumbUpIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;Work preferences
              </h2>
              Work preference details
            </div>
            <div>
              <h2>
                <UserCircleIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;Diversity, equity, and inclusion
              </h2>
              Diversity and inclusion details
            </div>
            <div>
              <h2>
                <LightningBoltIcon style={{ width: "calc(1rem*2.25)" }} />
                &nbsp;&nbsp;My skills and experience
              </h2>
              Skill and experience details
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
