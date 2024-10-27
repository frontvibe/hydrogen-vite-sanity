import {useLoaderData} from '@remix-run/react';
import {VisualEditing} from '@sanity/visual-editing/remix';
import {json} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {PAGE_QUERYResult} from 'types/sanity/sanity.generated';
import {PAGE_QUERY} from '~/data/sanity/queries';

import {useRootLoaderData} from '~/root';

export async function loader({context}: LoaderFunctionArgs) {
  const sanity = context.sanity;
  const page = await sanity.loadQuery<PAGE_QUERYResult>(PAGE_QUERY);
  return json({page});
}

export default function Index() {
  const {page} = useLoaderData<typeof loader>();
  const rootData = useRootLoaderData();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>{page?.data?.title}</div>
      {rootData.isPreviewMode ? <VisualEditing /> : null}
    </div>
  );
}
