import {createHydrogenContext, createWithCache} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';

import {createSanityContext} from './sanity.loader';
import {CART_QUERY_FRAGMENT} from '~/data/shopify/fragments';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {language: 'EN', country: 'US'},
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  const withCache = createWithCache({cache, waitUntil, request});
  const sanity = createSanityContext({
    withCache,
    client: {
      projectId: env.PUBLIC_SANITY_PROJECT_ID,
      dataset: env.PUBLIC_SANITY_DATASET || 'production',
      apiVersion: 'v2022-03-07',
      useCdn: process.env.NODE_ENV === 'production',
    },
    preview: env.SANITY_PREVIEW_TOKEN
      ? {
          enabled: session.get('projectId') === env.PUBLIC_SANITY_PROJECT_ID,
          token: env.SANITY_PREVIEW_TOKEN,
          studioUrl: '/studio',
        }
      : undefined,
  });

  return {
    ...hydrogenContext,
    // declare additional Remix loader context
    sanity,
  };
}
