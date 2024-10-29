import {defineField} from 'sanity';

export const faqSectionSchema = defineField({
  name: 'faqSection',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
  ],
});
