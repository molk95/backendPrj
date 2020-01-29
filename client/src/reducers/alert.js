import { SET_ALERT, REMOVE_ALERT } from "../actions/constants";

const initialState = [{}];

export default function(state = initialState, action, payload ) {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
