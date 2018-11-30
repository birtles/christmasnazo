import { Team } from './Team';
import { GameStatus } from './GameStatus';

export interface ErrorAction {
  type: 'ERROR';
  message: string;
}

export function error(message: string): ErrorAction {
  return {
    type: 'ERROR',
    message,
  };
}

export interface LoadTeamsAction {
  type: 'LOAD_TEAMS';
  teams: Array<Team>;
}

export function loadTeams(teams: Array<Team>): LoadTeamsAction {
  return {
    type: 'LOAD_TEAMS',
    teams,
  };
}

export interface UpdateTeamAction {
  type: 'UPDATE_TEAM';
  team: Team;
}

export function updateTeam(team: Team): UpdateTeamAction {
  return {
    type: 'UPDATE_TEAM',
    team,
  };
}

export interface DeleteTeamAction {
  type: 'DELETE_TEAM';
  id: string;
}

export function deleteTeam(id: string): DeleteTeamAction {
  return {
    type: 'DELETE_TEAM',
    id,
  };
}

export interface SelectTeamAction {
  type: 'SELECT_TEAM';
  id: string;
}

export function selectTeam(id: string): SelectTeamAction {
  return {
    type: 'SELECT_TEAM',
    id,
  };
}

export interface ClearTeamAction {
  type: 'CLEAR_TEAM';
}

export function clearTeam(): ClearTeamAction {
  return { type: 'CLEAR_TEAM' };
}

export interface ShowNewTeamFormAction {
  type: 'SHOW_NEW_TEAM_FORM';
}

export function showNewTeamForm(): ShowNewTeamFormAction {
  return {
    type: 'SHOW_NEW_TEAM_FORM',
  };
}

export interface UpdateGameStatusAction {
  type: 'UPDATE_GAME_STATUS';
  status: GameStatus;
}

export function updateGameStatus(status: GameStatus): UpdateGameStatusAction {
  return {
    type: 'UPDATE_GAME_STATUS',
    status,
  };
}

export type Action =
  | ErrorAction
  | LoadTeamsAction
  | UpdateTeamAction
  | DeleteTeamAction
  | SelectTeamAction
  | ClearTeamAction
  | ShowNewTeamFormAction
  | UpdateGameStatusAction;
