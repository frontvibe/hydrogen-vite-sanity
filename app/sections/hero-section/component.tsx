import type {SectionOfType} from 'types/sanity/utils';

export function HeroSection(props: SectionOfType<'heroSection'>) {
  return <div>{props.title}</div>;
}
