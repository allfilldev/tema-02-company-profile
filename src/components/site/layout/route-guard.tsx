"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { RouteSkeleton } from "@/components/skeletons/route-skeleton";
import { isSamePathname, resolveLinkClick, type LinkClick } from "@/lib/site/route-guard-logic";
import type { SkeletonKind } from "@/lib/site/skeleton-kind";

type PendingNavigation = {
  kind: SkeletonKind;
  fromPath: string;
};

type GuardTracker = {
  childShown: () => void;
  childHidden: () => void;
};

const ParentGuardContext = createContext<GuardTracker | null>(null);

function readLinkClick(event: MouseEvent): LinkClick | null {
  const anchor = event.target instanceof Element ? event.target.closest("a") : null;

  if (anchor === null) {
    return null;
  }

  return {
    href: anchor.getAttribute("href"),
    target: anchor.getAttribute("target"),
    download: anchor.hasAttribute("download"),
    button: event.button,
    metaKey: event.metaKey,
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    defaultPrevented: event.defaultPrevented,
  };
}

type NavigationWatcherProps = {
  fromPath: string;
  onNavigated: () => void;
};

function NavigationWatcher({ fromPath, onNavigated }: NavigationWatcherProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isSamePathname(pathname, fromPath)) {
      onNavigated();
    }
  }, [pathname, fromPath, onNavigated]);

  return null;
}

export function RouteGuard({ children }: { children: ReactNode }) {
  const parentGuard = useContext(ParentGuardContext);
  const [visible, setVisible] = useState(true);
  const [pending, setPending] = useState<PendingNavigation | null>(null);
  const [shownChildGuards, setShownChildGuards] = useState(0);
  const wasHidden = useRef(false);

  const tracker = useMemo<GuardTracker>(
    () => ({
      childShown: () => setShownChildGuards((count) => count + 1),
      childHidden: () => setShownChildGuards((count) => count - 1),
    }),
    [],
  );

  const clearPending = useCallback(() => setPending(null), []);

  useLayoutEffect(() => {
    if (wasHidden.current) {
      wasHidden.current = false;
      setVisible(true);
    }
    parentGuard?.childShown();

    return () => {
      wasHidden.current = true;
      parentGuard?.childHidden();
      setVisible(false);
      setPending(null);
    };
  }, [parentGuard]);

  const isInnermostGuard = shownChildGuards === 0;

  useEffect(() => {
    if (!isInnermostGuard) {
      return;
    }

    function updateSkeletonOnLinkClick(event: MouseEvent) {
      const click = readLinkClick(event);
      const outcome = click === null ? null : resolveLinkClick(click, window.location.href);

      if (outcome === null) {
        return;
      }

      setPending(
        outcome.type === "navigate" ? { kind: outcome.kind, fromPath: window.location.pathname } : null,
      );
    }

    window.addEventListener("click", updateSkeletonOnLinkClick);
    return () => window.removeEventListener("click", updateSkeletonOnLinkClick);
  }, [isInnermostGuard]);

  if (!visible) {
    return null;
  }

  if (pending !== null) {
    return (
      <>
        <RouteSkeleton kind={pending.kind} />
        <NavigationWatcher fromPath={pending.fromPath} onNavigated={clearPending} />
      </>
    );
  }

  return <ParentGuardContext value={tracker}>{children}</ParentGuardContext>;
}
