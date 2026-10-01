import { For, Show, createMemo, createSignal } from "solid-js";
import {
  CATEGORY_LABEL,
  INDEPENDENCE_LABEL,
  STALE_AFTER_DAYS,
  TRUST_LABEL,
  daysBetween,
  type Benchmark,
  type Category,
  type Trust,
} from "../data/types";

interface Props {
  benchmarks: Benchmark[];
  updated: string;
}

type Sort = "trust" | "fresh" | "name";

const TRUST_RANK: Record<Trust, number> = { high: 3, medium: 2, low: 1 };

const TRUST_COLOR: Record<Trust, string> = {
  high: "var(--high)",
  medium: "var(--medium)",
  low: "var(--low)",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function TrustMeter(props: { trust: Trust }) {
  const filled = () => TRUST_RANK[props.trust];
  return (
    <span class="inline-flex items-center gap-2" aria-label={`Trust: ${TRUST_LABEL[props.trust]}`}>
      <span class="flex gap-0.5" aria-hidden="true">
        <For each={[1, 2, 3]}>
          {(i) => (
            <span
              class="h-2.5 w-5 first:rounded-l-sm last:rounded-r-sm"
              style={{ background: i <= filled() ? TRUST_COLOR[props.trust] : "var(--empty)" }}
            />
          )}
        </For>
      </span>
      <span class="text-sm font-semibold" style={{ color: TRUST_COLOR[props.trust] }}>
        {TRUST_LABEL[props.trust]}
      </span>
    </span>
  );
}

export default function BenchmarkList(props: Props) {
  const [category, setCategory] = createSignal<Category | "all">("all");
  const [hideShaky, setHideShaky] = createSignal(false);
  const [sort, setSort] = createSignal<Sort>("trust");

  const categories = createMemo(() => {
    const seen = new Set<Category>();
    for (const b of props.benchmarks) seen.add(b.category);
    return [...seen];
  });

  const counts = createMemo(() => {
    const c: Partial<Record<Category, number>> = {};
    for (const b of props.benchmarks) c[b.category] = (c[b.category] ?? 0) + 1;
    return c;
  });

  const visible = createMemo(() => {
    const list = props.benchmarks.filter(
      (b) =>
        (category() === "all" || b.category === category()) &&
        (!hideShaky() || b.trust !== "low"),
    );
    const s = sort();
    return list.sort((a, b) => {
      if (s === "name") return a.name.localeCompare(b.name);
      if (s === "fresh") return b.lastChecked.localeCompare(a.lastChecked);
      return TRUST_RANK[b.trust] - TRUST_RANK[a.trust] || b.lastChecked.localeCompare(a.lastChecked);
    });
  });

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
      active
        ? "border-ink bg-ink text-paper"
        : "border-rule text-muted hover:border-ink hover:text-ink"
    }`;

  return (
    <div>
      <div class="flex flex-col gap-4 border-b border-rule pb-5 md:flex-row md:items-end md:justify-between">
        <div role="group" aria-label="Filter by category" class="flex flex-wrap gap-2">
          <button type="button" class={chip(category() === "all")} aria-pressed={category() === "all"} onClick={() => setCategory("all")}>
            All <span class="tnum opacity-60">{props.benchmarks.length}</span>
          </button>
          <For each={categories()}>
            {(c) => (
              <button type="button" class={chip(category() === c)} aria-pressed={category() === c} onClick={() => setCategory(c)}>
                {CATEGORY_LABEL[c]} <span class="tnum opacity-60">{counts()[c]}</span>
              </button>
            )}
          </For>
        </div>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <label class="inline-flex cursor-pointer items-center gap-2 text-muted">
            <input type="checkbox" class="size-4 accent-[var(--accent)]" checked={hideShaky()} onChange={(e) => setHideShaky(e.currentTarget.checked)} />
            Hide shaky ones
          </label>
          <label class="inline-flex items-center gap-2 text-muted">
            Sort by
            <select
              class="rounded-md border border-rule bg-raised px-2 py-1 text-ink"
              value={sort()}
              onChange={(e) => setSort(e.currentTarget.value as Sort)}
            >
              <option value="trust">Most trustworthy</option>
              <option value="fresh">Recently updated</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
      </div>

      <p class="sr-only" aria-live="polite">
        Showing {visible().length} of {props.benchmarks.length} leaderboards
      </p>

      <ol class="divide-y divide-rule">
        <For
          each={visible()}
          fallback={
            <li class="py-12 text-muted">
              Nothing matches these filters. Turn off “Hide shaky ones” or pick another category.
            </li>
          }
        >
          {(b) => {
            const age = daysBetween(b.lastChecked, props.updated);
            const stale = age > STALE_AFTER_DAYS;
            return (
              <li id={b.id} class="grid scroll-mt-6 gap-x-10 gap-y-4 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
                <div>
                  <p class="text-sm text-muted">{CATEGORY_LABEL[b.category]}</p>
                  <h3 class="mt-1 text-2xl font-semibold tracking-tight">{b.name}</h3>
                  <p class="mt-1 text-sm text-muted">{b.org}</p>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener"
                    class="mt-3 inline-block text-sm font-semibold text-accent underline"
                  >
                    Open leaderboard<span class="sr-only"> for {b.name} (opens in new tab)</span>
                  </a>
                </div>

                <div class="max-w-[62ch]">
                  <p class="text-muted">{b.measures}</p>
                  <p class="mt-3">{b.takeaway}</p>
                </div>

                <div class="flex flex-col gap-3 md:border-l md:border-rule md:pl-6">
                  <div>
                    <p class="text-sm text-muted">Currently on top</p>
                    <p class="font-display text-lg font-semibold leading-snug">{b.currentLeader}</p>
                    <Show when={b.leaderScore}>
                      <p class="tnum font-display text-3xl font-bold tracking-tight">{b.leaderScore}</p>
                    </Show>
                  </div>
                  <TrustMeter trust={b.trust} />
                  <p class="text-sm leading-relaxed text-muted">{b.trustNote}</p>
                  <p class="text-sm text-muted">
                    {INDEPENDENCE_LABEL[b.independence]}. Data from {formatDate(b.lastChecked)}
                    <Show when={stale}>
                      <span class="ml-1 font-semibold text-low">({Math.round(age / 30)} months old)</span>
                    </Show>
                  </p>
                </div>
              </li>
            );
          }}
        </For>
      </ol>
    </div>
  );
}
