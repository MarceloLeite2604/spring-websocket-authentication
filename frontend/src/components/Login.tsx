import { useKeycloak } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';

export const Login = () => {
  const { initialized, keycloak: anyKeycloak } = useKeycloak();
  const keycloak : Keycloak = anyKeycloak;

  if (!initialized) {
    return <></>;
  }
  if (keycloak.authenticated) {
    return <button onClick={() => keycloak.logout()}>Log out</button>;
  } else {
    return <button onClick={() => keycloak.login()}>Log in</button>;
  }
};
