export const colors = {
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  onPrimary: '#FFFFFF',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  danger: '#DC2626',
  dangerSurface: '#FEF2F2',
  success: '#16A34A',
  successSurface: '#ECFDF3',
  warning: '#D97706',
  warningSurface: '#FFFBEB',
  disabled: '#94A3B8',
  overlay: 'rgba(15, 23, 42, 0.45)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
} as const;

export type SpacingToken = keyof typeof spacing;
export type TypographyVariant = keyof typeof typography;
