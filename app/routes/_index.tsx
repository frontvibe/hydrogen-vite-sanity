import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {PAGE_QUERYResult} from 'types/sanity/sanity.generated';
import {CmsSection} from '~/components/cms-section';

import {PAGE_QUERY} from '~/data/sanity/queries';

export async function loader({context}: LoaderFunctionArgs) {
  const sanity = context.sanity;
  const page = await sanity.loadQuery<PAGE_QUERYResult>(PAGE_QUERY);
  return json({page});
}

export default function Index() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-10">
        <div>{page?.data?.title}</div>
        {page?.data?.sections?.map((section) => (
          <CmsSection key={section._key} data={section} />
        ))}
      </div>
    </div>
  );
}
