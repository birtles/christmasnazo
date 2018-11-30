import React from 'react';
import { Team } from '../Team';

interface Props {
  teams: Array<Team>;
  onSelectTeam: (id: string) => void;
}

declare module 'csstype' {
  interface Properties {
    '--team-color'?: string;
  }
}

export const TeamSelect: React.SFC<Props> = (props: Props) => {
  const onClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    const id = (evt.target as HTMLButtonElement).dataset.teamId as string;
    props.onSelectTeam(id);
  };

  return (
    <ul className="team-select">
      {props.teams.map(team => (
        <li key={team.id}>
          <button
            className="rounded-button"
            data-team-id={team.id}
            style={{ '--team-color': team.color }}
            onClick={onClick}
          >
            {team.name}
          </button>
        </li>
      ))}
    </ul>
  );
};
