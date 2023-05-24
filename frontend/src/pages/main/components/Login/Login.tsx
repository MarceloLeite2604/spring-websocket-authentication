import Styles from './Login.module.css';
import { Button } from './Button';
import { Message } from './Message';

export const Login = () => (
  <div className={Styles.Login}>
    <Message />
    <Button />
  </div>
);
