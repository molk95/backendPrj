import React from "react";
import { Link } from "react-router-dom";

const ProfileItem = ({
  profile: {
    user: { _id, firstname, lastname, avatar },
    bio,
    website,
    location
  }
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt="" className="round-img" />
      <div>
        <h2>
          {firstname} {lastname}
        </h2>
        <p>
          <span> at {website}</span>
        </p>
        <p className="my-1">{location}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
      <ul>
        <li className="text-primary">{bio}</li>
      </ul>
    </div>
  )};

export default ProfileItem;
