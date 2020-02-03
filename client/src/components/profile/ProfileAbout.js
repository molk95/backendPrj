import React, { Fragment } from "react";


const ProfileAbout = ({
  profile: {
    bio,
    user: { firstname }
  }
}) => (
    <Fragment>
  <div className="profile-about bg-light p-2">
    {bio && (
      <Fragment>
        <h2 className="text-primary">{firstname.trim().split(" ")[0]}s Bio</h2>
        <p>{bio}</p>
        <div className="line" />
      </Fragment>
    
    )}
  </div>
  </Fragment>
)

export default ProfileAbout;
