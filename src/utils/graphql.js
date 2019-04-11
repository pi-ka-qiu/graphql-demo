import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link'

const token = 'b69064128b0940aa89399f9ff6edabd47980f73e'

const Middleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  console.log('Middleware', operation, forward)
  return forward(operation)
})
const Afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    console.log('Afterware--response', response)
    return response
  })
})
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: 'https://api.github.com/graphql', // 配置请求url
  headers: {                             // 配置header
    Authorization: `Bearer ${token}`
  }
})
const cache = new InMemoryCache() // 缓存
export default new ApolloClient({
  link: from([Middleware, Afterware, errorLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all'
    }
  }
})
