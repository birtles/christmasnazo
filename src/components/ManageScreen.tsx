import React from 'react';
import { TeamProgress } from './TeamProgress';
import { AnswerSummary } from './AnswerSummary';
import { Team } from '../Team';

interface Props {
  teams: Array<Team>;
  isActive: boolean;
  onDeleteTeam: (id: string) => void;
  onReset: () => void;
  onSetGameStatus: (active: boolean) => void;
}

export const ManageScreen: React.SFC<Props> = (props: Props) => {
  return (
    <div className="manage-screen screen">
      <TeamProgress teams={props.teams} onDeleteTeam={props.onDeleteTeam} />
      <AnswerSummary teams={props.teams} />
      <hr />
      <div className="button-row">
        {props.isActive ? (
          <button
            className="finish rounded-button"
            onClick={() => {
              props.onSetGameStatus(false);
            }}
          >
            終了
          </button>
        ) : (
          <button
            className="restart rounded-button"
            onClick={() => {
              props.onSetGameStatus(true);
            }}
          >
            再開
          </button>
        )}
        <button className="reset minor-button" onClick={props.onReset}>
          リセット
        </button>
      </div>
    </div>
  );
};
