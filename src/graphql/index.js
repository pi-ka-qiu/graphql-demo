import client from '../utils/graphql'
// import gql from 'graphql-tag'
import * as searchGql from './search.graphql'
/** searchGql模块 **/
export const search = (params) => client.query({query: searchGql.search, variables: params})
