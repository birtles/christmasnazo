import React from 'react';

interface Props {
  error: string;
}

export const ErrorScreen: React.SFC<Props> = (props: Props) => {
  return (
    <div className="error-screen screen">
      <div className="title">
        なんか壊れているみたい💦
      </div>
      <div className="message">
        {props.error}
      </div>
    </div>
  );
};
