# Testing & Deployment Guide

## 🧪 Manual Testing Checklist

### Prerequisites
- Node.js v20+ installed
- pnpm installed
- All dependencies installed in admin_side

### Local Development Testing

#### 1. Start Admin Side (Standalone)
```bash
cd admin_side
pnpm install
pnpm dev
```
Access at: http://localhost:3002

**Test Cases:**
- [ ] Navigate to dashboard
- [ ] Check theme toggle (light/dark)
- [ ] Test left menu navigation
- [ ] Test breadcrumb navigation

#### 2. Test Categories Management
**List Page** (http://localhost:3002/admin/categories)
- [ ] View categories list (will be empty without API)
- [ ] Test filter by name
- [ ] Test filter by type
- [ ] Test sorting (name, slug, type)
- [ ] Click "Create Category" button

**Create Category** (http://localhost:3002/admin/categories/create)
- [ ] Enter display name
- [ ] Select category type (Blog/Other)
- [ ] Add tags using chip input
- [ ] Add translation tab
- [ ] Select language and enter translated name
- [ ] Click "Create" (will fail without API - expected)

**Edit Category** (http://localhost:3002/admin/categories/edit/test-id)
- [ ] Form loads (will not load data without API)
- [ ] Can modify fields
- [ ] Click "Update" (will fail without API - expected)

#### 3. Test Blogs Management
**List Page** (http://localhost:3002/admin/blogs)
- [ ] View blogs list (will be empty without API)
- [ ] Test search by ID
- [ ] Test search by title
- [ ] Click "Create Blog" button

**Create Blog** (http://localhost:3002/admin/blogs/create)
- [ ] Enter title
- [ ] Select category (dropdown will be empty without API)
- [ ] Toggle published status
- [ ] Add thumbnail URLs
- [ ] Add tags using chip input
- [ ] Enter preview content
- [ ] Enter full content in editor
- [ ] Click "Create Post" (will fail without API - expected)

**Edit Blog** (http://localhost:3002/admin/blogs/edit/test-id)
- [ ] Form loads (will not load data without API)
- [ ] Can modify all fields
- [ ] Click "Update Post" (will fail without API - expected)

### Module Federation Testing

#### 1. Start Both Modules
```bash
# Terminal 1: admin_side
cd admin_side && pnpm dev

# Terminal 2: shell
cd shell && pnpm dev
```

#### 2. Access via Shell
Access at: http://localhost:3000/admin

**Test Cases:**
- [ ] Admin app loads from shell
- [ ] Navigation works
- [ ] Styles are applied correctly
- [ ] No console errors
- [ ] Module Federation manifest loads
- [ ] Shared dependencies work (React, React-DOM, React-Router)

### Build Testing

#### 1. Build Admin Side
```bash
cd admin_side
pnpm build
```

**Verify:**
- [ ] Build completes without errors
- [ ] `dist` folder created
- [ ] `mf-manifest.json` generated
- [ ] Assets properly hashed
- [ ] No TypeScript errors

#### 2. Preview Build
```bash
cd admin_side
pnpm preview
```
Access at: http://localhost:4173 (or configured port)

**Test Cases:**
- [ ] Production build runs
- [ ] All routes work
- [ ] Assets load correctly
- [ ] Module Federation works in production mode

---

## 🚀 Deployment Guide

### Environment Variables

Create `.env` file in admin_side:
```env
# GraphQL API Endpoint
PUBLIC_GRAPHQL_API=https://your-api.com/graphql

# GraphQL Cache Endpoint
PUBLIC_GRAPHQL_CACHE_API=https://your-cache-api.com/graphql

# Media Upload Endpoint
PUBLIC_MEDIA_UPLOAD_API=https://your-media-api.com/upload
```

### Build for Production

```bash
cd admin_side
pnpm build
```

Output: `admin_side/dist/`

### Deploy to Static Hosting

#### Vercel
```bash
cd admin_side
vercel --prod
```

Configure in `vercel.json`:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "devCommand": "pnpm dev"
}
```

#### Netlify
```bash
cd admin_side
netlify deploy --prod --dir=dist
```

Configure in `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### AWS S3 + CloudFront
```bash
cd admin_side
pnpm build
aws s3 sync dist/ s3://your-bucket-name/
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Module Federation Deployment

#### 1. Deploy admin_side
- Build and deploy admin_side to your hosting
- Note the URL (e.g., https://admin.example.com)

#### 2. Update Shell Configuration
In `shell/rsbuild.config.ts`:
```typescript
const general_remotes = {
  admin_side: 'admin_side@https://admin.example.com/mf-manifest.json',
}
```

#### 3. Deploy Shell
- Build and deploy shell with updated remote URL
- Test the integration

### CORS Configuration

If admin_side and shell are on different domains, configure CORS:

**Nginx Example:**
```nginx
location / {
  add_header Access-Control-Allow-Origin "*";
  add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
  add_header Access-Control-Allow-Headers "Content-Type";
}
```

**CloudFront Example:**
```json
{
  "ResponseHeadersPolicyId": "...",
  "ResponseHeadersPolicy": {
    "CorsConfig": {
      "AccessControlAllowOrigins": {
        "Items": ["*"]
      },
      "AccessControlAllowMethods": {
        "Items": ["GET", "HEAD", "OPTIONS"]
      }
    }
  }
}
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Module Federation Not Loading
**Symptom:** Shell shows "Loading..." but admin doesn't load

**Solutions:**
- Check admin_side is running on port 3002
- Verify mf-manifest.json is accessible
- Check browser console for network errors
- Verify shared dependencies versions match

#### 2. Styles Not Applied
**Symptom:** Admin looks unstyled

**Solutions:**
- Check Tailwind CSS is imported in App.css
- Verify postcss.config.mjs exists
- Run `pnpm build` to ensure Tailwind processes
- Check for CSS conflicts

#### 3. Routes Not Working
**Symptom:** Direct navigation to routes fails

**Solutions:**
- Ensure React Router is configured
- Check App.tsx has all routes defined
- Verify BrowserRouter wraps routes
- For production, configure server for SPA

#### 4. TypeScript Errors
**Symptom:** Build fails with TypeScript errors

**Solutions:**
- Run `pnpm tsc --noEmit` to check types
- Verify path aliases in tsconfig.json
- Check all imports use `@/` prefix
- Ensure types are installed

#### 5. Dependencies Not Found
**Symptom:** Import errors during development

**Solutions:**
- Run `pnpm install` in admin_side
- Clear node_modules and reinstall
- Check package.json has all dependencies
- Verify pnpm-lock.yaml is up to date

---

## 📊 Performance Monitoring

### Metrics to Track

1. **Build Time**
   - Target: < 30 seconds
   - Monitor: `pnpm build`

2. **Bundle Size**
   - Target: < 500KB (gzipped)
   - Check: `dist/` folder size

3. **Module Federation Load Time**
   - Target: < 2 seconds
   - Monitor: Network tab for mf-manifest.json

4. **Time to Interactive**
   - Target: < 3 seconds
   - Use: Lighthouse in Chrome DevTools

### Optimization Tips

1. **Code Splitting**
   - Already implemented with React.lazy for rich text editor
   - Consider lazy loading more components

2. **Tree Shaking**
   - Already configured in Rsbuild
   - Verify with bundle analysis

3. **Caching**
   - Configure proper cache headers
   - Use content hashing (already enabled)

4. **CDN**
   - Serve static assets from CDN
   - Consider Module Federation remote from CDN

---

## 🛡️ Security Checklist

- [ ] All dependencies scanned (already done via GitHub Advisory)
- [ ] No hardcoded secrets in code
- [ ] Environment variables used for sensitive data
- [ ] CORS properly configured
- [ ] CSP headers configured
- [ ] HTTPS enforced in production
- [ ] Authentication implemented (TODO)
- [ ] Input sanitization (forms validate)
- [ ] XSS protection (React default)
- [ ] CSRF protection (TODO with auth)

---

## 📝 Post-Deployment Checklist

- [ ] admin_side accessible at configured URL
- [ ] Shell can load admin_side via Module Federation
- [ ] All routes work correctly
- [ ] Styles render properly
- [ ] Theme toggle works
- [ ] Forms are functional
- [ ] Navigation works
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Monitoring/logging in place
- [ ] Backup/rollback plan ready

---

## 🎯 Next Steps After Deployment

1. **API Integration**
   - Connect to backend GraphQL API
   - Test all CRUD operations
   - Handle errors gracefully

2. **Authentication**
   - Implement auth system
   - Add protected routes
   - Test login/logout flow

3. **Testing**
   - Add unit tests
   - Add integration tests
   - Set up CI/CD pipeline

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Add analytics (Google Analytics)
   - Monitor performance (Web Vitals)

5. **Enhancements**
   - Upgrade rich text editor to full Quill
   - Add more admin features
   - Improve UX based on feedback
