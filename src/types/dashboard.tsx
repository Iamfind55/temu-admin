export interface DashboardData {
  total: number;
  increase: number;
}

export interface DashboardError {
  message: string;
  code: string;
  details?: string;
}

export interface DashboardResponse {
  success: boolean;
  data?: DashboardData;
  error?: DashboardError;
}

export interface AdminGetProductDashboardResponse {
  adminGetProductDashboard: DashboardResponse;
  adminGetTotalCanceledOrderDashboard: DashboardResponse;
  adminGetTotalIncomeDashboard: DashboardResponse;
  adminGetTotalOrderDashboard: DashboardResponse;
  adminGetTotalNewOrderDashboard: DashboardResponse;
  adminGetTotalTodayIncomeDashboard: DashboardResponse;
  adminGetIllegalOperationDashboard: DashboardResponse;
}
