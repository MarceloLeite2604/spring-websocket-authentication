import React from 'react';

import { Login, KeycloakProvider } from './components';

function App() {

  return (
    <KeycloakProvider>
      <Login />
    </KeycloakProvider>
  );
}

export default App;
