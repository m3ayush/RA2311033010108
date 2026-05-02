/**
 * Priority Inbox Service
 * 
 * Implements a priority-based notification ranking system using
 * a Min-Heap data structure for efficient top-N extraction.
 * 
 * Priority is determined by:
 *   1. Type weight: Placement (3) > Result (2) > Event (1)
 *   2. Recency: Newer notifications score higher
 * 
 * Composite score = typeWeight * WEIGHT_FACTOR + recencyScore * RECENCY_FACTOR
 * 
 * Using a min-heap of size N:
 *   - Insert: O(log N) per notification
 *   - Overall: O(M log N) where M = total notifications, N = inbox size
 *   - Space: O(N)
 */

import {
  Notification,
  ScoredNotification,
  NotificationType,
  TYPE_WEIGHTS,
} from "../domain/notification";
import { createLogger } from "logging-middleware";
import { config } from "../config";

const Log = createLogger({
  email: config.email,
  name: config.name,
  rollNo: config.rollNo,
  accessCode: config.accessCode,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  baseUrl: config.baseUrl,
});

// Tunable factors for priority scoring
// WEIGHT_FACTOR must be much larger than unix timestamps (~1.7B) to ensure
// type weight always dominates, while recency breaks ties within same type
const WEIGHT_FACTOR = 10_000_000_000;
const RECENCY_FACTOR = 1;

/**
 * MinHeap implementation for ScoredNotification.
 * Keeps the smallest scored notification at the root so we can
 * efficiently maintain only the top-N highest priority items.
 */
class MinHeap {
  private heap: ScoredNotification[] = [];
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  // Get current heap size
  get size(): number {
    return this.heap.length;
  }

  // Get the minimum element (root)
  peek(): ScoredNotification | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  // Insert a notification into the heap
  insert(notification: ScoredNotification): void {
    if (this.heap.length < this.maxSize) {
      // Heap not full — just add it
      this.heap.push(notification);
      this.bubbleUp(this.heap.length - 1);
    } else if (notification.priorityScore > this.heap[0].priorityScore) {
      // New notification has higher priority than the current minimum
      // Replace the root and heapify down
      this.heap[0] = notification;
      this.heapifyDown(0);
    }
    // Otherwise, notification has lower priority — ignore it
  }

  // Extract all notifications sorted by priority (highest first)
  extractSorted(): ScoredNotification[] {
    return [...this.heap].sort((a, b) => b.priorityScore - a.priorityScore);
  }

  // Bubble up a newly inserted element to maintain heap property
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].priorityScore <= this.heap[index].priorityScore) {
        break;
      }
      this.swap(parentIndex, index);
      index = parentIndex;
    }
  }

  // Push the root element down to maintain heap property
  private heapifyDown(index: number): void {
    const length = this.heap.length;

    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < length && this.heap[left].priorityScore < this.heap[smallest].priorityScore) {
        smallest = left;
      }
      if (right < length && this.heap[right].priorityScore < this.heap[smallest].priorityScore) {
        smallest = right;
      }

      if (smallest === index) break;

      this.swap(index, smallest);
      index = smallest;
    }
  }

  // Swap two elements in the heap array
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

/**
 * Calculate priority score for a notification.
 * Combines type weight and recency into a single numeric score.
 */
function calculatePriorityScore(notification: Notification): number {
  // Type weight component
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 1;

  // Recency component — convert timestamp to unix seconds
  const timestamp = new Date(notification.Timestamp).getTime() / 1000;

  // Composite score: weighted type importance + recency bonus
  return typeWeight * WEIGHT_FACTOR + timestamp * RECENCY_FACTOR;
}

/**
 * Get the top N priority notifications from a list.
 * Uses a min-heap for O(M log N) efficiency.
 * 
 * @param notifications - All notifications to rank
 * @param n - Number of top priority notifications to return
 * @param readIds - Set of notification IDs that have been read (excluded from priority)
 * @param filterType - Optional type filter
 * @returns Top N unread notifications sorted by priority
 */
export function getTopNPriority(
  notifications: Notification[],
  n: number,
  readIds: Set<string> = new Set(),
  filterType?: NotificationType
): ScoredNotification[] {
  const heap = new MinHeap(n);

  let processedCount = 0;
  let skippedRead = 0;
  let skippedType = 0;

  for (const notification of notifications) {
    // Skip read notifications — priority inbox only shows unread
    if (readIds.has(notification.ID)) {
      skippedRead++;
      continue;
    }

    // Apply type filter if specified
    if (filterType && notification.Type !== filterType) {
      skippedType++;
      continue;
    }

    // Score and insert into heap
    const scored: ScoredNotification = {
      ...notification,
      priorityScore: calculatePriorityScore(notification),
    };

    heap.insert(scored);
    processedCount++;
  }

  const result = heap.extractSorted();

  // Log the priority computation
  Log(
    "backend",
    "info",
    "service",
    `Priority inbox computed: processed=${processedCount}, skippedRead=${skippedRead}, skippedType=${skippedType}, returned=${result.length}`
  );

  return result;
}
