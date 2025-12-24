import { TagModel } from './tag';

export enum CategoryTypeEnum {
  Blog = 'Blog',
  Other = 'Other'
}

export interface CategoryModel {
  id: string;
  parentId: string | undefined;
  displayName: string;
  slug: string;
  categoryType: CategoryTypeEnum;
  createdBy: string;
  createdAt: string;
  categoryTags: TagModel[];
  rowVersion: number;
  categoryTranslations: CategoryTranslationModel[];
}

export interface CategoryTranslationModel {
  id: string;
  languageCode: string;
  displayName: string;
  slug: string;
}
