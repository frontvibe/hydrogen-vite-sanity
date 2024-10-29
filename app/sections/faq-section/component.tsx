import type {SectionOfType} from 'types/sanity/utils';

export function FaqSection(props: SectionOfType<'faqSection'>) {
  return <div>{props.title}</div>;
}
