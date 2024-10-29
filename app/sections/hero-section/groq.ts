import {defineQuery} from 'groq';
export const HERO_SECTION_FRAGMENT = defineQuery(`{
  title,
  description
}`);
