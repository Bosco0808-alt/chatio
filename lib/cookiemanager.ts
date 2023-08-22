import { useEffect } from "react";
import Cookies from "js-cookie";

let listeners: (() => void)[] = [];

export const addCookieChangeListener = (listener: () => void) => {
  listeners.push(listener);
};

export const removeCookieChangeListener = (listener: () => void) => {
  listeners = listeners.filter((l) => l !== listener);
};

const handleCookieChange = () => {
  listeners.forEach((listener) => listener());
};

export const useCookieChangeEffect = () => {
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "cookie_change") {
        handleCookieChange();
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);
};
