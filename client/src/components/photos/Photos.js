import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner/Spinner";

import PhotoItem from "./PhotoItem";
import { getPhotos } from "../../actions/photo";
const Photos = ({ getPhotos, photo: { photos, loading } }) => {
  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment >
      <h1 className="large text-primary">Photos</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      
      <div className="posts">
        {photos.map(photo => (
          <PhotoItem key={photo._id} photo={photo} />
        ))}
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  photo: state.photo
});
export default connect(mapStateToProps, { getPhotos })(Photos);
