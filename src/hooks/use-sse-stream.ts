"use client";

import { useCallback, useRef, useState } from "react";

export interface SseEvent<T = unknown> {
  event: string;
  data: T;
}

export interface UseSseStreamOptions<T = unknown> {
  /** Called for every parsed SSE event. */
  onEvent: (event: SseEvent<T>) => void;
  /** Called when stream ends normally. */
  onDone?: () => void;
  /** Called on network or parse error. */
  onError?: (err: Error) => void;
}

export interface UseSseStreamResult {
  isStreaming: boolean;
  start: (url: string, init?: RequestInit) => Promise<void>;
  abort: () => void;
}

/**
 * Generic, reusable SSE stream reader.
 * Parses the `event: <name>\ndata: <json>` wire format used by all
 * FastApp streaming endpoints (/api/generate, /api/projects/:id/deploy).
 */
export function useSseStream<T = unknown>(
  options: UseSseStreamOptions<T>
): UseSseStreamResult {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(
    async (url: string, init?: RequestInit) => {
      // Cancel any in-flight stream
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsStreaming(true);
      try {
        const res = await fetch(url, {
          ...init,
          signal: controller.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            (errData as any)?.error?.message ?? `HTTP ${res.status}`
          );
        }

        if (!res.body) {
          throw new Error("ReadableStream not supported by this endpoint.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const messages = buffer.split("\n\n");
          buffer = messages.pop() ?? "";

          for (const msg of messages) {
            if (!msg.trim()) continue;

            let eventName = "";
            let dataText = "";

            for (const line of msg.split("\n")) {
              if (line.startsWith("event: ")) eventName = line.slice(7).trim();
              else if (line.startsWith("data: ")) dataText = line.slice(6).trim();
            }

            if (eventName && dataText) {
              try {
                const parsed = JSON.parse(dataText) as T;
                options.onEvent({ event: eventName, data: parsed });
              } catch {
                // Malformed JSON — skip event
              }
            }
          }
        }

        options.onDone?.();
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const error = err instanceof Error ? err : new Error(String(err));
        options.onError?.(error);
      } finally {
        setIsStreaming(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.onEvent, options.onDone, options.onError]
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  return { isStreaming, start, abort };
}
