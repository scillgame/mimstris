import {REPLACE_STATE} from './index'
import { getLines } from './lines'

// Actions
export const UPDATE_SESSION_ID = 'UPDATE_SESSION_ID'
export const updateSessionId = (session) => ({
  type: UPDATE_SESSION_ID,
  session
})

// State
const initialState = new Date().getTime().toString()

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case UPDATE_SESSION_ID:
      return action.session;
    default:
      return state
  }
}

// Selectors
export const getSessionId = state => state.session
