"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";

export interface LoadingContextType {
  isLoading: boolean;
  isMounted: boolean;
  isInitialLoading: boolean;
  isRouteLoading: boolean;
  registerVideo: (id: string) => void;
  notifyVideoLoaded: (id: string) => void;
  startRouteLoading: () => void;
  finishRouteLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  isMounted: false,
  isInitialLoading: true,
  isRouteLoading: false,
  registerVideo: () => {},
  notifyVideoLoaded: () => {},
  startRouteLoading: () => {},
  finishRouteLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

const INITIAL_TIMEOUT_MS = 4000;
const ROUTE_TRANSITION_MIN_MS = 350;
const ROUTE_TRANSITION_MAX_TIMEOUT_MS = 3000;
const REGISTRATION_GRACE_PERIOD_MS = 300;

export interface LoadingProviderProps {
  children: React.ReactNode;
}

// useSyncExternalStore with a no-op subscribe and constant snapshots
// gives us a SSR-safe "am I on the client?" boolean without triggering
// the react-hooks/set-state-in-effect rule that bans setState inside useEffect.
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const isMounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const pathname = usePathname();
  const currentPathnameRef = useRef(pathname);

  const registeredVideosRef = useRef<Set<string>>(new Set());
  const loadedVideosRef = useRef<Set<string>>(new Set());
  const isDocumentReadyRef = useRef(false);
  const gracePeriodPassedRef = useRef(false);
  const initialLoadCompletedRef = useRef(false);

  const checkInitialReadiness = useCallback(() => {
    if (initialLoadCompletedRef.current) return;

    if (!isDocumentReadyRef.current) return;
    if (!gracePeriodPassedRef.current) return;

    const registered = registeredVideosRef.current;
    const loaded = loadedVideosRef.current;

    const allVideosLoaded =
      registered.size === 0 ||
      Array.from(registered).every((id) => loaded.has(id));

    if (allVideosLoaded) {
      initialLoadCompletedRef.current = true;
      setIsInitialLoading(false);
    }
  }, []);

  const registerVideo = useCallback(
    (id: string) => {
      registeredVideosRef.current.add(id);
      checkInitialReadiness();
    },
    [checkInitialReadiness]
  );

  const notifyVideoLoaded = useCallback(
    (id: string) => {
      loadedVideosRef.current.add(id);
      checkInitialReadiness();
    },
    [checkInitialReadiness]
  );

  const startRouteLoading = useCallback(() => {
    setIsRouteLoading(true);
  }, []);

  const finishRouteLoading = useCallback(() => {
    setIsRouteLoading(false);
  }, []);

  // Client mounting and initial document load tracking
  useEffect(() => {

    const onDocReady = () => {
      isDocumentReadyRef.current = true;
      checkInitialReadiness();
    };

    if (document.readyState === "complete") {
      isDocumentReadyRef.current = true;
    } else {
      window.addEventListener("load", onDocReady);
    }

    // Grace period allows child components to register their videos
    const graceTimer = setTimeout(() => {
      gracePeriodPassedRef.current = true;
      checkInitialReadiness();
    }, REGISTRATION_GRACE_PERIOD_MS);

    // Defensive safety timeout to prevent permanent blocking
    const safetyTimer = setTimeout(() => {
      if (!initialLoadCompletedRef.current) {
        initialLoadCompletedRef.current = true;
        setIsInitialLoading(false);
      }
    }, INITIAL_TIMEOUT_MS);

    return () => {
      window.removeEventListener("load", onDocReady);
      clearTimeout(graceTimer);
      clearTimeout(safetyTimer);
    };
  }, [checkInitialReadiness]);

  // Route transition detection via global link click interception
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (event.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;

      // Ignore new tabs, downloads, external protocols, and in-page anchor-only jumps
      if (
        anchor.target === "_blank" ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("#")
      ) {
        return;
      }

      try {
        const targetUrl = new URL(anchor.href, window.location.origin);
        if (targetUrl.origin !== window.location.origin) {
          return;
        }

        // Only activate route loading if target pathname differs from current pathname
        if (targetUrl.pathname !== currentPathnameRef.current) {
          setIsRouteLoading(true);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  // Handle pathname changes in Next.js App Router
  useEffect(() => {
    if (pathname !== currentPathnameRef.current) {
      currentPathnameRef.current = pathname;
      // Complete route loading after a minimum duration for smooth presentation
      const timer = setTimeout(() => {
        setIsRouteLoading(false);
      }, ROUTE_TRANSITION_MIN_MS);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Defensive timeout for route loading to ensure it doesn't get stuck
  useEffect(() => {
    if (isRouteLoading) {
      const timer = setTimeout(() => {
        setIsRouteLoading(false);
      }, ROUTE_TRANSITION_MAX_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }
  }, [isRouteLoading]);

  const isLoading = isInitialLoading || isRouteLoading;

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isMounted,
        isInitialLoading,
        isRouteLoading,
        registerVideo,
        notifyVideoLoaded,
        startRouteLoading,
        finishRouteLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
