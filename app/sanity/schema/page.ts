import type {InsertMenuOptions} from 'sanity';
import {defineField, defineType} from 'sanity';

const sectionOptionInsertMenu: {insertMenu: InsertMenuOptions} = {
  insertMenu: {
    views: [
      {
        name: 'grid',
        previewImageUrl: (schemaTypeName) =>
          `/static/assets/${schemaTypeName}.jpg`,
      },
    ],
  },
};

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'sections',
      type: 'sections',
    }),
  ],
});
