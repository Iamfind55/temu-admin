import { gql } from "@apollo/client";

export const QUERY_ADMIN_DASHBOARD = gql`
  query AdminGetProductDashboard {
    adminGetProductDashboard {
      success
      data {
        increase
        total
      }
      error {
        message
        code
        details
      }
    }
    adminGetTotalCanceledOrderDashboard {
      success
      data {
        total
        increase
      }
      error {
        message
        code
        details
      }
    }
    adminGetTotalIncomeDashboard {
      success
      data {
        total
        increase
      }
      error {
        message
        code
        details
      }
    }
    adminGetTotalOrderDashboard {
      success
      data {
        total
        increase
      }
      error {
        message
        code
        details
      }
    }
    adminGetTotalNewOrderDashboard {
      success
      data {
        total
        increase
      }
      error {
        message
        code
        details
      }
    }
    adminGetTotalTodayIncomeDashboard {
      success
      data {
        total
        increase
      }
      error {
        message
        code
        details
      }
    }
    adminGetIllegalOperationDashboard {
      success
      data {
        total
        increase
      }
      error {
        message
        code
        details
      }
    }
  }
`;
