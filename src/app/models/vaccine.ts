export interface Vaccine {
  id: number;
  name: string;
  vaccinatedDate: string;  // "YYYY-MM-DD"
  expirationDate: string;  // "YYYY-MM-DD"
  required: boolean;       // true = Bordetella / Rabies — cannot be deleted
}
