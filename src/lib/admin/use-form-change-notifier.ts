import { useEffect, useRef, type RefObject } from "react";

export function useFormChangeNotifier(target: RefObject<HTMLElement | null>, signal: unknown): void {
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    target.current?.dispatchEvent(new Event("input", { bubbles: true }));
  }, [signal, target]);
}
