import groq from 'groq';
import {SECTION_LIST_FRAGMENT} from './fragments';

export const PAGE_QUERY = groq`*[_type == "page"][0] {
  title,
  description,
  sections[] ${SECTION_LIST_FRAGMENT}
}`;
