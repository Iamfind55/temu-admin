import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  // ApolloLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookies from "js-cookie";

const createApolloClient = () => {
  // HTTP link for queries and mutations
  const httpLink = new HttpLink({
    // uri: "http://localhost:9091/graphql",
    uri: "https://api.temustores.shop/graphql"
  });

  // WebSocket link for subscriptions
  const wsLink = new GraphQLWsLink(
    createClient({
      // url: "ws://localhost:9091/graphql",
      url: "wss://api.temustores.shop/graphql",
      connectionParams: () => ({
        Authorization: Cookies.get("auth_token") || "",
      }),
    })
  );

  // Middleware for setting Authorization headers
  const authLink = setContext((_, { headers }) => {
    const token = Cookies.get("auth_token");
    return {
      headers: {
        ...headers,
        Authorization: token ? token : "",
      },
    };
  });

  // Use WebSocket for subscriptions, HTTP for queries/mutations
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      addTypename: false,
    }),
  });
};

export default createApolloClient;

