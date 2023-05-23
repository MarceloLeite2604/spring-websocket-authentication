import { useContext } from 'react';
import { WebSocketContext, WebSocketHttpClientErrorHandler } from '../providers';

export const useWebSocket : () => [
  (string | ArrayBufferLike | ArrayBufferView | Blob | undefined),
  number,
  ((webSocketClientErrorHandler? : WebSocketHttpClientErrorHandler) => void),
  (() => void),
  ((data: string | ArrayBufferLike | ArrayBufferView | Blob) => void) | undefined] = () => {
  
  const { state, connect, disconnect, send, value } = useContext(WebSocketContext);
  return [value, state, connect, disconnect, send];
};
