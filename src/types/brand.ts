export interface IBrandingTypes {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  name: {
    name_en: string;
    name_la: string;
  };
  status: string;
  image: string;
}

export interface IBrandingFormData {
  id?: string;
  name: { [key: string]: string };
  image: string | null;
  status?: string;
}

export interface ILogisticsData {
  id: string;
  status: string;
  logo?: string;
  company_name: string;
  cost: number;
  transport_modes: string[];
  created_at: string;
}
