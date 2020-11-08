// Actions
import { UPDATE_CHALLENGES } from './challenges'

export const UPDATE_ACCESS_TOKEN = 'UPDATE_ACCESS_TOKEN'
export const updateAccessToken = (accessToken) => ({
  type: UPDATE_ACCESS_TOKEN,
  accessToken
})

// State
const initialState = null

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_ACCESS_TOKEN:
      console.log("UPDATE ACCESS TOKEN", action);
      return {
        userId: state.userId,
        accessToken: action.accessToken
      };
    default:
      if (!state) {
        let userId = localStorage.getItem('userId');
        if (!userId) {
          userId = new Date().getTime().toString();
        }
        state = {
          userId: userId,
          accessToken: null
        };
        localStorage.setItem('userId', userId);
      }
      return state
  }
}

// Selectors
export const getUser = state => state.user
