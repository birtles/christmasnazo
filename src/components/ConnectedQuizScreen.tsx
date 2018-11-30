import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { DataStore } from '../DataStore';
import { State } from '../reducer';
import * as actions from '../actions';
import { QuizScreen } from './QuizScreen';
import { TeamUpdate } from '../Team';
import { questions } from '../questions';

interface OwnProps {
  dataStore: DataStore;
}

const mapStateToProps = (state: State) => ({
  team: state.teams.find(team => team.id === state.selectedTeam)!,
});
const mapDispatchToProps = (
  dispatch: Dispatch<actions.Action>,
  ownProps: OwnProps
) => ({
  onSubmit: async (question: number, answer: string, team: string) => {
    try {
      const currentTeam = await ownProps.dataStore.getTeam(team);
      const answers = currentTeam.answers.slice();
      if (answer) {
        if (answers.length - 1 < question) {
          answers[question] = answer;
        } else {
          answers.splice(question, 1, answer);
        }
      }
      const update: TeamUpdate = {
        id: team,
        question: question + 1,
        answers,
      };
      if (question === questions.length - 1) {
        update.endTime = new Date();
      }
      await ownProps.dataStore.updateTeam(update);
    } catch (err) {
      console.error(err);
      dispatch(actions.error('答えの受付できなかった😭'));
    }
  },
  onGoToQuestion: (question: number, team: string) => {
    ownProps.dataStore.updateTeam({ id: team, question }).catch(err => {
      console.error(err);
      dispatch(actions.error('なんかおかしい。チームなくなった？😭'));
    });
  },
  onGoHome: () => {
    dispatch(actions.clearTeam());
  },
});

export const ConnectedQuizScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuizScreen);
