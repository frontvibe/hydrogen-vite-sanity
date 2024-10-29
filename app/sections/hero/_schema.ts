import {defineField} from 'sanity';

export const heroSectionSchema = defineField({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
  ],
});
