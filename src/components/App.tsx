import React from 'react';
import { connect } from 'react-redux';

import { DataStore } from '../DataStore';
import { State, NEW_TEAM } from '../reducer';
import { ConnectedManageScreen } from './ConnectedManageScreen';
import { ConnectedQuizScreen } from './ConnectedQuizScreen';
import { ConnectedRegisterScreen } from './ConnectedRegisterScreen';
import { ConnectedResultsScreen } from './ConnectedResultsScreen';
import { ConnectedSelectScreen } from './ConnectedSelectScreen';
import { ErrorScreen } from './ErrorScreen';
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
  if (props.error) {
    return <ErrorScreen error={props.error} />;
  } else if (props.isLoading) {
    return <LoadingScreen />;
  } else if (props.isManager) {
    return <ConnectedManageScreen dataStore={props.dataStore} />;
  } else if (!props.isActive) {
    return <ConnectedResultsScreen />;
  } else if (props.teamState === 'register') {
    return <ConnectedRegisterScreen dataStore={props.dataStore} />;
  } else if (props.teamState === 'selected') {
    return <ConnectedQuizScreen dataStore={props.dataStore} />;
  } else {
    return <ConnectedSelectScreen />;
  }
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
