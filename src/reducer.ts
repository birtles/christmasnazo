import * as actions from './actions';
import { Team } from './Team';

export const NEW_TEAM: unique symbol = Symbol('new-team');

export interface State {
  isLoading: boolean;
  isActive: boolean;
  question: number;
  teams: Array<Team>;
  // If it's a string, it's the team ID
  selectedTeam: string | typeof NEW_TEAM | null;
  error?: string;
}

const initialState: State = {
  isLoading: true,
  isActive: true,
  question: 0,
  teams: [],
  selectedTeam: null,
};

export function reducer(state = initialState, action: actions.Action): State {
  switch (action.type) {
    case 'ERROR':
      return {
        ...state,
        error: action.message,
      };

    case 'LOAD_TEAMS': {
      // If the selected team has been removed, clear it.
      let selectedTeam = state.selectedTeam;
      let question = state.question;
      if (!action.teams.some(team => team.id === selectedTeam)) {
        selectedTeam = null;
        question = 0;
      }

      return {
        ...state,
        isLoading: false,
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

      // If we deleted the selected team, clear it.
      let selectedTeam = state.selectedTeam;
      let question = state.question;
      if (state.selectedTeam === action.id) {
        selectedTeam = null;
        question = 0;
      }

      return {
        ...state,
        question,
        teams,
        selectedTeam,
      };
    }

    case 'SELECT_TEAM': {
      return {
        ...state,
        selectedTeam: action.id,
      };
    }

    case 'CLEAR_TEAM': {
      return {
        ...state,
        selectedTeam: null,
      };
    }

    case 'SHOW_NEW_TEAM_FORM': {
      return {
        ...state,
        selectedTeam: NEW_TEAM,
      };
    }

    case 'UPDATE_GAME_STATUS': {
      return {
        ...state,
        isActive: action.status.active,
      };
    }

    default:
      return state;
  }
}

export default reducer;
