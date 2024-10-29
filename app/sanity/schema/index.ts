import type {SchemaPluginOptions} from 'sanity';
import page from './page';
import {sectionsList, sectionsPicker} from '~/sections/schema';

const objects = [sectionsPicker];

export const schema: SchemaPluginOptions = {
  types: [page, ...sectionsList, ...objects],
};
