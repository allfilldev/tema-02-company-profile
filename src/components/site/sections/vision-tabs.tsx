"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { joinClassNames } from "@/lib/ui/class-names";

export type VisionTab = {
  key: string;
  label: string;
  content: ReactNode;
};

type VisionTabsProps = {
  idPrefix: string;
  tabs: VisionTab[];
};

const TAB_CLASS_NAME = "inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors";
const ACTIVE_TAB_CLASS_NAME = "bg-primary text-primary-foreground";
const IDLE_TAB_CLASS_NAME = "text-muted-foreground hover:text-primary";

// All panels stay in the server markup; inactive ones are only hidden, so the content remains crawlable.
export function VisionTabs({ idPrefix, tabs }: VisionTabsProps) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function moveFocus(event: KeyboardEvent, index: number) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) {
      return;
    }
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    setActiveKey(next.key);
    buttonRefs.current[next.key]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Visi, misi, dan nilai" className="flex flex-wrap gap-1 border-b border-border pb-4">
        {tabs.map((tab, index) => {
          const active = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              ref={(element) => {
                buttonRefs.current[tab.key] = element;
              }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab.key}`}
              aria-selected={active}
              aria-controls={`${idPrefix}-panel-${tab.key}`}
              tabIndex={active ? 0 : -1}
              className={joinClassNames(TAB_CLASS_NAME, active ? ACTIVE_TAB_CLASS_NAME : IDLE_TAB_CLASS_NAME)}
              onClick={() => setActiveKey(tab.key)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${idPrefix}-panel-${tab.key}`}
          aria-labelledby={`${idPrefix}-tab-${tab.key}`}
          hidden={tab.key !== activeKey}
          className="pt-6"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
