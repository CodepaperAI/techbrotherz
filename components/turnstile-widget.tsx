"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Cloudflare Turnstile, rendered explicitly.
 *
 * No wrapper package: the widget is a script tag and three callbacks, and
 * next/script already solves the part that is actually hard, which is loading
 * one copy of a third-party script across client navigations.
 *
 * Explicit rendering rather than the implicit `cf-turnstile` class, because
 * implicit mode scans the DOM once on load and misses a form that arrives with
 * a client navigation.
 */

const SCRIPT_ID = "cf-turnstile-script";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * The widget's own height, reserved before the script has loaded so nothing
 * below it moves when it appears. 65px is Turnstile's fixed height in the
 * `normal` size; the widget does not reflow to its container.
 */
const WIDGET_HEIGHT = 65;

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  "timeout-callback": () => void;
  theme: "light" | "dark" | "auto";
  size: "normal" | "compact" | "flexible";
  action?: string;
}

interface TurnstileApi {
  render: (element: HTMLElement, options: TurnstileRenderOptions) => string | undefined;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileWidgetProps {
  /** Fires with a fresh token every time the visitor passes the challenge. */
  onVerify: (token: string) => void;
  /** Fires when a token ages out. Turnstile tokens last five minutes. */
  onExpire?: () => void;
  /** Fires on a challenge failure or a network problem. */
  onError?: () => void;
  /**
   * Change this to force a reset. Tokens are single use, so the form bumps it
   * after every submit, successful or not.
   */
  resetSignal?: number;
  /** Distinguishes this widget in the Cloudflare analytics. */
  action?: string;
  className?: string;
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
  resetSignal = 0,
  action,
  className,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  /* The callbacks are held in a ref so that re-rendering the parent, which
     happens on every keystroke in the form, never re-renders the widget.
     Turnstile draws in an iframe: tearing it down and rebuilding it would
     lose the visitor's progress through the challenge. */
  const handlers = useRef({ onVerify, onExpire, onError });
  handlers.current = { onVerify, onExpire, onError };

  /* A client navigation back to this page remounts the component with the
     script already parsed, in which case Script's onReady has nothing left to
     announce. Checking directly covers that. */
  useEffect(() => {
    if (window.turnstile) setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !TURNSTILE_SITE_KEY) return;

    const container = containerRef.current;
    const turnstile = window.turnstile;

    // Guard against a double render in React's development strict mode.
    if (!container || !turnstile || widgetIdRef.current !== null) return;

    widgetIdRef.current =
      turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => handlers.current.onVerify(token),
        "expired-callback": () => handlers.current.onExpire?.(),
        "error-callback": () => handlers.current.onError?.(),
        "timeout-callback": () => handlers.current.onExpire?.(),
        /* The form sits on a white card on the light page surface, so the
           widget is told which side of the palette it is on rather than being
           given colours. Turnstile does not accept custom colours, and a
           hardcoded hex here would be a second source of truth for something
           app/globals.css already owns. */
        theme: "light",
        size: "normal",
        action,
      }) ?? null;

    return () => {
      if (widgetIdRef.current !== null) {
        turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [ready, action]);

  /* Tokens are single use. The parent bumps resetSignal after each submit. */
  useEffect(() => {
    if (resetSignal === 0 || widgetIdRef.current === null) return;
    window.turnstile?.reset(widgetIdRef.current);
  }, [resetSignal]);

  if (!TURNSTILE_SITE_KEY) return null;

  return (
    <>
      {/* next/script deduplicates on id, so the script is injected once no
          matter how many widgets mount. lazyOnload keeps it off the critical
          path: the form is well below the fold on /contact. */}
      <Script
        id={SCRIPT_ID}
        src={SCRIPT_SRC}
        strategy="lazyOnload"
        onReady={() => setReady(true)}
        onError={() => handlers.current.onError?.()}
      />
      {/* The height is reserved up front so the submit row does not jump when
          the iframe arrives. */}
      <div
        ref={containerRef}
        style={{ minHeight: WIDGET_HEIGHT }}
        className={cn("[&_iframe]:rounded-input", className)}
      />
    </>
  );
}
