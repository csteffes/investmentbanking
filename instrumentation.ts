export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const noopStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    };

    if (typeof globalThis.localStorage === "undefined" || typeof (globalThis.localStorage as Storage).getItem !== "function") {
      (globalThis as typeof globalThis & { localStorage: Storage }).localStorage = noopStorage as unknown as Storage;
    }
  }
}
