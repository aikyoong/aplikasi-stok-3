import localforage from "localforage";

export function set(token) {
  return localforage.setItem("userTokens", token);
}

export async function remove(token) {
  return localforage.removeItem("userTokens", token);
}
