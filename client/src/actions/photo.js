import axios from "axios";
import {
  GET_PHOTOS,
  GET_PHOTO,
  PHOTO_ERROR,
  DELETE_PHOTO,
  UPDATE_LIKES,
  ADD_PHOTO
} from "../actions/constants";
import { setAlert } from "./alert";
// Get photos
export const getPhotos = () => async dispatch => {
  try {
    const res = await axios.get("/api/photos");

    dispatch({
      type: GET_PHOTOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add like
export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/photos/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove like
export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/photos/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete photo
export const deletePhoto = id => async dispatch => {
  try {
    await axios.delete(`/api/photos/${id}`);

    dispatch({
      type: DELETE_PHOTO,
      payload: id
    });

    dispatch(setAlert("Photo Removed", "success"));
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add photo
export const addPhoto = formData => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post("/api/photos", formData, config);

    dispatch({
      type: ADD_PHOTO,
      payload: res.data
    });

    dispatch(setAlert("Photo Created", "success"));
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get PHOTO
export const getPhoto = id => async dispatch => {
  try {
    const res = await axios.get(`/api/photos/${id}`);

    dispatch({
      type: GET_PHOTO,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PHOTO_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
