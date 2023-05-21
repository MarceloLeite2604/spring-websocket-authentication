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
  connect: () => void,
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

export const WebSocketProvider : FC<WebSocketProviderProps> = ({ children }) => {
  const [state, setState] = useState<number>(WebSocket.CLOSED);
  const [value, setValue] = useState<string | ArrayBufferLike | ArrayBufferView | Blob>();
  
  const webSocketRef = useRef<WebSocket>();

  const { initialized, keycloak } = useKeycloak();

  const connect = () => {
    if (!initialized || !keycloak.token) {
      throw new Error('Not authenticated.');
    }

    const url = new URL(configuration.websocketUrl);
    url.searchParams.append('access_token', keycloak.token);

    webSocketRef.current = new WebSocket(url);
    setState(webSocketRef.current.readyState);

    webSocketRef.current.onmessage = (event) => setValue(event.data);
    webSocketRef.current.onopen = () => setState(webSocketRef.current?.readyState || WebSocket.CLOSED);
    webSocketRef.current.onclose = () => setState(webSocketRef.current?.readyState || WebSocket.CLOSED);
    
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
