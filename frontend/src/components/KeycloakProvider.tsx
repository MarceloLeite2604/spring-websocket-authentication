import {
  FC,
  ReactNode,
  useState
} from 'react';
import Keycloak from 'keycloak-js';
import { configuration } from '../../configuration';
import { ReactKeycloakProvider } from '@react-keycloak/web';

const initOptions = {
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  pkceMethod: 'S256'
};

type Props = {
  children?: ReactNode
};

export const KeycloakProvider : FC<Props> = ({ children }) => {

  const [keycloak] = useState(() => new Keycloak({
    url: configuration.keycloak.url,
    realm: configuration.keycloak.realm,
    clientId: configuration.keycloak.clientId
  }));

  return (
    <ReactKeycloakProvider authClient={keycloak}
      initOptions={initOptions}>
      { children }
    </ReactKeycloakProvider>
  );
};
