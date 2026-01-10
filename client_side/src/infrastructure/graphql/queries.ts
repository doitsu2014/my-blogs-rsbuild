import { gql } from '@apollo/client';

/**
 * Query to get all categories with translations
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      nodes {
        id
        displayName
        slug
        categoryType
        createdAt
        translations {
          nodes {
            id
            languageCode
            displayName
          }
        }
        tags {
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
 * Query to get blog posts with translations
 */
export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($limit: Int, $offset: Int) {
    blogs(first: $limit, offset: $offset, orderBy: CREATED_AT_DESC) {
      nodes {
        id
        title
        slug
        contentMarkdown
        createdAt
        updatedAt
        isPublished
        thumbnailUrl
        translations {
          nodes {
            id
            languageCode
            title
            contentMarkdown
          }
        }
        category {
          id
          displayName
          slug
        }
        tags {
          nodes {
            tags {
              id
              name
              slug
            }
          }
        }
      }
      totalCount
    }
  }
`;

/**
 * Query to get a single blog post by slug
 */
export const GET_BLOG_POST_BY_SLUG = gql`
  query GetBlogPostBySlug($slug: String!) {
    blogBySlug(slug: $slug) {
      id
      title
      slug
      contentMarkdown
      createdAt
      updatedAt
      isPublished
      thumbnailUrl
      translations {
        nodes {
          id
          languageCode
          title
          contentMarkdown
        }
      }
      category {
        id
        displayName
        slug
      }
      tags {
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
`;
