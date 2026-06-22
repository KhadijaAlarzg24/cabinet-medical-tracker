interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string;
  order: number;
  columnId?: string;
}

interface Column {
  _id: string;
  name: string;
  order: number;
  patients: Patient[];
}

interface Board {
  _id: string;
  name: string;
  columns: Column[];
}