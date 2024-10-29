import {defineQuery} from 'groq';
import {SECTION_LIST_FRAGMENT} from '~/sections';

export const PAGE_QUERY = defineQuery(`*[_type == "page"][0] {
  title,
  description,
  sections[] ${SECTION_LIST_FRAGMENT}
}`);

/**
 * Used by Typegen to generate the SECTIONS_QUERYResult type
 */
export const SECTIONS_QUERY = defineQuery(`*[][0] {
  sections[] ${SECTION_LIST_FRAGMENT}
}`);
