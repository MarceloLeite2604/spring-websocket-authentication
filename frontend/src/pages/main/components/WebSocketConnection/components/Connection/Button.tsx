import { FC } from 'react';
import { useWebSocket } from '../../../../../../hooks';
import { ConnectionError } from './Connection';

interface ButtonProps {
  updateConnectionError: (connectionError: ConnectionError) => void
}

export const Button : FC<ButtonProps> = ({ updateConnectionError }) => {
  const [, state, connect, disconnect] = useWebSocket();

  function webSocketClientErrorHandler(state: number) {
    if (state === 401) {
      updateConnectionError(ConnectionError.UNAUTHENTICATED);
    } else if (state === 403) {
      updateConnectionError(ConnectionError.UNAUTHORIZED);
    }
  }

  function onClick() {
    connect(webSocketClientErrorHandler);
  }

  if (state === WebSocket.CLOSED) {
    return <button onClick={onClick}>Connect</button>;
  }

  if (state === WebSocket.CONNECTING) {
    return <p>Connecting...</p>;
  }

  if (state === WebSocket.CLOSING) {
    return <p>Disconnecting...</p>;
  }
   
  return <button onClick={disconnect}>Disconnect</button>;
};
