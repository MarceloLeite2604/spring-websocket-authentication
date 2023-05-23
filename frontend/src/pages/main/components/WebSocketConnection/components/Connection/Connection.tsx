import { useState } from 'react';
import { Button } from './Button';
import { Output } from './Output';
import Styles from './Connection.module.css';

export enum ConnectionError {
  UNAUTHENTICATED,
  UNAUTHORIZED
}

export const Connection = () => {

  const [connectionError, setConnectionError] = useState<ConnectionError>();
  const [connectionErrorTimer, setConnectionErrorTimer] = useState<ReturnType<typeof setInterval>>();

  function updateConnectionError(connectionError: ConnectionError) {
    connectionErrorTimer && clearInterval(connectionErrorTimer);
    
    setConnectionErrorTimer(setInterval(() => setConnectionError(undefined), 3000));

    setConnectionError(connectionError);
  }

  return <div className={Styles.Connection}>
    <Button updateConnectionError={updateConnectionError}/>
    <Output connectionError={connectionError} />
  </div>;
};
