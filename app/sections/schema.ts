import type {InsertMenuOptions} from 'sanity';
import {defineField} from 'sanity';
import {heroSectionSchema} from './hero-section/schema';
import {faqSectionSchema} from './faq-section/schema';

const sectionOptionInsertMenu: {insertMenu: InsertMenuOptions} = {
  insertMenu: {
    views: [
      {
        name: 'grid',
        previewImageUrl: (schemaTypeName) =>
          `/sections/assets/${schemaTypeName}.jpg`,
      },
    ],
  },
};

const globalSections = [heroSectionSchema, faqSectionSchema].map((section) => ({
  type: section.name,
}));

export const sectionsPicker = defineField({
  name: 'sections',
  type: 'array',
  of: globalSections,
  options: {...sectionOptionInsertMenu},
});

export const sectionsList = [heroSectionSchema, faqSectionSchema];
