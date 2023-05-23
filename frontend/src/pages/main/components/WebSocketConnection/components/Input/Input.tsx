import { KeyboardEventHandler, useRef } from 'react';
import { useWebSocket } from '../../../../../../hooks';
import Styles from './Input.module.css';

export const Input = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const [,,,, send] = useWebSocket();

  function sendContent() {
    if (inputRef.current?.value) {
      send?.(inputRef.current.value);
      inputRef.current.value = '';
    }
  }

  const keyDownEvent : KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      sendContent();
    }
  };

  return (
    <div className={Styles.WebSocketInput}>
      <input type='text'
        ref={inputRef}
        onKeyDown={keyDownEvent}/>
      <button onClick={sendContent}>Send</button>
    </div>
  );
};
