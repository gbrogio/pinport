export async function getFetch() {
  const globalFetch = globalThis.fetch;

  const isNodeEnv = typeof global !== 'undefined';

  if (globalFetch) {
    return globalFetch;
  }
  
  if (isNodeEnv) {
    return import('node-fetch').then((d) => d.default);
  } 

  return import('whatwg-fetch').then((d) => d.fetch);
}