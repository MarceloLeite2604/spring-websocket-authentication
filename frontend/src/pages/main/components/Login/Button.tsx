import { useKeycloak } from '@react-keycloak/web';

export const Button = () => {
  const { initialized, keycloak } = useKeycloak();

  if (!initialized) {
    return <></>;
  }

  if (keycloak.authenticated) {
    return <button onClick={() => keycloak.logout()}>Log out</button>;
  }
        
  return <button onClick={() => keycloak.login()}>Log in</button>;
};
