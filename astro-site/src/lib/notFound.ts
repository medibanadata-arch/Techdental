import notFoundHtml from '../assets/404.html?raw';

/** Laravel's default 404 page, served for any unmatched GET route. */
export function notFoundResponse(): Response {
  return new Response(notFoundHtml, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
