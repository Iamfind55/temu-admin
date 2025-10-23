"use client";

import React from "react";
import { useDispatch } from "react-redux";

import Dashboard from "./dashboard/page";
import { clearAllAmounts } from "@/redux/slice/amountSlice";

export default function Home() {
  const dispatch = useDispatch();
  return (
    <div>
      <Dashboard />
      <button onClick={() => dispatch(clearAllAmounts())}>Clear All</button>
    </div>
  );
}
