import { gql } from '@apollo/client';

export default function buildGetCategoriesQuery() {
  return gql`
    query GetCategories {
      categories {
        nodes {
          id
          displayName
          slug
          categoryType
          createdBy
          createdAt
          rowVersion
          categoryTags {
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
}

export function buildGetCategoriesWithTranslationsQuery() {
  return gql`
    query GetCategories {
      categories {
        nodes {
          id
          displayName
          slug
          categoryType
          createdBy
          createdAt
          rowVersion
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
            }
          }
        }
      }
    }
  `;
}
