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

const EMPTY_CAMPAIGN: CampaignProgress = {
  status: "idle",
  nextIndex: 0,
  badgesLeft: 2,
  badgesUsed: 0,
  results: [],
};

const EMPTY_PROGRESS: SavedProgress = {
  openBest: {},
  campaign: EMPTY_CAMPAIGN,
};

export function emptyProgress(): SavedProgress {
  return EMPTY_PROGRESS;
}

function copyProgress(progress: SavedProgress): SavedProgress {
  return {
    openBest: { ...progress.openBest },
    campaign: {
      ...progress.campaign,
      results: [...progress.campaign.results],
    },
  };
}

function parseProgress(raw: string | null): SavedProgress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const parsed = JSON.parse(raw) as SavedProgress;
    if (!parsed.campaign || !parsed.openBest) return EMPTY_PROGRESS;
    return parsed;
  } catch {
    return EMPTY_PROGRESS;
  }
}

let cachedRaw: string | null = null;
let cachedProgress: SavedProgress = EMPTY_PROGRESS;
let hasClientSnapshot = false;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadProgress(): SavedProgress {
  if (!canUseStorage()) return EMPTY_PROGRESS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (hasClientSnapshot && raw === cachedRaw) return cachedProgress;
  hasClientSnapshot = true;
  cachedRaw = raw;
  cachedProgress = parseProgress(raw);
  return cachedProgress;
}

export function saveProgress(progress: SavedProgress): void {
  if (!canUseStorage()) return;
  const raw = JSON.stringify(progress);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedProgress = progress;
  hasClientSnapshot = true;
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
  const progress = copyProgress(loadProgress());
  const key = openCaseKey(dossierId, caseId);
  const prev = progress.openBest[key];
  if (!prev || stars > prev.stars || (stars === prev.stars && elapsedSec < prev.elapsedSec)) {
    progress.openBest[key] = { stars, elapsedSec };
    saveProgress(progress);
  }
  return loadProgress();
}

export function startCampaign(): SavedProgress {
  const progress = copyProgress(loadProgress());
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
  const progress = copyProgress(loadProgress());
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
  const progress = copyProgress(loadProgress());
  if (progress.campaign.badgesLeft <= 0) return progress;
  progress.campaign.badgesLeft -= 1;
  progress.campaign.badgesUsed += 1;
  saveProgress(progress);
  return recordCampaignCase(dossierId, 0, 0, true);
}

export function failCampaign(): SavedProgress {
  const progress = copyProgress(loadProgress());
  progress.campaign.status = "failed";
  saveProgress(progress);
  return progress;
}

export function resetCampaign(): SavedProgress {
  const progress = copyProgress(loadProgress());
  progress.campaign = {
    status: "idle",
    nextIndex: 0,
    badgesLeft: 2,
    badgesUsed: 0,
    results: [],
  };
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
