import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, from } from 'apollo-link'
const token = '598ffa46592d1c7f57ccf8173e47290c6db0d549'

const Middleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  console.log('Middleware', operation, forward)
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
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
const cache = new InMemoryCache()
export default new ApolloClient({
  link: from([Middleware, Afterware, errorLink, httpLink]),
  cache
})
