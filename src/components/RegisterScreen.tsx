import React from 'react';

import { ColorPicker } from './ColorPicker';

interface Props {
  onNewTeam: (name: string, color: string) => void;
  onReturn: () => void;
}

export const RegisterScreen: React.SFC<Props> = (props: Props) => {
  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    const form = evt.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const color = (form.elements.namedItem('color') as RadioNodeList).value;
    props.onNewTeam(name, color);
    evt.preventDefault();
  };

  const onReset = (evt: React.FormEvent<HTMLFormElement>) => {
    props.onReturn();
  };

  return (
    <div className="register-screen screen">
      <form onSubmit={onSubmit} onReset={onReset}>
        <div className="label">チーム名</div>
        <input type="text" name="name" required />
        <div className="label">チーム色</div>
        <ColorPicker name="color"/>
        <div className="button-row">
          <input type="submit" className="rounded-button primary" value="登録" />
          <input type="reset" className="minor-button" value="← やめとく" />
        </div>
      </form>
    </div>
  );
};
