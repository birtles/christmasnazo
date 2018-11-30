import { connect } from 'react-redux';

import { State } from '../reducer';
import { ResultsScreen } from './ResultsScreen';

const mapStateToProps = (state: State) => ({
  teams: state.teams,
});

export const ConnectedResultsScreen = connect(mapStateToProps)(ResultsScreen);
