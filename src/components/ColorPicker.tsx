import React from 'react';

const colors: Array<string> = [
  'tomato',
  'hotpink',
  'orange',
  'yellow',
  'yellowgreen',
  'mediumaquamarine',
  'palegreen',
  'lightskyblue',
  'deepskyblue',
];

interface Props {
  name: string;
}

export const ColorPicker: React.SFC<Props> = (props: Props) => {
  return (
    <div className="color-picker">
      {colors.map(color => (
        <div className="swatch" key={color}>
          <input
            id={`color-${color}`}
            type="radio"
            name={props.name}
            value={color}
            required
          />
          <label
            className="label"
            htmlFor={`color-${color}`}
            style={{ ['--swatch-color' as any]: color }}
          />
        </div>
      ))}
    </div>
  );
};
