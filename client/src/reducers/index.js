import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import photo from "./photo";

export default combineReducers({
  alert,
  auth,
  profile,
  photo
});
