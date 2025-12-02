export interface ICategoryTypes {
  id: string;
  name: string;
  status: string;
  image: string;
  oring_image_url: string;

  created_at?: string;
  updated_at?: string;
  created_by?: string;

  parent_id?: string;
  parent_data?: ICategoryParent | null;

  subcategories?: ISubCategory[] | null;
}

export interface ICategoryParent {
  id: string;
  name?: string;
  image?: string;
  oring_image_url?: string;
}

export interface ISubCategory {
  id: string;
  name: string;
  image: string;
  oring_image_url: string;

  created_at?: string;
  parent_data?: ICategoryParent | null;

  subcategories?: ISubSubCategory[] | null;
}

export interface ISubSubCategory {
  id: string;
  name: string;
  image: string;
  oring_image_url: string;
}

export interface ICategoryResponse {
  getCategories: {
    data: ICategoryTypes[];
  };
}


export interface CategoryFormData {
  id?: string;
  name: string;
  image: string | null;
  parent_id: string | null;
  recommended: boolean;
  status?: string;
}
