"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects } from "@/lib/content";
import { cn, faDigits } from "@/lib/utils";

export function ProjectsExplorer() {
  const provinces = useMemo(() => {
    const set = new Set(projects.map((p) => p.province).filter((p) => p !== "—"));
    return ["همه", ...Array.from(set)];
  }, []);
  const [filter, setFilter] = useState("همه");

  const visible = filter === "همه" ? projects : projects.filter((p) => p.province === filter);

  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionLabel index="۰۱" total="۰۲" title="Archive Records" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-balance text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold leading-snug text-ink">
            فهرست اجراها
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر استان">
            {provinces.map((p) => (
              <button
                key={p}
                type="button"
                data-cursor="view"
                onClick={() => setFilter(p)}
                aria-pressed={filter === p}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                  filter === p ? "border-ink bg-ink text-cloud" : "border-paper-line text-ink-soft hover:border-ink/40",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-8 flex flex-col border-t border-ink/10">
          {visible.length === 0 ? (
            <li className="py-16 text-center text-sm text-ink-mute">پروژه‌ای در این استان ثبت نشده است.</li>
          ) : (
            visible.map((project, i) => (
              <Reveal key={project.id} delay={i * 50} as="li">
                <article className="group grid gap-3 border-b border-ink/10 py-7 transition-colors hover:bg-paper-dim/50 md:grid-cols-[3rem_1.4fr_.8fr_1.6fr] md:items-center md:gap-8 md:py-8">
                  <span className="font-technical text-sm tabular-nums text-ink-mute transition-colors group-hover:text-argon">
                    {faDigits(String(i + 1).padStart(2, "0"))}
                  </span>
                  <h3 className="text-lg font-semibold leading-snug text-ink md:text-xl">{project.title}</h3>
                  <div className="flex items-center gap-3 font-technical text-xs uppercase tracking-[0.16em] text-ink-mute">
                    <span>{project.province}</span>
                    <span className="h-px w-5 bg-ink/20" />
                    <span>{project.year}</span>
                  </div>
                  <p className="text-sm leading-7 text-ink-soft">{project.detail}</p>
                </article>
              </Reveal>
            ))
          )}
        </ul>

        {visible.length > 0 ? (
          <p className="mt-6 text-xs leading-6 text-ink-mute">
            نمایش {faDigits(visible.length)} از {faDigits(projects.length)} رکورد ثبت‌شده.
          </p>
        ) : null}
      </div>
    </section>
  );
}
