interface Configuration {
  keycloak: {
    url: string,
    realm: string,
    clientId: string
  },
  websocketUrl: string
};

export const configuration : Configuration = {
  keycloak: {
    url: process.env.REACT_APP_KEYCLOAK_URL || '',
    realm: process.env.REACT_APP_KEYCLOAK_REALM || '',
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || ''
  },
  websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || ''
};
