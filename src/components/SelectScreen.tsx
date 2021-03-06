import React from 'react';
import { TeamSelect } from './TeamSelect';
import { Team } from '../Team';

interface Props {
  teams: Array<Team>;
  onSelectTeam: (id: string) => void;
  onNewTeam: () => void;
}

export const SelectScreen: React.SFC<Props> = (props: Props) => {
  return (
    <div className="select-screen screen">
      <TeamSelect teams={props.teams} onSelectTeam={props.onSelectTeam} />
      { props.teams.length ? <hr /> : null }
      <button className="new-team rounded-button" onClick={props.onNewTeam}>
        新規チーム登録
      </button>
    </div>
  );
};
