export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const PropertyStatus = {
  FOR_SALE: 'FOR_SALE',
  FOR_RENT: 'FOR_RENT'
} as const;
export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];
export const Garden = {
  FRONT: 'FRONT',
  BACK: 'BACK',
  BOTH: 'BOTH',
  SIDE: 'SIDE'
} as const;
export type Garden = (typeof Garden)[keyof typeof Garden];
