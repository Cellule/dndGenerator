import { GeneratedNpc } from "./typings";

interface IStorageItems {
  npcHistory: GeneratedNpc[];
}

export type ValidStorageKeys = keyof IStorageItems;
export type StorageDataType = { [K in ValidStorageKeys]: IStorageItems[K] };

const noLocalStorageInMemoryCache: Partial<StorageDataType> = {};
let canUseLocalStorage = false;
try {
  // document.cookie can throw in an iFrame, just to be safe here
  // document.cookie can sometimes return an empty string, therefore a typeof check
  // is more suitable than a truthy check
  canUseLocalStorage = !!(document && typeof document.cookie === "string" && window.localStorage);
} catch {
  console.error("LocalStorage not supported");
}

function wrapLocalStorage<T>(fromLocalStorage: () => T, fromInMemoryStorage: () => T): T {
  if (canUseLocalStorage) {
    try {
      return fromLocalStorage();
    } catch (err) {
      console.error("LocalStorage not supported");
      console.error(err);
      canUseLocalStorage = false;
    }
  }
  return fromInMemoryStorage();
}

export function setItem<Key extends ValidStorageKeys>(key: Key, data: StorageDataType[Key] | null) {
  wrapLocalStorage(
    () => {
      let serializedData = "";

      try {
        serializedData = JSON.stringify(data);
      } catch (e) {
        console.error("Serialization error:", e, data);
      }

      localStorage.setItem(key, serializedData);
    },
    () => {
      if (data === null) {
        delete noLocalStorageInMemoryCache[key];
      } else {
        noLocalStorageInMemoryCache[key] = data;
      }
    },
  );
}

export function removeItem<Key extends ValidStorageKeys>(key: Key) {
  wrapLocalStorage(
    () => localStorage.removeItem(key),
    () => {
      delete noLocalStorageInMemoryCache[key];
    },
  );
}

function tryParse<T>(value: string): T | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getItem<Key extends ValidStorageKeys>(key: Key): StorageDataType[Key] | null {
  return wrapLocalStorage(
    () => {
      const serializedData = localStorage.getItem(key);

      if (serializedData === null || serializedData === "null") {
        return null;
      }

      const deserializedData = tryParse<StorageDataType[Key]>(serializedData);

      if (deserializedData !== null) {
        return deserializedData;
      }

      console.error("Deserialization error:", serializedData);

      return serializedData as unknown as StorageDataType[Key];
    },
    () => {
      return (noLocalStorageInMemoryCache as StorageDataType)[key];
    },
  );
}
