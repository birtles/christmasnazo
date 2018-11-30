import React from 'react';
import { connect } from 'react-redux';

import { DataStore } from '../DataStore';
import { State, NEW_TEAM } from '../reducer';
import { ConnectedManageScreen } from './ConnectedManageScreen';
import { ConnectedSelectScreen } from './ConnectedSelectScreen';
import { ConnectedRegisterScreen } from './ConnectedRegisterScreen';
import { LoadingScreen } from './LoadingScreen';

interface Props {
  dataStore: DataStore;
  error: string | undefined;
  isLoading: boolean;
  isManager: boolean;
  isActive: boolean;
  teamState: 'selected' | 'register' | 'none';
}

const AppInner: React.SFC<Props> = (props: Props) => {
  let screen:
    | 'results'
    | 'quiz'
    | 'loading'
    | 'error';

  if (props.error) {
    screen = 'error';
  } else if (props.isLoading) {
    return <LoadingScreen />;
  } else if (props.isManager) {
    return <ConnectedManageScreen dataStore={props.dataStore} />;
  } else if (!props.isActive) {
    screen = 'results';
  } else if (props.teamState === 'register') {
    return <ConnectedRegisterScreen dataStore={props.dataStore} />;
  } else if (props.teamState === 'selected') {
    screen = 'quiz';
  } else {
    return <ConnectedSelectScreen />;
  }

  return <div className="error">Unimplemented screen</div>;
};

const mapStateToProps = (state: State) => ({
  error: state.error,
  isLoading: state.isLoading,
  isActive: state.isActive,
  teamState:
    state.selectedTeam === null
      ? 'none'
      : state.selectedTeam === NEW_TEAM
        ? 'register'
        : 'selected',
});

export const App = connect(mapStateToProps)(AppInner);
