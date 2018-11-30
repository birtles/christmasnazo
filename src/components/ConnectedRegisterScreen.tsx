import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { DataStore } from '../DataStore';
import * as actions from '../actions';
import { RegisterScreen } from './RegisterScreen';

interface OwnProps {
  dataStore: DataStore;
}

const mapDispatchToProps = (
  dispatch: Dispatch<actions.Action>,
  ownProps: OwnProps
) => ({
  onNewTeam: (name: string, color: string) => {
    ownProps.dataStore
      .putTeam({
        name,
        color,
        question: 0,
        answers: [],
        startTime: new Date(),
        endTime: null,
      })
      .then(team => {
        dispatch(actions.selectTeam(team.id));
      })
      .catch(() => {
        dispatch(actions.error('チーム登録失敗した😭'));
      });
  },
  onReturn: () => {
    dispatch(actions.clearTeam());
  },
});

export const ConnectedRegisterScreen = connect(
  undefined,
  mapDispatchToProps
)(RegisterScreen);
