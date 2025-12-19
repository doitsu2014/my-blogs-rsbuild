import Keycloak from 'keycloak-js';

// Keycloak configuration from environment variables
const keycloakConfig = {
  url: import.meta.env.PUBLIC_KEYCLOAK_URL || 'https://my-ids-admin.ducth.dev',
  realm: import.meta.env.PUBLIC_KEYCLOAK_REALM || 'my-realm',
  clientId: import.meta.env.PUBLIC_KEYCLOAK_CLIENT_ID || 'admin-side-client',
};

// Create Keycloak instance
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
