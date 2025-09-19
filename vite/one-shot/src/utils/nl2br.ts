import React from 'react';

export function nl2br(text: string): React.ReactNode[] {
  return text.split('\n').map((line, index, array) =>
    React.createElement(React.Fragment, { key: index },
      line,
      index < array.length - 1 ? React.createElement('br') : null
    )
  );
}