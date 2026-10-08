import type { CSSProperties, ElementType, ReactNode } from "react";

/** Server-rendered wrapper: Providers' observer adds `.is-in` when it scrolls into view. */
export default function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag data-reveal className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
