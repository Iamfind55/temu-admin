import { IDoctorTypes } from "./doctor";

export interface IScheduleTypes {
  id?: string;
  resource?: any;
  status?: string;
  created_at?: string;
  updated_at?: string;
  createdBy?: string;
  isAvailable?: boolean;
  date?: string;
  startTime?: string;
  endTime?: string;
  start?: Date; // Required by react-big-calendar
  end?: Date; // Required by react-big-calendar
  times: Array<{
    startTime: string;
    endTime: string;
  }>;
  doctor?: IDoctorTypes;
}

export interface ScheduleFilterState {
  order_by: string;
  start_date: Date | string;
  end_date: Date | string;
  filter: FilterType | null;
}

export interface FilterType {
  search: string;
  status: string;
}
