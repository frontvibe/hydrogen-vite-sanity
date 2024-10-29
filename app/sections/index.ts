import {defineQuery} from 'groq';
import {HERO_SECTION_FRAGMENT} from './hero-section/groq';
import {HeroSection} from './hero-section/component';
import {FAQ_SECTION_FRAGMENT} from './faq-section/groq';
import {FaqSection} from './faq-section/component';

export const SECTION_LIST_FRAGMENT = defineQuery(`{
  _key,
  _type,
  _type == 'heroSection' => ${HERO_SECTION_FRAGMENT},
  _type == 'faqSection' => ${FAQ_SECTION_FRAGMENT}
}`);

export const sections: {
  [key: string]: React.FC<any>;
} = {
  heroSection: HeroSection,
  faqSection: FaqSection,
};
