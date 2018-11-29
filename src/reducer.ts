import * as actions from './actions';
import { Team } from './Team';

export interface State {
  screen: 'home' | 'quiz' | 'summary';
  isLoading: boolean;
  question: number;
  teams: Array<Team>;
  selectedTeam: string | null; // ID of the team
}

const initialState: State = {
  screen: 'home',
  isLoading: true,
  question: 0,
  teams: [],
  selectedTeam: null,
};

export function reducer(state = initialState, action: actions.Action): State {
  switch (action.type) {
    case 'LOAD_TEAMS': {
      // Clear loading flag if we are on the home screen
      const isLoading = state.isLoading && state.screen !== 'home';

      // If the selectedTeam has been removed, clear it.
      let selectedTeam = state.selectedTeam;
      let screen = state.screen;
      let question = state.question;
      if (!action.teams.some(team => team.id === selectedTeam)) {
        selectedTeam = null;
        question = 0;
        if (screen === 'quiz') {
          screen = 'home';
        }
      }

      return {
        ...state,
        screen,
        isLoading,
        question,
        selectedTeam,
        teams: action.teams,
      };
    }

    case 'UPDATE_TEAM': {
      const teams = state.teams.slice();
      const index = state.teams.findIndex(team => team.id === action.team.id);
      if (index === -1) {
        teams.push(action.team);
      } else {
        teams[index] = action.team;
      }

      return {
        ...state,
        teams,
      };
    }

    case 'DELETE_TEAM': {
      const teams = state.teams.filter(team => team.id !== action.id);

      // If we deleted the selected team, reset to the home screen if needed.
      let selectedTeam = state.selectedTeam;
      let screen = state.screen;
      let question = state.question;
      if (state.selectedTeam === action.id) {
        selectedTeam = null;
        question = 0;
        if (screen === 'quiz') {
          screen = 'home';
        }
      }

      return {
        ...state,
        screen,
        question,
        teams,
        selectedTeam,
      };
    }

    default:
      return state;
  }
}

export default reducer;
