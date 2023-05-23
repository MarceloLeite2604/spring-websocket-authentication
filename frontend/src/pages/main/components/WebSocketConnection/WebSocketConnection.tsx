import Styles from './WebSocketConnection.module.css';
import {
  Connection,
  Input,
  Output
} from './components';

export const WebSocketConnection = () => {
  return (
    <div className={Styles.WebSocketConnection}>
      <Connection />
      <Input />
      <Output />
    </div>
  );
};
