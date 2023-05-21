import { useKeycloak } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import Styles from './Login.module.css';
import { FC, ReactNode } from 'react';

type LoginWrapperProps = {
  children?: ReactNode
};

export const LoginWrapper : FC<LoginWrapperProps> = ({ children }) => (
  <div className={Styles.Login}>
    {children}
  </div>
);

export const Login = () => {
  const { initialized, keycloak: anyKeycloak } = useKeycloak();
  const keycloak : Keycloak = anyKeycloak;

  let content = <p>Checking authentication...</p>; ;
  if (initialized) {
    if (keycloak.authenticated) {
      content =
        <>
          <p>You are logged in.</p>
          <button onClick={() => keycloak.logout()}>Log out</button>
        </>;
    } else {
      content =
        <>
          <p>You are logged out.</p>
          <button onClick={() => keycloak.login()}>Log in</button>
        </>;
    }
  }

  return (
    <LoginWrapper>
      {content}
    </LoginWrapper>
  );
};
