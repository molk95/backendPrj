import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePhoto } from "../../actions/photo";

const PhotoItem = ({
  addLike,
  removeLike,
  deletePhoto,
  auth,
  photo: {
    text,
    _id,
    avatar,
    user,
    firstname,
    lastname,
    likes,
    image,
    keyword,
    date
  },
  showActions
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img className="round-img" src={avatar} alt="" />
        <h4>
          {firstname} {lastname}
        </h4>
      </Link>
    </div>
    <div>
      <img src={image} className="post-image" alt="..." />
      <p className="my-1">{text}</p>
      <p className="post-date">
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>

      {showActions && (
        <Fragment>
          <button
            onClick={() => addLike(_id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-up" />{" "}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button
            onClick={() => removeLike(_id)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-thumbs-down" />
          </button>
          <Link to={`/photos/${_id}`} className="btn btn-primary">
            <span >{keyword}</span>
          </Link>
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={() => deletePhoto(_id)}
              type="button"
              className="btn btn-danger"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { addLike, removeLike, deletePhoto })(
  PhotoItem
);
