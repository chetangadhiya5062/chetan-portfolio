/** GitHub display config. Edit these lists to change what shows under "More work". */
export const GITHUB_USER = "chetangadhiya5062";
/** Older account; its public repos are merged into "More work". */
export const SECONDARY_USERS = ["ChetanGadhiya017"];

/** Featured repos (owner/name). They are shown as big cards from src/content/projects.ts. */
export const FEATURED_REPOS = [
  "chetangadhiya5062/open-env-nuclei",
  "chetangadhiya5062/autonomous_mail",
  "chetangadhiya5062/NeuroFlow-AI",
  "chetangadhiya5062/misinformation_ai",
];

/** Repo names hidden from "More work" (case-insensitive). Forks are hidden automatically. */
export const HIDDEN_REPOS = [
  "Jay_Swaminarayan",
  "chetangadhiya5062",
  "youtube_video-audio_downloader_Claude",
];

/** Also hidden when the repo name matches any pattern. */
export const HIDDEN_PATTERNS: RegExp[] = [/-submission$/i, /\.py$/i];
