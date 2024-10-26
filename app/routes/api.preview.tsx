import {validatePreviewUrl} from '@sanity/preview-url-secret';
import type {HydrogenSession} from '@shopify/hydrogen';
import {json, redirect} from '@shopify/remix-oxygen';
import type {LoaderFunctionArgs, ActionFunction} from '@shopify/remix-oxygen';

/**
 * A `POST` request to this route will exit preview mode
 */
export const action: ActionFunction = async ({context, request}) => {
  if (request.method !== 'POST') {
    return json({message: 'Method not allowed'}, 405);
  }

  try {
    const {session} = context;
    if (!assertSession(session)) {
      throw new Error('Session is not an instance of HydrogenSession');
    }

    // TODO: make this a callback? `onExitPreview`?
    await session.unset('projectId');

    // TODO: confirm that the redirect and setting cookie has to happen here?
    return redirect('/');
  } catch (error) {
    console.error(error);
    throw new Response(
      'Unable to disable preview mode. Please check your preview configuration',
      {
        status: 500,
      },
    );
  }
};

/**
 * A `GET` request to this route will enter preview mode
 */
export async function loader({context, request}: LoaderFunctionArgs) {
  try {
    const {sanity, session} = context;
    const projectId = sanity.client.config().projectId;

    if (!sanity.preview) {
      return new Response('Preview mode is not enabled in this environment.', {
        status: 403,
      });
    }

    if (!sanity.preview.token) {
      throw new Error('Enabling preview mode requires a token.');
    }

    if (!projectId) {
      throw new Error('No `projectId` found in the client config.');
    }

    if (!assertSession(session)) {
      throw new Error('Session is not an instance of HydrogenSession');
    }

    const clientWithToken = sanity.client.withConfig({
      useCdn: false,
      token: sanity.preview.token,
    });

    const {isValid, redirectTo = '/'} = await validatePreviewUrl(
      clientWithToken,
      request.url,
    );

    if (!isValid) {
      return new Response('Invalid secret', {status: 401});
    }

    // TODO: make this a callback? `onEnterPreview`?
    await session.set('projectId', projectId);

    // TODO: confirm that the redirect and setting cookie has to happen here?
    return redirect(redirectTo);
  } catch (error) {
    console.error(error);
    throw new Response(
      'Unable to enable preview mode. Please check your preview configuration',
      {
        status: 500,
      },
    );
  }
}

export default function Preview() {
  return null;
}

function assertSession(session: unknown): session is HydrogenSession {
  return (
    !!session &&
    typeof session === 'object' &&
    'get' in session &&
    typeof session.get === 'function' &&
    'set' in session &&
    typeof session.set === 'function' &&
    'unset' in session &&
    typeof session.unset === 'function' &&
    'commit' in session &&
    typeof session.commit === 'function'
  );
}
