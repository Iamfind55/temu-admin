export interface IBannerTypes {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  name: string;
  status: string;
  image: string;
  link_url: string;
  position: string;
}

export interface IBannerFormData {
  id?: string;
  name: string;
  image: string | null;
  status?: string;
  link_url: string;
  position: string;
}
