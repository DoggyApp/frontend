export interface Room {
  id: number;
  name: string;
  location?: {
    id: number;
    name: string;
    address: string;
  };
}
