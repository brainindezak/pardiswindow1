import { faDigits } from "@/lib/utils";

export function SectionLabel({
  index,
  total,
  title,
  tone = "light",
}: {
  index: string;
  total?: string;
  title: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={
          "font-technical text-xs tracking-[0.2em] " + (tone === "dark" ? "text-cloud-mute" : "text-ink-mute")
        }
      >
        {faDigits(index)}
        {total ? ` / ${faDigits(total)}` : ""}
      </span>
      <span className={"h-px w-10 " + (tone === "dark" ? "bg-cloud/30" : "bg-ink/25")} />
      <span
        className={
          "font-technical text-xs uppercase tracking-[0.28em] " +
          (tone === "dark" ? "text-cloud-mute" : "text-ink-mute")
        }
      >
        {title}
      </span>
    </div>
  );
}
