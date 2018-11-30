import React from 'react';
import { Team } from '../Team';
import { questions } from '../questions';

interface Props {
  teams: Array<Team>;
  onDeleteTeam?: (id: string) => void;
}

declare module 'csstype' {
  interface Properties {
    '--team-color'?: string;
  }
}

export const TeamProgress: React.SFC<Props> = (props: Props) => {
  return (
    <div className="team-progress">
      {props.teams.map(team => (
        <div key={team.id} style={{ '--team-color': team.color }}>
          <div className="name">{team.name}</div>
          <div className="progress">
            残り
            {questions.length - team.question}
            個の質問
          </div>
          {props.onDeleteTeam ? (
            <button
              className="delete-team"
              onClick={() => props.onDeleteTeam!(team.id)}
            >
              削除
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};
