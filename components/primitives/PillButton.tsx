import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PillButtonVariant = "primary" | "ghost" | "dark" | "ghostOnDark";
export type PillButtonSize = "md" | "sm";

interface PillButtonBaseProps {
  children: ReactNode;
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  /** Trailing arrow. Turn off for a phone number or a plain action. */
  withArrow?: boolean;
  className?: string;
}

type PillButtonAsLink = PillButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type PillButtonAsButton = PillButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type PillButtonProps = PillButtonAsLink | PillButtonAsButton;

/**
 * Contrast rule, enforced here so it cannot be broken by a caller: the label on
 * a green fill is --tb-ink, never white. DESIGN.md Section 2.1.
 */
const VARIANT_STYLES: Record<PillButtonVariant, string> = {
  primary: "bg-tb-green text-tb-ink hover:bg-tb-green-press",
  ghost:
    "border border-tb-border bg-transparent text-tb-text hover:border-tb-ink hover:bg-tb-white",
  dark: "bg-tb-ink text-tb-white hover:bg-tb-ink-2",
  ghostOnDark: "border border-tb-border-dark bg-transparent text-tb-white hover:border-tb-silver",
};

const SIZE_STYLES: Record<PillButtonSize, string> = {
  md: "h-12 px-7 text-base md:h-13",
  sm: "h-10 px-5 text-[0.9375rem]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-chip font-medium " +
  "transition-colors duration-[180ms] ease-out disabled:pointer-events-none disabled:opacity-50";

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

/**
 * The one button in the system. Fully rounded, trailing arrow that nudges 2px
 * on hover. Renders a Next Link for internal routes, an anchor for tel:, mailto:
 * and external URLs, and a button when no href is given.
 * DESIGN.md Section 6.5.
 */
export function PillButton(props: PillButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    withArrow = true,
    className,
    ...rest
  } = props;

  const classes = cn(BASE, VARIANT_STYLES[variant], SIZE_STYLES[size], "group", className);

  const content = (
    <>
      {children}
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          size={18}
          strokeWidth={1.5}
          className="transition-transform duration-[180ms] ease-out group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    if (isInternal(href)) {
      return (
        <Link href={href} className={classes} {...anchorRest}>
          {content}
        </Link>
      );
    }

    const isExternalHttp = href.startsWith("http");

    return (
      <a
        href={href}
        className={classes}
        {...(isExternalHttp ? { rel: "noopener", target: "_blank" } : {})}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={buttonRest.type ?? "button"} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
