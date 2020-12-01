

const defaultState = {
  items: [],
  isFetching: true,
};

const SET_ITEMS = "SET_ITEMS";

export function setItems(payload) {
  return {
    type: SET_ITEMS,
    payload,
  };
}

export default function reposReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}