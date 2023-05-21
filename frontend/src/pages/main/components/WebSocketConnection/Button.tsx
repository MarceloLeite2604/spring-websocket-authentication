import { useKeycloak } from '@react-keycloak/web';
import { useWebSocket } from '../../../../hooks';

export const Button = () => {
  const { initialized, keycloak } = useKeycloak();

  const [, state, connect, disconnect] = useWebSocket();

  if (!initialized || !keycloak.authenticated) {
    return <></>;
  }

  if (state === WebSocket.CLOSED) {
    return <button onClick={connect}>Connect</button>;
  }

  if (state === WebSocket.CONNECTING) {
    return <p>Connecting...</p>;
  }

  if (state === WebSocket.CLOSING) {
    return <p>Disconnecting...</p>;
  }
   
  return <button onClick={disconnect}>Disconnect</button>;
};
