import client from '../utils/graphql'
// import gql from 'graphql-tag'
import { searchR } from './search.graphql'
export const search = (params) => client.query({
  query: searchR,
  variables: params
})
