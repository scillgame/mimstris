import _cloneDeep from 'lodash/fp/cloneDeep'

import { createEmptyMatrix, removeRowAndShiftRemaining, combineMatrices, getFullRows, allEqual } from '../matrixUtil'
import config from '../config'
import store, {REPLACE_STATE} from './index'
import { eventsApi } from '../main'
import * as user from './user'
import * as session from './session'

export const RESET_BOARD = 'RESET_BOARD'
export const resetBoard = () => ({
  type: RESET_BOARD
})

export const CLEAR_COMPLETED_LINES = 'CLEAR_COMPLETED_LINES'
export const clearCompletedLines = () => ({
  type: CLEAR_COMPLETED_LINES
})

export const MERGE_PIECE_INTO_BOARD = 'MERGE_PIECE_INTO_BOARD'
export const mergePieceIntoBoard = (piece) => ({
  type: MERGE_PIECE_INTO_BOARD,
  piece
})

const initialState = [[0]]

const wrapGetter = getter => getter(store.getState())
export const getSessionId = () => wrapGetter(session.getSessionId)
export const getUser = () => wrapGetter(user.getUser)

export default function reducer (previousBoard = initialState, action) {
  switch (action.type) {
    case REPLACE_STATE: return getBoard(action.payload)
    case RESET_BOARD:
      const emptyBoard = createEmptyMatrix(...config.boardSize)
      return emptyBoard
    case CLEAR_COMPLETED_LINES:
      let newBoard = _cloneDeep(previousBoard)
      let fullRowIndeces = getFullRows(newBoard)

      console.log("EVENT INFO", getSessionId(), getUser());

      // We work through all lines that are destroyed and find rows where every item has the same color.
      let numberOfRowsWithSameColor = 0;
      fullRowIndeces.forEach(fullRowIndex => {
        const fullRow = newBoard[fullRowIndex];
        if (allEqual(fullRow)) {
          numberOfRowsWithSameColor++;
        }
      });
      if (numberOfRowsWithSameColor) {
        const eventPayload = {
          event_name: 'destroy-item',
          event_type: 'single',
          session_id: getUser().userId, //Use same session as user to make this persistent
          user_id: getUser().userId,
          meta_data: {
            amount: numberOfRowsWithSameColor,
            item_id: 'sameColor'
          }
        }
        eventsApi.sendEvent(eventPayload).then(() => {
          console.log("Same color destroy-item event sent", eventPayload);
        });
      }

      newBoard = fullRowIndeces.reduce(
        (board, rowIndex) => removeRowAndShiftRemaining(board, rowIndex)
      , newBoard)
      return newBoard
    case MERGE_PIECE_INTO_BOARD:
      const {piece} = action
      const {matrix, x, y} = piece
      const mergedBoard = combineMatrices(previousBoard, matrix, x, y, false)
      return mergedBoard
    default:
      return previousBoard
  }
}

export const getBoard = state => state.board
