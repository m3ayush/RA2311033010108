"use client";

/**
 * Custom Hook: useReadStatus
 * Manages read/unread notification state persisted in localStorage.
 */

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "campus_notifications_read";

export function useReadStatus() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        setReadIds(new Set(parsed));
      }
    } catch {
      // If localStorage is unavailable or corrupted, start fresh
      setReadIds(new Set());
    }
  }, []);

  // Persist to localStorage whenever readIds changes
  const saveToStorage = useCallback((ids: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch {
      // Silently fail if localStorage is full
    }
  }, []);

  // Mark a single notification as read
  const markRead = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  // Mark multiple notifications as read
  const markBulkRead = useCallback(
    (ids: string[]) => {
      setReadIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  // Check if a notification has been read
  const isRead = useCallback(
    (id: string) => readIds.has(id),
    [readIds]
  );

  return { readIds, markRead, markBulkRead, isRead };
}
