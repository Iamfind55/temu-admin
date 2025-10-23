import { IBaseType } from "./base";

export interface ILogisticType extends IBaseType {
  id: string;
  company_name: string;
  logo: string;
  cost: number;
  transport_modes: string[];
}