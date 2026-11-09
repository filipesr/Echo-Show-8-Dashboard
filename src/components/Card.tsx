import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  icon: LucideIcon;
  aside?: ReactNode; // right side of the header
  className?: string;
  children: ReactNode;
}

export default function Card({
  title,
  icon: Icon,
  aside,
  className = "",
  children,
}: CardProps) {
  return (
    <section className={`panel flex flex-col rounded-2xl p-4 ${className}`}>
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[13px] font-bold tracking-wider text-slate-300 uppercase">
          <Icon className="h-4 w-4 text-cyan-400" aria-hidden />
          {title}
        </h2>
        {aside}
      </header>
      {children}
    </section>
  );
}
