import {createSelector} from 'reselect'
import config from '../config'
import {getLevel} from './level'
import { REPLACE_STATE } from './index'
import { RESET_SCORE } from './score'
import { getLines, SET_LINES } from './lines'

// Actions
export const UPDATE_CHALLENGES = 'UPDATE_CHALLENGES'
export const updateChallenges = (challenges) => ({
  type: UPDATE_CHALLENGES,
  challenges
})

// State
const initialState = []

// Reducer
export default function reducer (state = initialState, action) {
  switch (action.type) {
    case REPLACE_STATE:
      return getChallenges(action)
    case UPDATE_CHALLENGES:
      return action.challenges;
    default:
      return state
  }
}

// Selectors
export const getChallenges = state => state.challenges
