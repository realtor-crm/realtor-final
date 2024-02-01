import type { ColumnType } from 'kysely';
import type { Garden, PropertyStatus, Role } from './enums';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Address = {
  id: Generated<number>;
  postalCode: string;
  country: string;
  county: string;
  city: string;
  street: string;
  houseNumber: string;
  apartmentNumber: string | null;
  floor: number | null;
  landRegistryNumber: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type LandDetails = {
  id: Generated<number>;
  landArea: string;
  sillLevel: string;
  garden: Garden;
};
export type Pricing = {
  id: Generated<number>;
  askingPrice: string;
  deposit: string;
  utilities: string;
  hoaFees: string;
};
export type Property = {
  id: Generated<number>;
  public_id: string;
  name: string;
  description: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  addressId: number;
  propertyDetailsId: number | null;
  pricingId: number | null;
  landDetailsId: number | null;
};
export type PropertyDetails = {
  id: Generated<number>;
  livableArea: string;
};
export type User = {
  id: Generated<number>;
  public_id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  keycloakId: string;
};
export type DB = {
  Address: Address;
  LandDetails: LandDetails;
  Pricing: Pricing;
  Property: Property;
  PropertyDetails: PropertyDetails;
  User: User;
};
