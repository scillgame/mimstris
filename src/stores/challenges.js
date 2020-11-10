import {createSelector} from 'reselect'
import config from '../config'
import {getLevel} from './level'
import { REPLACE_STATE } from './index'
import { RESET_SCORE } from './score'
import { getLines, SET_LINES } from './lines'
import _cloneDeep from 'lodash/fp/cloneDeep'

// Actions
export const UPDATE_CHALLENGES = 'UPDATE_CHALLENGES'
export const updateChallenges = (challenges) => ({
  type: UPDATE_CHALLENGES,
  challenges
})

export const UPDATE_CHALLENGE = 'UPDATE_CHALLENGE'
export const updateChallenge = (challenge) => ({
  type: UPDATE_CHALLENGE,
  challenge
})

// State
const initialState = []

// Reducer
export default function reducer (previousState = initialState, action) {
  switch (action.type) {
    case REPLACE_STATE:
      return getChallenges(action)
    case UPDATE_CHALLENGES:
      return action.challenges
    case UPDATE_CHALLENGE:
      const {challenge} = action;
      const newState = _cloneDeep(previousState)
      newState.forEach(categories => {
        if (categories.challenges) {
          categories.challenges.forEach(oldChallenge => {
            if (oldChallenge.challenge_id === challenge.challenge_id) {
              console.log("Updating challenge with new data", oldChallenge, challenge);
              oldChallenge.type = challenge.type;
              oldChallenge.user_challenge_current_score = challenge.user_challenge_current_score;
            }
          })
        }
      })
      return newState
    default:
      return previousState
  }
}

// Selectors
export const getChallenges = state => state.challenges
