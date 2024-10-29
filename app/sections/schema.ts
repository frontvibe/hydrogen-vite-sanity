import {defineField} from 'sanity';
import {heroSectionSchema} from './hero/_schema';

const globalSections = [heroSectionSchema].map((section) => ({
  type: section.name,
}));

export const sectionsList = [heroSectionSchema];

export const sectionsPicker = defineField({
  name: 'sections',
  type: 'array',
  of: globalSections,
});
