import { ErrorDetails } from "./base";

export interface IEmployee {
  id: string;
  dob: string;
  email: string;
  image: string;
  status: string;
  lastName: string;
  username: string;
  password: string;
  firstName: string;
  created_at: string;
}

export interface GetEmployeeResponse {
  getStaffs: {
    success: boolean;
    total: number;
    data: IEmployee[];
    error?: ErrorDetails;
  };
}
