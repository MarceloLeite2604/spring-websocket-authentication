import { useKeycloak } from '@react-keycloak/web';

export const Message = () => {
  const { initialized, keycloak } = useKeycloak();

  if (!initialized) {
    return <p>Checking authentication...</p>;
  }
  
  if (keycloak.authenticated) {
    if (!keycloak.idTokenParsed) {
      keycloak.loadUserProfile();
    }
        
    const username = keycloak.idTokenParsed?.preferred_username;
        
    return <p>You are logged in as {username}.</p>;
  }
  
  return <p>You are logged out.</p>;
  
};
