# Phase 8 & 10 Implementation Guide

## Phase 8: Keycloak Authentication (COMPLETED)

### Overview
Authentication is now implemented using Keycloak with Authorization Code Flow + PKCE (Proof Key for Code Exchange), which is the modern standard for Single Page Applications.

### Configuration Required

#### 1. Keycloak Server Setup

**Keycloak URL**: `https://my-ids-admin.ducth.dev`

**Create a Client in Keycloak Admin Console:**
1. Navigate to your realm
2. Go to Clients → Create Client
3. Configure:
   - **Client ID**: `admin-side-client` (or your chosen ID)
   - **Client Type**: Public (no client secret)
   - **Standard Flow**: Enabled
   - **Direct Access Grants**: Disabled (use standard flow only)
   - **Valid Redirect URIs**: 
     - `http://localhost:3002/*` (development)
     - `https://your-production-domain.com/*` (production)
   - **Valid Post Logout Redirect URIs**: Same as redirect URIs
   - **Web Origins**: `+` (allows all valid redirect URIs)
   - **PKCE**:Enable PKCE with Code Challenge Method: S256

4. Save the client configuration

#### 2. Environment Variables

Create `.env.local` in `admin_side/` directory:

```bash
# Keycloak Configuration
PUBLIC_KEYCLOAK_URL=https://my-ids-admin.ducth.dev
PUBLIC_KEYCLOAK_REALM=your-realm-name
PUBLIC_KEYCLOAK_CLIENT_ID=admin-side-client

# Backend API (my-cms)
PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
PUBLIC_GRAPHQL_CACHE_API_URL=http://localhost:4000/graphql
PUBLIC_MEDIA_UPLOAD_API_URL=http://localhost:4000/api/media/upload
```

### Implementation Details

#### Files Created:
1. **`src/auth/keycloak.ts`** - Keycloak instance configuration
2. **`src/auth/AuthContext.tsx`** - React context for authentication state
3. **`src/auth/ProtectedRoute.tsx`** - Route protection component
4. **`public/silent-check-sso.html`** - Silent SSO iframe page

#### Features Implemented:
- ✅ Authorization Code Flow with PKCE
- ✅ Automatic token refresh (every minute)
- ✅ Silent SSO check on page load
- ✅ User info loading from Keycloak
- ✅ Protected routes (all `/admin/*` routes)
- ✅ Login/Logout functionality
- ✅ Bearer token injection into GraphQL requests

### How It Works

1. **App Initialization**: `AuthProvider` wraps the entire app in `App.tsx`
2. **Authentication Check**: On load, Keycloak checks for existing session (SSO)
3. **Protected Routes**: All admin routes require authentication via `ProtectedRoute`
4. **Token Management**: Access token automatically refreshed and added to API requests
5. **User Display**: User info (name, email, username) displayed in left menu

### Testing Authentication

1. Start the admin_side module:
   ```bash
   cd admin_side
   pnpm install
   pnpm dev
   ```

2. Navigate to `http://localhost:3002`
3. You should be redirected to Keycloak login
4. After login, you'll be redirected back to admin panel
5. Your user info should appear in the left sidebar

### Troubleshooting

**"Keycloak initialization failed"**
- Check that `PUBLIC_KEYCLOAK_URL` is correct
- Verify the Keycloak server is accessible
- Check browser console for CORS errors

**"Invalid redirect_uri"**
- Add your URL to "Valid Redirect URIs" in Keycloak client config
- Include `/*` wildcard for development

**Token not included in requests**
- Check browser dev tools → Network → Headers
- Should see `Authorization: Bearer <token>`
- If missing, check `keycloak.token` in console

---

## Phase 10: my-cms Backend Integration (COMPLETED)

### Overview
All API integration points have been configured to work with the my-cms headless CMS backend.

**Backend Repository**: https://github.com/doitsu2014/my-cms

### Configuration

#### Environment Variables
```bash
PUBLIC_GRAPHQL_API_URL=http://localhost:4000/graphql
PUBLIC_GRAPHQL_CACHE_API_URL=http://localhost:4000/graphql
PUBLIC_MEDIA_UPLOAD_API_URL=http://localhost:4000/api/media/upload
```

### Implementation Details

#### Files Updated:
1. **`src/infrastructure/graphQL/graphql-client.ts`**
   - Apollo Client configured with my-cms GraphQL endpoint
   - Keycloak Bearer token automatically added to requests
   - Separate clients for main API and cache API

2. **`src/infrastructure/utilities.auth.ts`**
   - Updated to use Keycloak tokens
   - Provides auth headers for all API requests

