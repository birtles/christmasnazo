import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { State } from '../reducer';
import * as actions from '../actions';
import { SelectScreen } from './SelectScreen';

const mapStateToProps = (state: State) => ({ teams: state.teams });
const mapDispatchToProps = (dispatch: Dispatch<actions.Action>) => ({
  onSelectTeam: (id: string) => {
    dispatch(actions.selectTeam(id));
  },
  onNewTeam: () => {
    dispatch(actions.showNewTeamForm());
  },
});

export const ConnectedSelectScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectScreen);
