import React from 'react'
import {connect} from 'react-redux'
import commaNumber from 'comma-number'
import {getLevel} from '../stores/level'
import {getLines} from '../stores/lines'
import {getScore} from '../stores/score'

import ScoreboardText from '../components/ScoreboardText'
import { getSessionId } from '../stores/session'
import { getUser } from '../stores/user'

const mapStateToProps = (state) => ({
  level: commaNumber(getLevel(state)),
  lines: commaNumber(getLines(state)),
  score: commaNumber(getScore(state)),
  session: getSessionId(state),
  user: getUser(state)
})

const Scoreboard = props => (
  <div className='scoreboard'>
    <ScoreboardText label='Level' value={props.level} />
    <ScoreboardText label='Score' value={props.score} />
    <ScoreboardText label='Lines' value={props.lines} />
    <ScoreboardText label='Session' value={props.session} />
    <ScoreboardText label='User' value={props.user.userId} />
  </div>
)

export default connect(mapStateToProps)(Scoreboard)
