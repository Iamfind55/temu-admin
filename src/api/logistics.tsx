import { gql } from "@apollo/client";

export const CREATE_LOGISTICS = gql`
  mutation CreateLogistics($data: CreateLogisticsInput!) {
  createLogistics(data: $data) {
    data {
      id
      company_name
      logo
      cost
      transport_modes
      status
      created_by
      created_at
      updated_at
    }
    success
    error {
      message
      details
      code
    }
  }
}
`;

export const UPLOAD_LOGISTICS = gql`
mutation UpdateLogictics($updateLogicticsId: ID!, $data: UpdateLogisticsInput!) {
  updateLogictics(id: $updateLogicticsId, data: $data) {
    data {
      id
      company_name
      logo
      cost
      transport_modes
      status
      created_by
      created_at
      updated_at
    }
    success
  error {
    code
    message
    details
  }
  }
}
`

export const QUERY_LOGISTICS = gql`
query GetLogistics($where: LogisticsWhereInput, $sortedBy: BaseOrderByInput) {
  getLogistics(where: $where, sortedBy: $sortedBy) {
    success
    total
    data {
      id
      status
      logo
      company_name
      cost
      transport_modes
      created_at
    }
  }
}`

export const QUERY_LOGISTIC = gql`
query GetLogistic($getLogisticId: ID!) {
  getLogistic(id: $getLogisticId) {
    success
    data {
      id
      company_name
      logo
      cost
      transport_modes
      status
      created_by
      created_at
      updated_at
    }
  }
}`