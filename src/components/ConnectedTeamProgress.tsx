import { connect } from 'react-redux';

import { State } from '../reducer';
import { TeamProgress } from './TeamProgress';

const mapStateToProps = (state: State) => ({
  teams: state.teams,
});

export const ConnectedTeamProgress = connect(mapStateToProps)(TeamProgress);
