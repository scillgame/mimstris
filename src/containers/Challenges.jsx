import React from 'react'
import {connect} from 'react-redux'
import commaNumber from 'comma-number'
import {getLevel} from '../stores/level'
import {getLines} from '../stores/lines'
import {getScore} from '../stores/score'
import Music from './Music'
import * as SCILL from '@scillgame/scill-js'
import * as challengeStore from '../stores/challenges'
import * as config from '../stores/config'
import * as session from '../stores/session'
import * as user from '../stores/user'
import scillinfo from '../scillinfo'
import { updateChallenges } from '../stores/challenges'

const mapStateToProps = (state) => {
  return {
    sessionId: session.getSessionId(state),
    user: user.getUser(state),
    accessToken: null,
    challengesApi: null,
    loaded: false,
    categories: challengeStore.getChallenges(state),
    activePieces: config.getActivePieces(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateAccessToken: (accessToken) => { dispatch(user.updateAccessToken(accessToken)) },
  updateChallenges: (challenges) => { dispatch(challengeStore.updateChallenges(challenges)) },
  setActivePieces: (activePieces) => { dispatch(config.setActivePieces(activePieces)) }
})

function ChallengeProgress(props) {
  const challenge = props.challenge;
  if (challenge.type === 'unclaimed') {
    return null;
  }

  return <div className='challenge-progress'>
    <div className='challenge-progress-bar-container'>
      <div className='challenge-progress-bar' style={{width: ((challenge.user_challenge_current_score/challenge.challenge_goal)*100)+'%'}}></div>
    </div>
    <div className='challenge-status'>{challenge.user_challenge_current_score}/{challenge.challenge_goal}</div>
  </div>
}

// A string with pieces that are unlocked later - we use the challenge_reward integer value (can be set in Admin Panel)
// as the char position in the string to unlock the item. This way, we can create challenges and set rewards without
// touching the code.
export const RewardPieces = '#YH';

class Challenges extends React.Component {

  constructor (props) {
    super(props);
  }

  claimRewards(challenges) {
    let activePieces = this.props.activePieces
    challenges.forEach(categories => {
      categories.challenges.forEach(challenge => {
        if (challenge.type === 'unclaimed') {
          // The challenge is achieved, find the piece to unlock and add to the active pieces list
          const reward_index = challenge.challenge_reward
          if (reward_index >= RewardPieces.length) {
            console.error("Reward index is out of bounds the RewardPieces", reward_index, RewardPieces)
          } else {
            // In Admin Panel we can set an integer value for challenge_reward. We use that integer to find the char
            // in the list of unlockables and add it to the list.
            const piece = RewardPieces.charAt(reward_index)
            if (piece) {
              if (!activePieces.includes(piece)) {
                activePieces += piece
              }
            }
          }
        }
      })
    })
    if (activePieces != this.props.activePieces) {
      console.log("SETTING ACTIVE PIECES", activePieces);
      this.props.setActivePieces(activePieces)
    }
  }

  componentDidMount () {
    // Create an access token - this should also be done in the backend to not expose the API key
    const authApi = SCILL.getAuthApi(scillinfo.apiKey, scillinfo.environment);
    authApi.generateAccessToken({
      user_id: this.props.user.userId
    }).then(accessToken => {
      this.props.updateAccessToken(accessToken.token);
      const challengesApi = SCILL.getChallengesApi(accessToken.token, scillinfo.environment);
      challengesApi.getPersonalChallenges(scillinfo.appId).then(categories => {
        this.props.updateChallenges(categories);
        this.claimRewards(categories);

        // Unlock and activate every challenge
        categories.forEach(categories => {
          categories.challenges.forEach(challenge => {
            if (challenge.type === 'unlock') {
              console.log("Unlocking challenge", challenge);
              challengesApi.unlockPersonalChallenge(scillinfo.appId, challenge.challenge_id).then(response => {
                console.log("Challenge unlocked, now activating", challenge);
                challengesApi.activatePersonalChallenge(scillinfo.appId, challenge.challenge_id).then(response => {
                  console.log("Challenge activated", challenge);
                }).catch(error => {
                  console.log("Failed to activate challenge", error, challenge);
                });
              }).catch(error => {
                console.warn("Failed to unlock challenge", error, challenge);
              });
            } else if (challenge.type === 'unlocked') {
              console.log("Challenge is unlocked, activating", challenge);
              challengesApi.activatePersonalChallenge(scillinfo.appId, challenge.challenge_id).then(response => {
                console.log("Challenge activated", challenge);
              }).catch(error => {
                console.log("Failed to activate challenge", error, challenge);
              });
            }
          })
        })
      });

      setInterval(() => {
        challengesApi.getPersonalChallenges(scillinfo.appId).then(categories => {
          this.props.updateChallenges(categories);
          this.claimRewards(categories);
        });
      }, 1000);
    });
  }

  render () {
    const props = this.props;
    return (
      <div>
        {props.categories.map(category => (
          <div key={category.category_id} className='category'>
            <h3>{category.category_name}</h3>
            {category.challenges.map(challenge => (
              <div key={challenge.challenge_id} className={`challenge ${challenge.type === 'unclaimed' ? "finished" : ""}`}>
                <img src={challenge.challenge_icon}/>
                <div style={{width: '100%'}}>
                  <h4 className='challenge-name'>{challenge.challenge_name}</h4>
                  <ChallengeProgress challenge={challenge}/>
                </div>
              </div>
            ))}
          </div>
        ))}

      </div>
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Challenges)
