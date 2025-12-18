import { CategoryModel } from '@/domains/category';
import { PostInFooterModel, PostModel } from '@/domains/post';

export const mapGraphQlModelToCategoryModel = (
  graphqlNode: any | undefined
): CategoryModel | undefined => {
  return !!graphqlNode
    ? {
        ...graphqlNode,
        categoryTranslations: graphqlNode.categoryTranslations?.nodes.map((node: any) => ({
          id: node.id,
          languageCode: node.languageCode,
          displayName: node.displayName,
          slug: node.slug
        })),
        categoryTags: graphqlNode.categoryTags?.nodes.map((node: any) => ({
          id: node.tags.id,
          name: node.tags.name,
          slug: node.tags.slug
        }))
      }
    : undefined;
};

export const mapGraphQlModelToPostModel = (graphqlNode: any | undefined): PostModel | undefined => {
  return !!graphqlNode
    ? {
        ...graphqlNode,
        categoryDisplayName: graphqlNode.categories?.displayName,
        categorySlug: graphqlNode.categories?.slug,
        postTranslations: graphqlNode.postTranslations?.nodes.map((node: any) => ({
          id: node.id,
          languageCode: node.languageCode,
          title: node.title,
          previewContent: node.previewContent,
          content: node.content,
          slug: node.slug
        })),
        postTags: graphqlNode.postTags?.nodes.map((node: any) => ({
          id: node.tags.id,
          name: node.tags.name,
          slug: node.tags.slug
        }))
      }
    : undefined;
};

export const mapGraphQlModelToPostInFooterModel = (
  graphqlNode: any | undefined
): PostInFooterModel | undefined => {
  return !!graphqlNode
    ? {
        ...graphqlNode,
        category: mapGraphQlModelToCategoryModel(graphqlNode.categories),
        postTranslations: graphqlNode.postTranslations?.nodes.map((node: any) => ({
          id: node.id,
          languageCode: node.languageCode,
          title: node.title,
          previewContent: node.previewContent,
          content: node.content,
          slug: node.slug
        }))
      }
    : undefined;
};
