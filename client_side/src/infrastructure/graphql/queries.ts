import { gql } from '@apollo/client';

/**
 * Query to get all blog categories with translations
 */
export const GET_CATEGORIES = gql`
  query GetBlogCategories {
    categories(filters: { categoryType: { eq: Blog }, parentId: { is_null: "true" } }) {
      nodes {
        id
        displayName
        slug
        categoryType
        createdAt
        categoryTags {
          nodes {
            tags {
              id
              name
              slug
            }
          }
        }
        categoryTranslations {
          nodes {
            id
            languageCode
            displayName
            slug
          }
        }
      }
    }
  }
`;

/**
 * Query to get blog posts with pagination
 */
export const GET_BLOG_POSTS = gql`
  query GetPosts {
    posts {
      nodes {
        id
        title
        previewContent
        thumbnailPaths
        slug
        published
        createdBy
        createdAt
        lastModifiedBy
        lastModifiedAt
        categoryId
        categories {
          displayName
          slug
        }
        rowVersion
        postTags {
          nodes {
            tags {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

/**
 * Query to get a single blog post by slug
 */
export const GET_BLOG_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    posts(filters: { slug: { eq: $slug } }) {
      nodes {
        id
        title
        previewContent
        thumbnailPaths
        slug
        content
        published
        createdBy
        createdAt
        lastModifiedBy
        lastModifiedAt
        categoryId
        categories {
          displayName
          slug
        }
        rowVersion
        postTags {
          nodes {
            tags {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;
