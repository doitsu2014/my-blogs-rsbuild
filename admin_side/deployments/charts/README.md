# my-blogs-admin-side Helm Chart

React SPA admin panel served by nginx with runtime configuration.

## Quick Start

```bash
cd admin_side/deployments/charts

# Install with default values
helm install my-admin ./my-blogs-admin-side --namespace my-blogs --create-namespace

# Install with custom values
helm install my-admin ./my-blogs-admin-side -f values-prod.yaml --namespace my-blogs

# Upgrade
helm upgrade my-admin ./my-blogs-admin-side -f values-prod.yaml --namespace my-blogs

# Uninstall
helm uninstall my-admin --namespace my-blogs
```

## Configuration

### Runtime App Config

The app configuration is injected at runtime via ConfigMap mounted as `/usr/share/nginx/html/config.js`.

```yaml
appConfig:
  keycloakUrl: "https://auth.example.com"
  keycloakRealm: "myrealm"
  keycloakClientId: "admin-client"
  keycloakScope: "my-headless-cms-api-all email openid profile"
  graphqlApiUrl: "https://api.example.com/graphql"
  graphqlCacheApiUrl: ""
  restApiUrl: "https://api.example.com"
  mediaUploadApiUrl: ""
```

### Example `values-prod.yaml`

```yaml
replicaCount: 2

image:
  repository: doitsu2014/my-blogs-admin-side
  pullPolicy: Always
  tag: v1.0.0

appConfig:
  keycloakUrl: "https://auth.example.com"
  keycloakRealm: "production"
  keycloakClientId: "admin-client"
  keycloakScope: "my-headless-cms-api-all email openid profile"
  graphqlApiUrl: "https://api.example.com/graphql"
  restApiUrl: "https://api.example.com"

ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "8m"
  hosts:
    - host: admin.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: admin-tls
      hosts:
        - admin.example.com

resources:
  limits:
    cpu: 200m
    memory: 128Mi
  requests:
    cpu: 100m
    memory: 64Mi
```

## Health Checks

The nginx container exposes `/health` endpoint for liveness and readiness probes.
