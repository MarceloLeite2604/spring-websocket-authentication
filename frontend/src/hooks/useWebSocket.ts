import { useContext } from 'react';
import { WebSocketContext } from '../providers';

export const useWebSocket : () => [
  (string | ArrayBufferLike | ArrayBufferView | Blob | undefined),
  number,
  (() => void) | undefined,
  (() => void) | undefined] = () => {
  
  const { state, connect, disconnect, value } = useContext(WebSocketContext);
  return [value, state, connect, disconnect];
};
