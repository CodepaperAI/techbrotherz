/**
 * The Studio renders its own full-height chrome, so it opts out of the site
 * body styling rather than inheriting the marketing page background.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-white">{children}</div>;
}
