import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./constants";

// the alert will have an {id, message}
export const setAlert = (message, alertTypes) => dispatch => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: { message, alertTypes, id }
  });

  setTimeout(()=>dispatch({
      type: REMOVE_ALERT, 
      payload: id
  }),5000)
};


