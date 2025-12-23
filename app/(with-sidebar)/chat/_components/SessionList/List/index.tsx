"use client";

import Link from "next/link";
import { memo, useCallback } from "react";
import { shallow } from "zustand/shallow";

import { sessionSelectors, useSessionStore } from "@/store/session";

import SessionItem from "./SessionItem";

const SessionList = memo(() => {
  const list = useSessionStore((s) => sessionSelectors.chatList(s));
  const [activeId, loading, removeSession] = useSessionStore(
    (s) => [s.activeId, s.autocompleteLoading.title, s.removeSession],
    shallow,
  );

  const onRemove = useCallback(
    (id: string) => {
      removeSession(id);
    },
    [removeSession],
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div className="space-y-1 px-2 py-3">
        {list.map(({ id }) => (
          <Link
            href={`/chat/${id}`}
            key={id}
            className="block"
            prefetch={false}
          >
            <SessionItem
              active={activeId === id}
              id={id}
              loading={loading && id === activeId}
              onRemove={onRemove}
            />
          </Link>
        ))}
      </div>
    </div>
  );
});

SessionList.displayName = "SessionList";

export default SessionList;
