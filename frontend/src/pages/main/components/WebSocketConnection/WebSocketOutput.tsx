import {
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { useWebSocket } from '../../../../hooks';
import Styles from './WebSocketConnection.module.css';

export const WebSocketOutput = () => {

  const [content, setContent] = useState<string[]>([]);

  const [value] = useWebSocket();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current?.scrollHeight || 0;
    }
  });

  if (typeof value === 'string' && (content.length === 0 || content[content.length - 1] !== value)) {
    setContent(previousContent => [...previousContent, value]);
  }

  return <textarea className={Styles.WebSocketOutput}
    value={content.join('\n')}
    ref={textAreaRef}
    readOnly={true} />;
};
