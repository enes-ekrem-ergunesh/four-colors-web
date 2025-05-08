export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  nationality: string | null;
  birthdate: string | null;
  gender: string | null;
  type: string | null;
}
