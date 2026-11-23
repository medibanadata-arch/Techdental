import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { routeFunction } from './routes';

/**
 * Minimal Inertia.js runtime used by the migrated React pages. The pages are
 * rendered by Astro (SSR + islands), so only the pieces the components touch
 * are implemented: page context, <Link>, <Head>, useForm and router.
 */

export interface InertiaPage {
  component: string;
  props: Record<string, any>;
  url: string;
  version?: string;
}

const PageContext = createContext<InertiaPage>({ component: '', props: {}, url: '/' });

export function PageProvider({ page, children }: { page: InertiaPage; children: React.ReactNode }) {
  return <PageContext.Provider value={page}>{children}</PageContext.Provider>;
}

export function usePage<T = any>(): InertiaPage & { props: T & Record<string, any> } {
  return useContext(PageContext) as any;
}

function hrefOf(href: any): string {
  if (!href) return '#';
  if (typeof href === 'string') return href;
  if (typeof href === 'object' && typeof href.url === 'string') return href.url;
  return String(href);
}

export const Link = React.forwardRef<HTMLAnchorElement, any>(function Link(
  { href, children, as, method, data, headers, preserveScroll, preserveState, replace, only, except, onSuccess, onError, onFinish, ...rest },
  ref
) {
  const url = hrefOf(href);
  const Component: any = as || 'a';

  if (Component === 'a') {
    return (
      <a ref={ref} href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Component
      ref={ref}
      {...rest}
      onClick={(event: any) => {
        rest.onClick?.(event);
        if (event.defaultPrevented) return;
        if (method && String(method).toLowerCase() !== 'get') {
          event.preventDefault();
          router.visit(url, { method, data, headers, preserveScroll, preserveState, onSuccess, onError, onFinish });
        } else if (url.startsWith('/')) {
          event.preventDefault();
          router.visit(url);
        }
      }}
    >
      {children}
    </Component>
  );
});

/** SEO tags are rendered server-side by Astro's <Seo> component. */
export function Head(_props: any) {
  return null;
}

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const initialRef = useRef<T>({ ...initialValues });
  const [data, setDataState] = useState<T>({ ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const transformRef = useRef<(data: T) => any>((value) => value);
  const dataRef = useRef<T>(data);
  dataRef.current = data;

  const setData = useCallback((key: any, value?: any) => {
    setDataState((previous) => {
      if (typeof key === 'string') {
        return { ...previous, [key]: value };
      }
      if (typeof key === 'function') {
        return key(previous);
      }
      return { ...previous, ...key };
    });
  }, []);

  const reset = useCallback((...fields: string[]) => {
    setDataState((previous) => {
      if (!fields.length) return { ...initialRef.current };
      const next: any = { ...previous };
      for (const field of fields) next[field] = (initialRef.current as any)[field];
      return next;
    });
    setErrors({});
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  const submit = useCallback(
    (method: string, url: string, options: any = {}) => {
      setProcessing(true);
      setErrors({});
      const payload = transformRef.current(dataRef.current);
      return request(method, url, payload, options)
        .then((result) => {
          if (result.ok) {
            setRecentlySuccessful(true);
            setTimeout(() => setRecentlySuccessful(false), 2000);
            options.onSuccess?.(result.data);
            const redirect = result.data?.redirect;
            if (typeof redirect === 'string' && redirect && typeof window !== 'undefined') {
              window.location.assign(redirect);
            }
          } else {
            setErrors(result.errors || {});
            options.onError?.(result.errors || {});
          }
        })
        .catch((error) => {
          options.onError?.({});
          if (options.onFinish) options.onFinish();
        })
        .finally(() => {
          setProcessing(false);
          options.onFinish?.();
        });
    },
    []
  );

  return {
    data,
    setData,
    errors,
    processing,
    recentlySuccessful,
    transform: (callback: (data: T) => any) => {
      transformRef.current = callback;
      return { data, setData, errors, processing, recentlySuccessful, post: submit };
    },
    post: (url: string, options?: any) => submit('post', url, options),
    put: (url: string, options?: any) => submit('put', url, options),
    patch: (url: string, options?: any) => submit('patch', url, options),
    delete: (url: string, options?: any) => submit('delete', url, options),
    reset,
    clearErrors,
    setError: (field: string, message: string) => setErrors((previous) => ({ ...previous, [field]: message })),
  };
}

async function request(method: string, url: string, payload: any, options: any = {}) {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };

  let body: any = payload;
  if (payload instanceof FormData) {
    body = payload;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(payload ?? {});
  }

  const response = await fetch(String(url), { method: String(method).toUpperCase(), headers, body, credentials: 'same-origin' });
  const text = await response.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }

  if (response.ok) return { ok: true, data, errors: {} };

  const rawErrors = data?.errors || {};
  const errors: Record<string, string> = {};
  for (const [field, messages] of Object.entries<any>(rawErrors)) {
    errors[field] = Array.isArray(messages) ? String(messages[0]) : String(messages);
  }
  if (!Object.keys(errors).length && data?.message) errors._form = String(data.message);
  return { ok: false, data, errors };
}

function buildQuery(url: string, data: any): string {
  if (!data || typeof data !== 'object' || !Object.keys(data).length) return url;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) value.forEach((item) => query.append(`${key}[]`, String(item)));
    else query.append(key, String(value));
  }
  const separator = url.includes('?') ? '&' : '?';
  const qs = query.toString();
  return qs ? `${url}${separator}${qs}` : url;
}

export const router = {
  visit(url: string, options: any = {}) {
    const method = String(options.method || 'get').toLowerCase();
    if (method === 'get') {
      if (typeof window !== 'undefined') window.location.assign(String(url));
      return Promise.resolve();
    }
    return request(method, String(url), options.data ?? {}, options).then((result) => {
      if (result.ok) {
        options.onSuccess?.(result.data);
        const redirect = result.data?.redirect;
        if (typeof redirect === 'string' && redirect && typeof window !== 'undefined') {
          window.location.assign(redirect);
        } else if (!options.onSuccess && typeof window !== 'undefined') {
          window.location.reload();
        }
      } else {
        options.onError?.(result.errors);
      }
      options.onFinish?.();
    });
  },
  get(url: string, data: any = {}, options: any = {}) {
    const target = buildQuery(String(url), data);
    if (typeof window !== 'undefined') window.location.assign(target);
    return Promise.resolve();
  },
  post(url: string, data: any = {}, options: any = {}) {
    return router.visit(url, { ...options, method: 'post', data });
  },
  put(url: string, data: any = {}, options: any = {}) {
    return router.visit(url, { ...options, method: 'put', data });
  },
  patch(url: string, data: any = {}, options: any = {}) {
    return router.visit(url, { ...options, method: 'patch', data });
  },
  delete(url: string, options: any = {}) {
    return router.visit(url, { ...options, method: 'delete', data: options.data ?? {} });
  },
  reload(options: any = {}) {
    if (typeof window !== 'undefined') window.location.reload();
  },
  remember() {},
  restore() {},
};

if (typeof globalThis !== 'undefined') {
  (globalThis as any).route = routeFunction;
}
export { routeFunction as route };

export function createInertiaApp() {
  throw new Error('createInertiaApp is not used in the Astro build.');
}
