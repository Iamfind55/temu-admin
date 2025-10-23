"use client";

import React from "react";
import moment from "moment";
import { IFilter } from "@/types/filter";

// Define the type for actions
type Action =
  | { type: "page"; payload: number | 1 }
  | { type: "limit"; payload: number | 10 }
  | { type: "status"; payload: string | null }
  | { type: "sort_by"; payload: string | null }
  | { type: "shop_vip"; payload: string | null }
  | { type: "keyword"; payload: string | null }
  | { type: "created_at_start_date"; payload: string | null }
  | { type: "created_at_end_date"; payload: string | null };

// Initial state
const initialState: IFilter = {
  page: 1,
  limit: 10,
  status: null,
  sort_by: null,
  shop_vip: null,
  keyword: null,
  createdAtBetween: {
    startDate: null,
    endDate: null,
  },
};

const ACTION_TYPE = {
  PAGE: "page",
  LIMIT: "limit",
  STATUS: "status",
  SORT_BY: "sort_by",
  SHOP_VIP: "shop_vip",
  KEYWORD: "keyword",
  CREATED_AT_START_DATE: "created_at_start_date",
  CREATED_AT_END_DATE: "created_at_end_date",
} as const;

const reducer = (state: IFilter, action: Action): IFilter => {
  const startDate = moment(state.createdAtBetween.startDate);
  const endDate = moment(state.createdAtBetween.endDate);

  switch (action.type) {
    case ACTION_TYPE.CREATED_AT_START_DATE:
      return {
        ...state,
        createdAtBetween: {
          ...state.createdAtBetween,
          startDate: action.payload,
          ...(endDate.isValid() &&
            moment(action.payload).isAfter(endDate) && {
              endDate: action.payload,
            }),
          ...(!action.payload && {
            endDate: null,
          }),
        },
        ...(action.payload &&
          state.createdAtBetween.endDate && {
            page: 1,
          }),
      };

    case ACTION_TYPE.CREATED_AT_END_DATE:
      return {
        ...state,
        createdAtBetween: {
          ...state.createdAtBetween,
          endDate: action.payload,
          ...(startDate.isValid() &&
            startDate.isAfter(action.payload) && {
              startDate: action.payload,
            }),
          ...(!startDate.isValid() && {
            startDate: action.payload,
          }),
        },
        ...(action.payload &&
          state.createdAtBetween.startDate && {
            page: 1,
          }),
      };

    case ACTION_TYPE.LIMIT:
      return { ...state, limit: action.payload };

    case ACTION_TYPE.KEYWORD:
      return { ...state, keyword: action.payload || null, page: 1 };

    case ACTION_TYPE.STATUS:
      return { ...state, status: action.payload || null, page: 1 };

    case ACTION_TYPE.SORT_BY:
      return { ...state, sort_by: action.payload || null, page: 1 };

    case ACTION_TYPE.SHOP_VIP:
      return { ...state, shop_vip: action.payload || null, page: 1 };

    case ACTION_TYPE.PAGE:
      return { ...state, page: action.payload };

    default:
      return state;
  }
};

const useFilter = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const data = React.useMemo(() => {
    const startDate = moment(state.createdAtBetween.startDate);
    const endDate = moment(state.createdAtBetween.endDate);
    return {
      ...state,
      createdAtBetween: {
        ...state.createdAtBetween,
        startDate: startDate.isValid() ? startDate.format("YYYY-MM-DD") : null,
        endDate: endDate.isValid() ? endDate.format("YYYY-MM-DD") : null,
      },
    };
  }, [state]);

  return {
    state,
    data,
    dispatch,
    ACTION_TYPE,
  };
};

export default useFilter;
