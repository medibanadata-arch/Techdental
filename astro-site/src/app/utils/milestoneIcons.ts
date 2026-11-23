/**
 * Shared icon set for the "Doctor Milestones & Treatment Stats" cards.
 * Used by both the admin editor and the public doctor profile so the
 * dropdown preview always matches what visitors see.
 */
export type MilestoneIconOption = { value: string; label: string; icon: string };

export const MILESTONE_ICON_OPTIONS: MilestoneIconOption[] = [
  { value: 'tooth', label: 'Tooth / Filling', icon: 'fas fa-tooth' },
  { value: 'teeth', label: 'Teeth / Smile', icon: 'fas fa-teeth' },
  { value: 'bite', label: 'Bite / Braces', icon: 'fas fa-teeth-open' },
  { value: 'syringe', label: 'Root Canal / Injection', icon: 'fas fa-syringe' },
  { value: 'shine', label: 'Whitening / Cosmetic', icon: 'fas fa-wand-magic-sparkles' },
  { value: 'crown', label: 'Crown / Cap', icon: 'fas fa-crown' },
  { value: 'shield', label: 'Guard / Protection', icon: 'fas fa-shield-halved' },
  { value: 'doctor', label: 'Doctor / Consultant', icon: 'fas fa-user-doctor' },
  { value: 'implant', label: 'Implant / Tools', icon: 'fas fa-screwdriver-wrench' },
  { value: 'paint', label: 'Veneer / Polish', icon: 'fas fa-paintbrush' },
  { value: 'droplet', label: 'Scaling / Cleaning', icon: 'fas fa-droplet' },
  { value: 'gum', label: 'Gum / Health', icon: 'fas fa-heart-pulse' },
  { value: 'child', label: 'Kids / Pediatric', icon: 'fas fa-child' },
  { value: 'bone', label: 'Extraction / Surgery', icon: 'fas fa-bone' },
  { value: 'bridge', label: 'Bridge / Layers', icon: 'fas fa-layer-group' },
  { value: 'align', label: 'Alignment / Straightening', icon: 'fas fa-arrows-left-right-to-line' },
  { value: 'sparkle', label: 'Highlight / Others', icon: 'fas fa-star' },
  { value: 'check', label: 'Completed / Verified', icon: 'fas fa-circle-check' },
  { value: 'smile', label: 'Smile / Patient Care', icon: 'fas fa-face-smile' },
  { value: 'microscope', label: 'Lab / Precision', icon: 'fas fa-microscope' },
  { value: 'bolt', label: 'Fast / Painless', icon: 'fas fa-bolt' },
  { value: 'care', label: 'Gentle Care', icon: 'fas fa-hand-holding-medical' },
];

const ICON_MAP: Record<string, string> = MILESTONE_ICON_OPTIONS.reduce((acc, opt) => {
  acc[opt.value] = opt.icon;
  return acc;
}, {} as Record<string, string>);

/** Resolve an icon key (e.g. "syringe") to a Font Awesome class. */
export const milestoneIconClass = (key?: string): string => (key && ICON_MAP[key]) || 'fas fa-tooth';

/**
 * Suggest a related icon from the card's treatment label so cards never
 * all share the same tooth glyph.
 */
export const inferMilestoneIcon = (label?: string): string => {
  const s = (label || '').toLowerCase();

  if (/veneer|laminat/.test(s)) return 'paint';
  if (/root canal|rct|endodont|rotary/.test(s)) return 'syringe';
  if (/scaling|polish|clean|tartar|plaque/.test(s)) return 'droplet';
  if (/filling|restorat|composite/.test(s)) return 'tooth';
  if (/implant|prosthe/.test(s)) return 'implant';
  if (/crown|cap\b/.test(s)) return 'crown';
  if (/bridge/.test(s)) return 'bridge';
  if (/extract|surg|wisdom/.test(s)) return 'bone';
  if (/space maintainer/.test(s)) return 'shield';
  if (/aligner|invisalign/.test(s)) return 'align';
  if (/retainer/.test(s)) return 'shield';
  if (/ceramic|clear/.test(s)) return 'shine';
  if (/metal|traditional|self.?ligat/.test(s)) return 'bite';
  if (/straighten|alignment/.test(s)) return 'tooth';
  if (/brace|ortho/.test(s)) return 'bite';
  if (/kid|child|pediatric|paediatric|baby/.test(s)) return 'child';
  if (/whiten|bleach|laser|smile|cosmetic|aesthetic/.test(s)) return 'shine';
  if (/gum|perio/.test(s)) return 'gum';
  if (/patient|treatment|consult|care/.test(s)) return 'doctor';
  if (/painless|fast|quick/.test(s)) return 'bolt';
  if (/other|misc/.test(s)) return 'sparkle';

  return 'tooth';
};

/** Best icon class for a milestone, honouring an explicit choice first. */
export const milestoneIconFor = (icon?: string, label?: string): string =>
  milestoneIconClass(icon || inferMilestoneIcon(label));

const DENTAL_FALLBACKS = ['tooth', 'teeth', 'bite', 'align', 'shield', 'shine', 'crown', 'bridge', 'sparkle', 'check'];

/**
 * Icon keys for a whole card list. Cards that would resolve to the same icon
 * get a related alternative, so one profile never shows repeated glyphs.
 */
export const assignMilestoneIcons = (items: { icon?: string; label?: string }[]): string[] => {
  const used = new Set<string>();
  return items.map((ms, index) => {
    const preferred = ms.icon || inferMilestoneIcon(ms.label);
    if (!used.has(preferred)) {
      used.add(preferred);
      return preferred;
    }
    const pool = [preferred, ...DENTAL_FALLBACKS, ...MILESTONE_ICON_OPTIONS.map((o) => o.value)];
    for (let step = 1; step < pool.length; step++) {
      const key = pool[(index + step) % pool.length];
      if (!used.has(key)) {
        used.add(key);
        return key;
      }
    }
    used.add(preferred);
    return preferred;
  });
};
