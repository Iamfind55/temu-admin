"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "../../apollo-client";

const ApolloClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const client = createApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientWrapper;
