// Isolated staleness logic — easy to tweak thresholds in one place

export type StalenessLevel = "fresh" | "aging" | "stale";

export function getStaleness(lastUpdated: string): { level: StalenessLevel; days: number } {
  const days = Math.floor(
    (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  );
  const level: StalenessLevel =
    days <= 3 ? "fresh" :
    days <= 7 ? "aging" :
    "stale";
  return { level, days };
}

// TODO: wire these color values to your card border/background
export const STALENESS_COLORS: Record<StalenessLevel, string> = {
  fresh: "#22c55e",  // green — adjust to taste
  aging: "#eab308",  // yellow
  stale: "#ef4444",  // red
};