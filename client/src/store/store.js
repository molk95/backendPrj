import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "../reducers/index";

const middleWare = [thunk];

// const initialState = {};
const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(...middleWare)
    // other store enhancers if any
  )
);

export default store;
