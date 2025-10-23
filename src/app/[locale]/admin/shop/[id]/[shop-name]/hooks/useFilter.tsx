"use client";

import React from "react";
import { IProductFilter } from "@/types/filter";

// Define the type for actions
type Action =
  | { type: "page"; payload: number | 1 }
  | { type: "limit"; payload: number | 10 }
  | { type: "shop_id"; payload: string | null }
  | { type: "keyword"; payload: string | null };

// Initial state
const initialState: IProductFilter = {
  page: 1,
  limit: 10,
  shop_id: null,
  keyword: null,
};

const ACTION_TYPE = {
  PAGE: "page",
  LIMIT: "limit",
  SHOP_ID: "shop_id",
  KEYWORD: "keyword",
} as const;

const reducer = (state: IProductFilter, action: Action): IProductFilter => {
  switch (action.type) {
    case ACTION_TYPE.LIMIT:
      return { ...state, limit: action.payload };

    case ACTION_TYPE.KEYWORD:
      return { ...state, keyword: action.payload || null, page: 1 };

    case ACTION_TYPE.SHOP_ID:
      return { ...state, shop_id: action.payload || null, page: 1 };

    case ACTION_TYPE.PAGE:
      return { ...state, page: action.payload };

    default:
      return state;
  }
};

const useFilter = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const data = React.useMemo(() => {
    return {
      ...state,
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
