import React from 'react';

import { Team } from '../Team';
import { questions } from '../questions';
import { TeamProgress } from './TeamProgress';

interface Props {
  team: Team;
  onSubmit: (question: number, answer: string, team: string) => void;
  onGoToQuestion: (question: number, team: string) => void;
  onGoHome: () => void;
}

declare module 'csstype' {
  interface Properties {
    '--team-color'?: string;
  }
}

export const QuizScreen: React.SFC<Props> = (props: Props) => {
  // XXX Show team summary
  // XXX Show go back link even here
  if (props.team.question >= questions.length) {
    return (
      <div className="quiz-screen screen finished">
        <div className="title">完了🏁</div>
        <div className="explanation">
          お疲れ様です！他のチームの状況は以下のとおりです。
        </div>
      </div>
    );
  }

  const question = questions[props.team.question];
  const answer =
    props.team.answers.length >= props.team.question - 1
      ? props.team.answers[props.team.question]
      : '';

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const form = evt.target as HTMLFormElement;
    const answer = (form.elements.namedItem('answer') as HTMLInputElement)
      .value;
    props.onSubmit(props.team.question, answer, props.team.id);
  };

  const onBack = () => {
    if (props.team.question === 0) {
      props.onGoHome();
    } else {
      props.onGoToQuestion(props.team.question - 1, props.team.id);
    }
  };

  return (
    <div className="quiz-screen screen">
      <div className="title" style={{ '--team-color': props.team.color }}>
        チーム
        {props.team.name}
        ：第
        {String.fromCharCode(props.team.question + 9312)}
        問題
      </div>
      <form onSubmit={onSubmit} key={props.team.question}>
        {question}
        <textarea name="answer" defaultValue={answer} />
        <div className="button-row">
          <input
            type="submit"
            className="rounded-button primary"
            value="送信"
          />
          <input
            type="button"
            className="minor-button"
            value="← 戻る"
            onClick={onBack}
          />
        </div>
      </form>
    </div>
  );
};
