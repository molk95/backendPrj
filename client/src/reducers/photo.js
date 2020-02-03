import {
  GET_PHOTOS,
  GET_PHOTO,
  PHOTO_ERROR,
  DELETE_PHOTO,
  UPDATE_LIKES,
  ADD_PHOTO
} from "../actions/constants";
const initialState = {
  photos: [],
  photo: null,
  loading: true,
  error: {}
};
export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PHOTOS:
      return {
        ...state,
        photos: payload,
        loading: false
      };
    case GET_PHOTO:
      return {
        ...state,
        photo: payload,
        loading: false
      };
    case ADD_PHOTO:
      return {
        ...state,
        photos: [payload, ...state.photos],
        loading: false
      };
    case DELETE_PHOTO:
      return {
        ...state,
        photos: state.photos.filter(photo => photo._id !== payload),
        loading: false
      };
    case PHOTO_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        photos: state.photos.map(photo =>
          photo._id === payload.id ? { ...photo, likes: payload.likes } : photo
        ),
        loading: false
      };

    default:
      return state;
  }
}
