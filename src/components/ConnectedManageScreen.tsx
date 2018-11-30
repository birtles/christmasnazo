import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { DataStore } from '../DataStore';
import { State } from '../reducer';
import * as actions from '../actions';
import { ManageScreen } from './ManageScreen';

interface OwnProps {
  dataStore: DataStore;
}

const mapStateToProps = (state: State) => ({
  teams: state.teams,
  isActive: state.isActive,
});
const mapDispatchToProps = (
  dispatch: Dispatch<actions.Action>,
  ownProps: OwnProps
) => ({
  onDeleteTeam: (id: string) => {
    ownProps.dataStore.deleteTeam(id).catch(err => {
      console.error(err);
      dispatch(actions.error('削除できなかった😭'));
    });
  },
  onReset: () => {
    ownProps.dataStore
      .deleteAllTeams()
      .then(() => ownProps.dataStore.setGameStatus({ active: true }))
      .catch(err => {
        console.error(err);
        dispatch(actions.error('リセットできなかった😭'));
      });
  },
  onSetGameStatus: (active: boolean) => {
    ownProps.dataStore.setGameStatus({ active }).catch(err => {
      console.error(err);
      dispatch(actions.error('なんか失敗した😭'));
    });
  },
});

export const ConnectedManageScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageScreen);
