import { Button } from './Button';
import { WebSocketOutput } from './WebSocketOutput';
import Styles from './WebSocketConnection.module.css';

export const WebSocketConnection = () => {
  return (
    <div className={Styles.WebSocketConnection}>
      <Button />
      <WebSocketOutput />
    </div>
  );
};
