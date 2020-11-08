import React from 'react'
import {connect} from 'react-redux'
import commaNumber from 'comma-number'
import {getLevel} from '../stores/level'
import {getLines} from '../stores/lines'
import {getScore} from '../stores/score'

import ScoreboardText from '../components/ScoreboardText'
import { getSessionId } from '../stores/session'

const mapStateToProps = (state) => ({
  level: commaNumber(getLevel(state)),
  lines: commaNumber(getLines(state)),
  score: commaNumber(getScore(state)),
  session: getSessionId(state)
})

const Scoreboard = props => (
  <div className='scoreboard'>
    <ScoreboardText label='Level' value={props.level} />
    <ScoreboardText label='Score' value={props.score} />
    <ScoreboardText label='Lines' value={props.lines} />
    <ScoreboardText label='session' value={props.session} />
  </div>
)

export default connect(mapStateToProps)(Scoreboard)
