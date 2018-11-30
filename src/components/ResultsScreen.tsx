import React from 'react';
import { TeamProgress } from './TeamProgress';
import { AnswerSummary } from './AnswerSummary';
import { Team } from '../Team';

interface Props {
  teams: Array<Team>;
}

export const ResultsScreen: React.SFC<Props> = (props: Props) => {
  return (
    <div className="results-screen screen">
      <TeamProgress teams={props.teams} />
      <AnswerSummary teams={props.teams} />
    </div>
  );
};