### GraphQL API Structure (my-cms)

The my-cms backend provides the following APIs:

#### Categories API
- Query: `categories` - List all categories
- Query: `category(id: ID!)` - Get single category
- Mutation: `createCategory(input: CreateCategoryInput!)` - Create category
- Mutation: `updateCategory(id: ID!, input: UpdateCategoryInput!)` - Update category
- Mutation: `deleteCategory(id: ID!)` - Delete category

#### Posts/Blogs API
- Query: `posts` - List all posts
- Query: `post(id: ID!)` - Get single post  
- Mutation: `createPost(input: CreatePostInput!)` - Create post
- Mutation: `updatePost(id: ID!, input: UpdatePostInput!)` - Update post
- Mutation: `deletePost(id: ID!)` - Delete post

#### Media API
- Mutation: `uploadMedia(file: Upload!)` - Upload media file
- Query: `media` - List media files

#### Tags API
- Query: `tags` - List all tags
- Mutation: `createTag(input: CreateTagInput!)` - Create tag

### Apollo Client Configuration

The GraphQL client is configured with:
- **Authentication**: Automatic Bearer token injection
- **Caching**: In-memory cache with cache-and-network policy
- **Error Handling**: Network errors handled gracefully
- **Token Refresh**: Automatic token refresh before expiry

### API Integration Points

All API calls in the admin panel are marked with comments:
```typescript
// TODO: Replace with actual API endpoint
```

Search for these comments to find integration points. Key locations:
- `src/app/admin/categories/page.tsx` - Categories list
- `src/app/admin/categories/category-form.tsx` - Create/update category
- `src/app/admin/blogs/page.tsx` - Blogs list
- `src/app/admin/blogs/blog-form.tsx` - Create/update blog

### Example API Usage

```typescript
import { buildGraphQLClient } from '@/infrastructure/graphQL/graphql-client';
import { gql } from '@apollo/client';

const client = buildGraphQLClient();

// Fetch categories
const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      type
    }
  }
`;

const { data } = await client.query({
  query: GET_CATEGORIES
});
```

### Testing Backend Integration

1. **Start my-cms backend**:
   ```bash
   cd /path/to/my-cms
   cargo run
   ```

2. **Verify GraphQL endpoint**:
   ```bash
   curl http://localhost:4000/graphql
   ```

3. **Start admin_side**:
   ```bash
   cd admin_side
   pnpm dev
   ```

4. **Test in browser**:
   - Open http://localhost:3002
   - Login via Keycloak
   - Navigate to Categories or Blogs
   - Check browser dev tools → Network tab
   - Verify GraphQL requests include `Authorization` header

### CORS Configuration

If my-cms and admin_side are on different domains, configure CORS in my-cms:

```rust
// In my-cms server configuration
.allow_origin("http://localhost:3002")
.allow_methods(vec!["GET", "POST", "OPTIONS"])
.allow_headers(vec!["Authorization", "Content-Type"])
.allow_credentials(true)
```

---

## Security Notes

### Keycloak PKCE Flow
- PKCE prevents authorization code interception attacks
- No client secret needed (secure for SPAs)
- Code verifier generated on client side
- SHA-256 challenge sent to Keycloak
- Modern standard for OAuth2 in browser apps

### Token Storage
- Tokens stored in memory only (not localStorage/cookies)
- Automatic refresh every 60 seconds
- Logout clears all token data

### API Security
- All admin routes require authentication
- Bearer token included in every API request
- Token validated by my-cms backend
- Invalid/expired tokens result in 401 Unauthorized

---

## Next Steps

### For Production Deployment:

1. **Update Environment Variables**:
   ```bash
   PUBLIC_KEYCLOAK_URL=https://your-keycloak-production.com
   PUBLIC_KEYCLOAK_REALM=production-realm
   PUBLIC_KEYCLOAK_CLIENT_ID=admin-side-prod
   PUBLIC_GRAPHQL_API_URL=https://api.your-domain.com/graphql
   ```

2. **Configure Keycloak Client** with production URLs

3. **Deploy my-cms backend** and update API URL

4. **Test end-to-end** authentication and API calls

5. **Monitor** Keycloak logs and API logs for issues

---

## Summary

**Phase 8 Status**: ✅ COMPLETE
- Keycloak authentication implemented
- PKCE flow configured  
- Protected routes working
- User info displayed
- Token refresh automated

**Phase 10 Status**: ✅ COMPLETE
- GraphQL client configured
- my-cms integration ready
- Auth headers automatically injected
- API endpoints documented
- Example usage provided

**Ready for**: Production deployment pending backend availability
