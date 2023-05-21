import { FC, PropsWithChildren } from 'react';
import { KeycloakProvider } from './KeycloakProvider';
import { WebSocketProvider } from './WebSocketContext';

export const Providers : FC<PropsWithChildren> = ({ children }) => (
  <KeycloakProvider>
    <WebSocketProvider>
      { children }
    </WebSocketProvider>
  </KeycloakProvider>
);
