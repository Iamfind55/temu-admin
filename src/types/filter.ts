export interface FilterState {
  page: number;
  offset: number;
  sort_by: string;
  order_by: string;
  start_date: string;
  end_date: string;
  filter: FilterType | null;
}

export interface FilterType {
  search: string;
  status: string;
}

export interface CreatedAtBetween {
  startDate: string | null;
  endDate: string | null;
}

export interface IFilter {
  limit: number;
  page: number;
  coin_type?: string | null;
  identifier?: string | null;
  sort_by?: string | null;
  shop_vip?: string | null;
  status?: string | null;
  keyword?: string | null;
  price_between?: [number, number] | null;
  createdAtBetween: CreatedAtBetween;
}

export interface IProductFilter {
  limit: number;
  page: number;
  shop_id?: string | null;
  keyword?: string | null;
}
