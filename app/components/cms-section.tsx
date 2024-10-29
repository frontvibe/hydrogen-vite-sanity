import type {SectionDataType} from 'types/sanity/utils';

import {useMemo} from 'react';
import {sections} from '~/sections';

export function CmsSection({data}: {data: SectionDataType}) {
  const type = data._type;
  const Section = useMemo(() => sections[type], [type]);

  if (!Section) {
    return null;
  }

  return (
    <section>
      <Section {...data} />
    </section>
  );
}
