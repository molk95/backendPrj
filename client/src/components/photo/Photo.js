import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner/Spinner";
import PhotoItem from "../photos/PhotoItem";
import { getPhoto } from "../../actions/photo";

const Photo = ({ getPhoto, photo: { photo, loading }, match }) => {
  useEffect(() => {
    getPhoto(match.params.id);
  }, [getPhoto]);
  return loading || photo === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/photos" className="btn">
        Back To Photos
      </Link>
      <PhotoItem photo={photo} showActions={false} />
    </Fragment>
  );
};
const mapStateToProps = state => ({
  photo: state.photo
});
export default connect(mapStateToProps, { getPhoto })(Photo);
