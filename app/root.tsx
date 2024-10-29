import {useNonce, getShopAnalytics} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import type {SerializeFrom, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  useMatches,
  useLoaderData,
} from '@remix-run/react';
import favicon from '~/assets/favicon.svg';
import tailwindCss from '~/styles/tailwind.css?url';
import {VisualEditing} from '@sanity/visual-editing/remix';
import {useMemo} from 'react';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  return defaultShouldRevalidate;
};

export function links() {
  return [
    {rel: 'stylesheet', href: tailwindCss},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader(args: LoaderFunctionArgs) {
  const {request} = args;
  const {storefront, env, sanity} = args.context;
  const pathname = new URL(request.url).pathname;

  const isStudioRoute = pathname.startsWith('/studio');

  return defer({
    isStudioRoute,
    isPreviewMode: sanity.preview?.enabled,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  });
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const {isPreviewMode, isStudioRoute} = useLoaderData<typeof loader>();

  const AppLayout = useMemo(
    () => (
      <>
        {children}
        {isPreviewMode ? <VisualEditing /> : null}
      </>
    ),
    [isPreviewMode, children],
  );

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {isStudioRoute ? children : AppLayout}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
