export interface PageProps {
  [key: string]: any;
}

export type Errors = Record<string, string>;
export type ErrorBag = Record<string, string>;

export const router = {
  visit() {},
  get() {},
  post() {},
  put() {},
  patch() {},
  delete() {},
  reload() {},
};
