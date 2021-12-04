import { createStore, applyMiddleware } from "redux";
import ReduxPromise from "redux-promise";
import ReduxThunk from "redux-thunk";
import reducers from "../reducers";

// redux middleware
const createStoreWithMiddleware = applyMiddleware(ReduxPromise, ReduxThunk)(
    createStore
);

// global state config
const store = createStoreWithMiddleware(reducers);

export default store;