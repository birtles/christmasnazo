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

const getTime = (team: Team): string => {
  if (team.endTime === null) {
    return '--:--';
  } else {
    const diff = Math.abs(team.endTime.getTime() - team.startTime.getTime());
    const msPerMin = 1000 * 60;
    const mins = Math.floor(diff / msPerMin);
    const secs = Math.round((diff % msPerMin) / 1000);
    return `${mins}分${secs}秒`;
  }
};

export const TeamProgress: React.SFC<Props> = (props: Props) => {
  return (
    <div className="team-progress">
      {props.teams.map(team => (
        <div key={team.id} style={{ '--team-color': team.color }}>
          <div className="name">{team.name}</div>
          <div className="progress">
            <div className="questions">
              残り
              {questions.length - team.question}
              個の質問
            </div>
            <div className="time">
              {getTime(team)}
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
        </div>
      ))}
    </div>
  );
};
