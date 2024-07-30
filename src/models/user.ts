export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  customerId?: string;
  priceId?: string;
  hasAccess: boolean;
}
