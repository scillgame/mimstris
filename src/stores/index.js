import { combineReducers, createStore } from 'redux'

import score from './score'
import lines from './lines'
import nextPiece from './nextPiece'
import currentPiece from './currentPiece'
import board from './board'
import config from './config'
import gameState from './gameState'
import challenges from './challenges'
import session from './session'
import user from './user'
// selector-only modules
// import message from './message'
// import fallRate from './fallRate'
// import level from './level'

export const REPLACE_STATE = 'REPLACE_STATE'
export const replaceState = (state) => ({
  type: REPLACE_STATE,
  payload: state
})

export const reducer = combineReducers(
  {score, lines, nextPiece, currentPiece, board, gameState, config, session, user, challenges}
)

export default createStore(
  reducer,
  // To trigger dev tools in browser extension
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
