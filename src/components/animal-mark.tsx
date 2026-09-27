import type { Suspect } from "@/lib/game";

type Props = {
  suspect: Suspect;
  size?: number;
};

export function AnimalMark({ suspect, size = 72 }: Props) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 72 72"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="36" cy="36" r="34" fill={suspect.hue} opacity="0.18" />
      <circle
        cx="36"
        cy="36"
        r="33"
        fill="none"
        stroke={suspect.hue}
        strokeWidth="1.5"
      />
      {markPath(suspect.mark, suspect.hue)}
    </svg>
  );
}

function markPath(mark: string, hue: string) {
  switch (mark) {
    case "lince":
      return (
        <g fill={hue} stroke={hue} strokeLinejoin="round">
          <polygon points="22,48 36,18 50,48" fillOpacity="0.9" />
          <polygon points="24,22 18,10 30,20" />
          <polygon points="48,22 54,10 42,20" />
          <circle cx="31" cy="34" r="2.2" fill="#f4efe4" />
          <circle cx="41" cy="34" r="2.2" fill="#f4efe4" />
        </g>
      );
    case "cisne":
      return (
        <g fill="none" stroke={hue} strokeWidth="3" strokeLinecap="round">
          <path d="M18 46c8 8 28 8 36-2" />
          <path d="M44 28c0-10 10-14 14-8-8 2-8 10-4 16" />
          <circle cx="56" cy="20" r="2" fill={hue} stroke="none" />
        </g>
      );
    case "toro":
      return (
        <g fill={hue} stroke={hue} strokeLinejoin="round">
          <rect x="22" y="28" width="28" height="22" rx="8" />
          <path d="M18 20c-8-8 2-16 10-6" fill="none" strokeWidth="3" />
          <path d="M54 20c8-8-2-16-10-6" fill="none" strokeWidth="3" />
          <circle cx="30" cy="38" r="2" fill="#f4efe4" />
          <circle cx="42" cy="38" r="2" fill="#f4efe4" />
        </g>
      );
    case "nutria":
      return (
        <g fill={hue}>
          <ellipse cx="38" cy="38" rx="22" ry="12" />
          <ellipse cx="18" cy="32" rx="10" ry="8" />
          <circle cx="14" cy="30" r="1.8" fill="#f4efe4" />
          <path d="M56 38c8 0 12 8 6 12" fill="none" stroke={hue} strokeWidth="3" />
        </g>
      );
    case "nandu":
      return (
        <g fill="none" stroke={hue} strokeWidth="3" strokeLinecap="round">
          <circle cx="36" cy="22" r="7" fill={hue} stroke="none" />
          <path d="M36 29v14" />
          <path d="M36 43l-10 16" />
          <path d="M36 43l10 16" />
          <path d="M24 34h24" />
        </g>
      );
    case "gavilan":
      return (
        <g fill={hue} stroke={hue} strokeLinejoin="round">
          <polygon points="36,18 58,46 36,38 14,46" />
          <polygon points="36,38 40,54 32,54" />
        </g>
      );
    case "tapir":
      return (
        <g fill={hue}>
          <ellipse cx="40" cy="38" rx="18" ry="14" />
          <rect x="12" y="34" width="18" height="8" rx="4" />
          <circle cx="48" cy="34" r="2" fill="#f4efe4" />
          <path d="M32 50v8M46 50v8" stroke={hue} strokeWidth="3" />
        </g>
      );
    default:
      return <circle cx="36" cy="36" r="12" fill={hue} />;
  }
}
