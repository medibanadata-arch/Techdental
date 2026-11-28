import { pagePayload } from './shared';
import { encodeLocation, lookupEntity, renderMappedEntity, type LegacyRender } from './legacy';

export interface LegacyRenderResult {
  component: string;
  page: any;
  seo: any;
  lang: string;
}

/** Turn a legacy render descriptor into mountable props or a redirect response. */
export function materializeLegacy(result: LegacyRender): LegacyRenderResult | Response | null {
  if (!result) return null;
  if (result.kind === 'redirect') {
    return new Response(null, {
      status: result.status || 301,
      headers: { Location: encodeLocation(result.location) },
    });
  }
  return {
    component: result.component,
    page: pagePayload(result.component, result.props, result.url, result.lang),
    seo: result.seo,
    lang: result.lang,
  };
}

/**
 * Canonical path a rendered page advertises (works for both absolute URLs and
 * bare paths). Returns '' when the page does not declare one.
 */
export function canonicalPathOf(seo: any): string {
  const raw = String(seo?.canonical || seo?.path || '').trim();
  if (!raw) return '';
  try {
    return new URL(raw, 'https://techdentalcare.com').pathname.replace(/\/+$/, '') || '/';
  } catch {
    return '';
  }
}

/** True when a legacy URL would render a page that claims a different canonical. */
export function canonicalMismatch(seo: any, pathname: string): boolean {
  const canonical = canonicalPathOf(seo);
  if (!canonical) return false;
  const request = String(pathname || '').replace(/\/+$/, '') || '/';
  return canonical !== request;
}

/**
 * Fallback used by entity routes whose current slug no longer resolves: serve
 * the mapped current page (or redirect) that the old URL belongs to.
 */
export function resolveLegacyEntity(pathname: string): LegacyRenderResult | Response | null {
  const entity = lookupEntity(pathname);
  if (!entity) return null;
  return materializeLegacy(renderMappedEntity(pathname, entity));
}
