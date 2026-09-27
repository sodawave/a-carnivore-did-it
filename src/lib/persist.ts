import { useSyncExternalStore } from "react";
import {
  CAMPAIGN_DOSSIER_IDS,
  campaignScore,
  rankForScore,
  type Rank,
} from "@/lib/game";

const STORAGE_KEY = "ha-sido-un-carnivoro:v1";
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeProgress(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStoreChange);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStoreChange);
    }
  };
}

export type OpenBest = {
  stars: number;
  elapsedSec: number;
};

export type CampaignStatus = "idle" | "in_progress" | "completed" | "failed";

export type CampaignCaseResult = {
  dossierId: number;
  stars: number;
  elapsedSec: number | null;
  skipped: boolean;
};

export type CampaignProgress = {
  status: CampaignStatus;
  /** Index into CAMPAIGN_DOSSIER_IDS of the next unplayed case. */
  nextIndex: number;
  badgesLeft: number;
  badgesUsed: number;
  results: CampaignCaseResult[];
};

export type SavedProgress = {
  openBest: Record<string, OpenBest>;
  campaign: CampaignProgress;
};

const emptyCampaign = (): CampaignProgress => ({
  status: "idle",
  nextIndex: 0,
  badgesLeft: 2,
  badgesUsed: 0,
  results: [],
});

export const emptyProgress = (): SavedProgress => ({
  openBest: {},
  campaign: emptyCampaign(),
});

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadProgress(): SavedProgress {
  if (!canUseStorage()) return emptyProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as SavedProgress;
    if (!parsed.campaign || !parsed.openBest) return emptyProgress();
    return parsed;
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: SavedProgress): void {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  emit();
}

export function useProgress(): SavedProgress {
  return useSyncExternalStore(subscribeProgress, loadProgress, emptyProgress);
}

export function openCaseKey(dossierId: number, caseId: number): string {
  return `${dossierId}:${caseId}`;
}

export function recordOpenBest(
  dossierId: number,
  caseId: number,
  stars: number,
  elapsedSec: number,
): SavedProgress {
  const progress = loadProgress();
  const key = openCaseKey(dossierId, caseId);
  const prev = progress.openBest[key];
  if (!prev || stars > prev.stars || (stars === prev.stars && elapsedSec < prev.elapsedSec)) {
    progress.openBest[key] = { stars, elapsedSec };
    saveProgress(progress);
  }
  return loadProgress();
}

export function startCampaign(): SavedProgress {
  const progress = loadProgress();
  progress.campaign = {
    status: "in_progress",
    nextIndex: 0,
    badgesLeft: 2,
    badgesUsed: 0,
    results: [],
  };
  saveProgress(progress);
  return progress;
}

export function recordCampaignCase(
  dossierId: number,
  stars: number,
  elapsedSec: number,
  skipped: boolean,
): SavedProgress {
  const progress = loadProgress();
  const campaign = progress.campaign;
  campaign.results = [
    ...campaign.results.filter((r) => r.dossierId !== dossierId),
    { dossierId, stars, elapsedSec: skipped ? null : elapsedSec, skipped },
  ];
  campaign.nextIndex = Math.min(
    campaign.nextIndex + 1,
    CAMPAIGN_DOSSIER_IDS.length,
  );

  if (campaign.nextIndex >= CAMPAIGN_DOSSIER_IDS.length) {
    campaign.status = "completed";
  } else {
    campaign.status = "in_progress";
  }
  saveProgress(progress);
  return loadProgress();
}

export function spendBadgeAndSkip(dossierId: number): SavedProgress {
  const progress = loadProgress();
  const campaign = progress.campaign;
  if (campaign.badgesLeft <= 0) return progress;
  campaign.badgesLeft -= 1;
  campaign.badgesUsed += 1;
  return recordCampaignCase(dossierId, 0, 0, true);
}

export function failCampaign(): SavedProgress {
  const progress = loadProgress();
  progress.campaign.status = "failed";
  saveProgress(progress);
  return progress;
}

export function resetCampaign(): SavedProgress {
  const progress = loadProgress();
  progress.campaign = emptyCampaign();
  saveProgress(progress);
  return progress;
}

export function campaignTotals(campaign: CampaignProgress): {
  stars: number;
  score: number;
  rank: Rank;
} {
  const stars = campaign.results.reduce((a, r) => a + r.stars, 0);
  const score = campaignScore(
    campaign.results.map((r) => r.stars),
    campaign.badgesUsed,
  );
  return { stars, score, rank: rankForScore(score) };
}

export function currentCampaignDossierId(
  campaign: CampaignProgress,
): number | null {
  if (campaign.status !== "in_progress") return null;
  return CAMPAIGN_DOSSIER_IDS[campaign.nextIndex] ?? null;
}
