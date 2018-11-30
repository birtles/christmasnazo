import React from 'react';
import { Team } from '../Team';
import { questions } from '../questions';

interface Props {
  teams: Array<Team>;
}

declare module 'csstype' {
  interface Properties {
    '--team-color'?: string;
  }
}

export const AnswerSummary: React.SFC<Props> = (props: Props) => {
  return (
    <div className="answer-summary">
      {questions.map((question, i) => {
        // Collect up answers for the question
        const answers: Array<{ team: Team; answer: string }> = [];
        for (const team of props.teams) {
          if (team.answers.length >= i - 1 && team.answers[i]) {
            answers.push({ team, answer: team.answers[i] });
          }
        }

        return (
          <div className="question" key={i}>
            <div className="title">
              第{String.fromCharCode(i + 9312)}
              問題
            </div>
            <div className="summary">{question.summary}</div>
            <div className="answers">
              {answers.map(answer => (
                <div
                  className="answer"
                  key={answer.team.id}
                  style={{ '--team-color': answer.team.color }}
                >
                  {answer.answer}
                  <div style={{ float: 'right', fontWeight: 'bold' }}> ({answer.team.name})</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
