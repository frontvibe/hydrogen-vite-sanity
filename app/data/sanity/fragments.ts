import groq from 'groq';
import {HERO_SECTION_FRAGMENT} from '~/sections/hero/_fragment';

export const SECTION_LIST_FRAGMENT = groq`{
  _key,
  _type,
  _type == 'heroSection' => ${HERO_SECTION_FRAGMENT}
}`;
