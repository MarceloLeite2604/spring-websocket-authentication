import { FC } from 'react';
import { ConnectionError } from './Connection';

interface OutputProps {
  connectionError?: ConnectionError
}

export const Output : FC<OutputProps> = ({ connectionError }) => {

  let content : string | undefined;
  if (connectionError === ConnectionError.UNAUTHENTICATED) {
    content = 'Not authenticated';
  } else if (connectionError === ConnectionError.UNAUTHORIZED) {
    content = 'Not authorized';
  }

  return <div><span>{content}</span></div>;
};
