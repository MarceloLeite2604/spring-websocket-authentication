import { useKeycloak } from '@react-keycloak/web';
import {
  FC,
  ReactNode,
  createContext,
  useRef,
  useState
} from 'react';
import { configuration } from '../configuration';

interface WebSocketProviderValue {
  state: number,
  connect: (webSocketClientErrorHandler? : WebSocketHttpClientErrorHandler) => void,
  disconnect: () => void,
  send: (data: string | ArrayBufferLike | ArrayBufferView | Blob) => void,
  value?: string | ArrayBufferLike | ArrayBufferView | Blob
}

const defaultWebSocketProviderValue : WebSocketProviderValue = {
  state: WebSocket.CLOSED,
  connect: () => {},
  disconnect: () => {},
  send: () => {}
};

export const WebSocketContext = createContext<WebSocketProviderValue>(defaultWebSocketProviderValue);

type WebSocketProviderProps = {
  children: ReactNode
}

export type WebSocketHttpClientErrorHandler = (status : number) => void;

export const WebSocketProvider : FC<WebSocketProviderProps> = ({ children }) => {

  const [state, setState] = useState<number>(WebSocket.CLOSED);
  const [value, setValue] = useState<string | ArrayBufferLike | ArrayBufferView | Blob>();
  
  const webSocketRef = useRef<WebSocket>();

  const { initialized, keycloak } = useKeycloak();

  const connectWebSocket = (wsUrl: URL) => {
    webSocketRef.current = new WebSocket(wsUrl);
    webSocketRef.current.onmessage = (event) => setValue(event.data);
    webSocketRef.current.onopen = () => setState(webSocketRef.current?.readyState || WebSocket.CLOSED);
    webSocketRef.current.onclose = () => setState(webSocketRef.current?.readyState || WebSocket.CLOSED);
  };

  const checkAuthentication = (wsUrl : URL, webSocketClientErrorHandler?: WebSocketHttpClientErrorHandler) => {
    const httpUrl = new URL(wsUrl);

    httpUrl.protocol = 'http';

    const httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function() {
      if (this.readyState === 4) {
        /* HTTP status 400 is intentionally left outside of the range since backend
        will return this status as result when authentication is valid. */
        if (this.status > 400 && this.status < 500) {
          webSocketClientErrorHandler?.(this.status);
        } else {
          connectWebSocket(wsUrl);
        }
      }
    };
    httpRequest.open('GET', httpUrl);
    httpRequest.send();
  };

  const connect = (webSocketClientErrorHandler? : WebSocketHttpClientErrorHandler) => {
    const url = new URL(configuration.websocketUrl);

    if (initialized && keycloak.token) {
      url.searchParams.append('access_token', keycloak.token);
    }

    checkAuthentication(url, webSocketClientErrorHandler);
  };

  const disconnect = () => {
    webSocketRef.current?.close();
    setState(webSocketRef.current?.readyState || WebSocket.CLOSED);
  };
  
  const providerValue : WebSocketProviderValue = {
    state,
    connect,
    disconnect,
    send: webSocketRef.current?.send.bind(webSocketRef.current) || function() {},
    value
  };
  
  return (
    <WebSocketContext.Provider value={providerValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
