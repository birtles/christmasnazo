import { Team } from './Team';

export interface LoadTeamsAction {
  type: 'LOAD_TEAMS',
  teams: Array<Team>
};

export function loadTeams(teams: Array<Team>): LoadTeamsAction {
  return {
    type: 'LOAD_TEAMS',
    teams,
  };
}

export interface UpdateTeamAction {
  type: 'UPDATE_TEAM',
  team: Team
};

export function updateTeam(team: Team): UpdateTeamAction {
  return {
    type: 'UPDATE_TEAM',
    team,
  };
}

export interface DeleteTeamAction {
  type: 'DELETE_TEAM',
  id: string,
};

export function deleteTeam(id: string): DeleteTeamAction {
  return {
    type: 'DELETE_TEAM',
    id,
  };
}

export type Action = LoadTeamsAction | UpdateTeamAction | DeleteTeamAction;
