"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { headerLinks } from "@/lib/nav";
import { SITE, TEL_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Links come from the route registry. A route still marked pending renders only
 * in development, flagged, so the live site never links to a page that does not
 * exist yet. See lib/routes.ts.
 */
const HEADER_LINKS = headerLinks();

/** Development-only marker on a link whose page has not shipped yet. */
function PendingFlag() {
  return (
    <span
      title="This page ships in a later phase. Hidden in production."
      className="type-caption rounded-chip border-tb-border bg-tb-cream text-tb-muted border px-1.5 py-0.5 text-[0.6875rem] leading-none"
    >
      soon
    </span>
  );
}

/**
 * Sticky header. Transparent at the top, gains a backdrop blur and a hairline
 * after 8px of scroll. Mobile opens a full-screen sheet with the call button
 * pinned to the bottom. DESIGN.md Section 6.20.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  }, []);

  // Lock body scroll, trap focus, and close on Escape while the sheet is open.
  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        sheetRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = focusables();
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-[180ms] ease-out",
        scrolled
          ? "border-tb-border bg-tb-cream/85 shadow-nav backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {HEADER_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "hover:text-tb-green-deep inline-flex items-center gap-1.5 text-[0.9375rem] transition-colors duration-[180ms] ease-out",
                      active ? "text-tb-text font-medium" : "text-tb-muted",
                    )}
                  >
                    {link.label}
                    {link.pending ? <PendingFlag /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={TEL_HREF}
            className="text-tb-text hover:text-tb-green-deep text-[0.9375rem] font-medium"
          >
            {SITE.phone}
          </a>
          <PillButton href="/contact" size="sm">
            Get a quote
          </PillButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={TEL_HREF}
            aria-label={`Call TechBrotherz on ${SITE.phone}`}
            className="rounded-chip border-tb-border bg-tb-white text-tb-text inline-flex size-11 items-center justify-center border"
          >
            <Phone aria-hidden="true" size={18} strokeWidth={1.5} />
          </a>

          <button
            ref={triggerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="rounded-chip border-tb-border bg-tb-white text-tb-text inline-flex size-11 items-center justify-center border"
          >
            <Menu aria-hidden="true" size={20} strokeWidth={1.5} />
          </button>
        </div>
      </Container>

      {menuOpen ? (
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-surface="dark"
          className="bg-tb-ink fixed inset-0 z-50 flex flex-col lg:hidden"
        >
          <Container className="flex h-18 items-center justify-between">
            <Logo onDark />
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeMenu}
              className="rounded-chip border-tb-border-dark text-tb-white inline-flex size-11 items-center justify-center border"
            >
              <X aria-hidden="true" size={20} strokeWidth={1.5} />
            </button>
          </Container>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
            <Container>
              <ul className="divide-tb-border-dark divide-y">
                {HEADER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="type-h3 text-tb-white hover:text-tb-green flex items-center gap-2 py-5"
                    >
                      {link.label}
                      {link.pending ? <PendingFlag /> : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </nav>

          <Container className="border-tb-border-dark border-t py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <PillButton href={TEL_HREF} withArrow={false} className="w-full">
              Call {SITE.phone}
            </PillButton>
            <p className="type-caption text-tb-muted-dark mt-3 text-center">
              {SITE.appointmentPolicy}
            </p>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
