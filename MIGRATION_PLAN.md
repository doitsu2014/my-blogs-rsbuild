# Admin Features Migration Plan

## Overview
This document outlines the plan to copy admin features from the old Next.js platform ([doitsu2014/my-blogs](https://github.com/doitsu2014/my-blogs)) to the new micro-frontend architecture project in the `admin_side` module.

## Source Repository Analysis

### Old Platform (Next.js + Next-auth)
- **Framework**: Next.js 15
- **Authentication**: next-auth v5.0.0-beta.25
- **UI Framework**: DaisyUI v5 + Tailwind CSS
- **Data Layer**: Apollo Client + GraphQL
- **Editor**: Quill with multiple plugins
- **Icons**: lucide-react

### Admin Features in Old Platform
1. **Categories Management**
   - List categories with pagination
   - Create new categories
   - Edit existing categories
   - Delete categories
   - Slug generation

2. **Blogs Management**
   - List blogs with pagination
   - Create new blog posts
   - Edit existing blog posts
   - Rich text editing with Quill
   - Image upload and management
   - Tags management
   - Category assignment
   - Publish/Draft status

3. **Admin Dashboard**
   - Overview statistics
   - Quick access to management features

4. **Authentication & Authorization**
   - Login/Logout functionality
   - Session management
   - Protected admin routes

### Target Architecture (Micro-frontend)
- **Framework**: React 19 + Rsbuild
- **Architecture**: Module Federation 2.0
- **Module**: admin_side (Remote Module)
- **Integration**: Loaded by shell app

## Directory Structure Mapping

### From Old Repository → New admin_side

```
OLD: src/domains/                    → NEW: admin_side/src/domains/
OLD: src/infrastructure/             → NEW: admin_side/src/infrastructure/
OLD: src/app/admin/                  → NEW: admin_side/src/app/admin/
OLD: src/auth.ts                     → NEW: admin_side/src/auth.ts
OLD: src/middleware.ts               → NEW: admin_side/src/middleware.ts
OLD: src/app/globals.css             → NEW: admin_side/src/app/globals.css
```

## Detailed File Inventory

### Phase 1: Domain Models
- `src/domains/category.ts` - Category type definitions
- `src/domains/post.ts` - Post/Blog type definitions
- `src/domains/tag.ts` - Tag type definitions

### Phase 2: Infrastructure Layer
**GraphQL:**
- `src/infrastructure/graphQL/` - GraphQL client and queries

**Data Access:**
- `src/infrastructure/das/` - Data access services for categories, posts, tags

**Utilities:**
- `src/infrastructure/utilities.auth.ts` - Authentication helpers
- `src/infrastructure/utilities.ts` - General utility functions

### Phase 3: Admin Layout Components
- `src/app/admin/layout.tsx` - Main admin layout
- `src/app/admin/layoutContext.tsx` - Layout context provider
- `src/app/admin/layoutMain.tsx` - Main content wrapper
- `src/app/admin/page.tsx` - Admin dashboard

### Phase 4: Admin UI Components
**Navigation:**
- `src/app/admin/components/left-menu.tsx` - Sidebar navigation
- `src/app/admin/components/menu-item.tsx` - Menu item component
- `src/app/admin/components/top-bar.tsx` - Top navigation bar
- `src/app/admin/components/my-breadcrumbs.tsx` - Breadcrumb navigation

**Form Inputs:**
- `src/app/admin/components/inputs/` - Reusable form input components

**Loading States:**
- `src/app/admin/components/skeleton/` - Skeleton loading components

### Phase 5: Categories Management
- `src/app/admin/categories/page.tsx` - Categories list
- `src/app/admin/categories/category-form.tsx` - Category form component
- `src/app/admin/categories/create/page.tsx` - Create category page
- `src/app/admin/categories/edit/[id]/page.tsx` - Edit category page

### Phase 6: Blogs Management
- `src/app/admin/blogs/page.tsx` - Blogs list
- `src/app/admin/blogs/blog-form.tsx` - Blog form with Quill editor
- `src/app/admin/blogs/create/page.tsx` - Create blog page
- `src/app/admin/blogs/edit/[id]/page.tsx` - Edit blog page

### Phase 7: Authentication
- `src/auth.ts` - NextAuth configuration
- `src/middleware.ts` - Authentication middleware

## Dependencies to Add

### Core Dependencies
```json
{
  "@apollo/client": "^3.12.6",
  "graphql": "^16.10.0",
  "graphql-tag": "^2.12.6",
  "next-auth": "5.0.0-beta.25",
  "lucide-react": "^0.476.0"
}
```

### Editor & Utilities
```json
{
  "quill": "^2.0.3",
  "quill-html-edit-button": "^3.0.0",
  "quill-resize-image": "^1.0.5",
  "quill-table-better": "^1.1.6",
  "quill-toggle-fullscreen-button": "^0.1.3",
  "highlight.js": "^11.11.1",
  "slugify": "^1.6.6"
}
```

### UI & Styling
```json
{
  "daisyui": "^5.0.0",
  "@tailwindcss/typography": "^0.5.16",
  "tailwindcss": "^4.0.12"
}
```

### Types
```json
{
  "@types/jsonwebtoken": "^9.0.7"
}
```

## Configuration Files

### Tailwind Configuration
Copy and adapt `tailwind.config.ts` to include:
- DaisyUI plugin
- Typography plugin
- Custom theme settings

### PostCSS Configuration
Copy `postcss.config.mjs` for Tailwind processing

### TypeScript Configuration
Update `tsconfig.json` with paths for:
- Domain models
- Infrastructure utilities
- Component aliases

## Module Federation Considerations

### admin_side Configuration
The admin_side module should expose:
```typescript
exposes: {
  './AdminApp': './src/App.tsx',
  './AdminDashboard': './src/app/admin/page.tsx',
  './CategoriesManagement': './src/app/admin/categories/page.tsx',
  './BlogsManagement': './src/app/admin/blogs/page.tsx'
}
```

### Shared Dependencies
Ensure these are shared between shell and admin_side:
- react (singleton)
- react-dom (singleton)
- @apollo/client
- next-auth (if used in shell)

### Port Allocation
- shell: 3000
- client_side: 3001
- admin_side: 3002

## Migration Strategy

### Approach: Incremental Migration
1. **Start with foundation** - Domain models and infrastructure
2. **Build layout** - Admin layout and navigation
3. **Add features one by one** - Categories first, then blogs
4. **Test continuously** - Verify each phase before moving forward

### Adaptation Requirements

**From Next.js to React + Rsbuild:**
1. Remove Next.js specific APIs:
   - Replace `useRouter` from next/navigation with react-router-dom
   - Replace `Link` from next/link with react-router-dom Link
   - Convert server components to client components
   - Adapt API routes to separate backend or use existing GraphQL

2. Styling adjustments:
   - Ensure Tailwind is properly configured in Rsbuild
   - Verify DaisyUI compatibility

3. Authentication:
   - Adapt next-auth for non-Next.js environment
   - Consider alternative auth solutions if needed

## Environment Variables

Required environment variables for admin_side:
```env
# GraphQL API
GRAPHQL_API_URL=http://localhost:4000/graphql

# Authentication
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key

# Upload/Storage
UPLOAD_URL=http://localhost:4000/upload
```

## Testing Strategy

### Unit Testing
- Test domain models
- Test utility functions
- Test form validation logic

### Integration Testing
- Test CRUD operations
- Test authentication flow
- Test Module Federation integration

### Manual Testing
1. Start all modules (shell, client_side, admin_side)
2. Verify admin features load in shell app
3. Test full CRUD workflows
4. Verify authentication
5. Check responsive design

## Rollback Plan

If migration encounters critical issues:
1. Branch is already isolated
2. Can revert individual commits
3. Old platform remains operational
4. Can cherry-pick successful components

## Success Criteria

- [ ] All admin features functional in admin_side module
- [ ] Categories CRUD working
- [ ] Blogs CRUD working with rich text editor
- [ ] Authentication protecting admin routes
- [ ] Module Federation integration successful
- [ ] No console errors in development
- [ ] Successful production build
- [ ] Documentation complete

## Timeline Estimate

- **Phase 1-2** (Foundation): 2-3 hours
- **Phase 3-4** (Layout & Components): 3-4 hours
- **Phase 5** (Categories): 2-3 hours
- **Phase 6** (Blogs): 4-5 hours
- **Phase 7-9** (Auth & Config): 2-3 hours
- **Phase 10-12** (Integration & Testing): 3-4 hours
- **Phase 13-14** (Documentation): 1-2 hours

**Total Estimated Time**: 17-24 hours

## Risks & Mitigations

### Risk 1: Next.js Dependencies
- **Mitigation**: Replace with equivalent React libraries or adapt for client-side only

### Risk 2: Authentication Complexity
- **Mitigation**: Consider alternative auth solutions compatible with micro-frontend architecture

### Risk 3: GraphQL Client Setup
- **Mitigation**: Ensure Apollo Client properly configured with Rsbuild

### Risk 4: Quill Editor Integration
- **Mitigation**: Test editor plugins early, have fallback to basic editor

### Risk 5: Module Federation Complexity
- **Mitigation**: Start simple, expose main components first, add granular exports later

## Next Steps

1. Review this plan with stakeholders
2. Set up development environment
3. Begin Phase 1: Domain Models
4. Iterate through phases with continuous testing
5. Document findings and adaptations as we progress

---

**Document Version**: 1.0  
**Created**: 2025-12-18  
**Last Updated**: 2025-12-18  
**Status**: Ready for Implementation
