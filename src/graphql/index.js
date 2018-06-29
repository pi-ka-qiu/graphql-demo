import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, from } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
const token = '598ffa46592d1c7f57ccf8173e47290c6db0d549'

const Middleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  console.log('Middleware', operation, forward)
  return forward(operation).map(response => {
    console.log('Middleware--response', response)
    return response
  })
})
const Afterware = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    console.log('Afterware--response', response)
    return response
  })
})
const httpLink = new HttpLink({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
const cache = new InMemoryCache()
export default new ApolloClient({
  link: from([Middleware, Afterware, httpLink]),
  cache
})
