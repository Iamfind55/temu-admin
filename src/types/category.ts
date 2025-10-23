export interface ICategoryTypes {
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
  parent_id: string;
  parent_data: ICategoryTypes;
}

export interface CategoryFormData {
  id?: string;
  name: { [key: string]: string };
  image: string | null;
  parent_id: string | null;
  recommended: boolean;
  status?: string;
}
