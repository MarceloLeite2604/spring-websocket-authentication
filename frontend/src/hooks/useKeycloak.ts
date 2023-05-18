import Keycloak from 'keycloak-js';
import { configuration } from '../configuration';
import { useState } from 'react';

export const useKeycloak = () => {
  const [keycloak] = useState(() => new Keycloak({
    url: configuration.keycloak.url,
    realm: configuration.keycloak.realm,
    clientId: configuration.keycloak.clientId
  }));

  return keycloak;
};
