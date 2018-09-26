<template>
  <div id="app">
   <!-- <div>
      <label>token</label><input v-model="token"/>
    </div>-->
    <div>
      <input v-model="keyword" @keyup.enter="search(keyword)">
      <button @click="search(keyword)">搜索</button>
    </div>
    <div>
      <div class="repository" v-if="repository"
           v-for="(item, index) in repository" :key="index">
        <div>
          <a class="repository__name" :href="item.projectsUrl">{{item.nameWithOwner}}</a>
        </div>
        <div class="repository__desc">{{item.description}}</div>
        <div>
          <span class="repository__license" v-if="item.licenseInfo">{{item.licenseInfo.name}}</span>
          <span class="repository__time">update on {{item.updatedAt}}</span>
        </div>
      </div>
    </div>
    <div>
      <button v-show="pageInfo && pageInfo.hasPreviousPage"
              @click="pre">上一页</button>
      <button v-show="pageInfo && pageInfo.hasNextPage"
              @click="next">下一页</button>
    </div>
  </div>
</template>

<script>
import {search} from './graphql/index.js'
export default {
  name: 'app',
  data () {
    return {
      keyword: null,
      result: null
    }
  },
  computed: {
    repository: function () {
      if (this.result) return this.result.nodes
    },
    pageInfo: function () {
      if (this.result) return this.result.pageInfo
    }
  },
  methods: {
    search (keyword) {
      // console.log(keyword)
      search({'keyword': keyword, 'first': 10}).then(res => {
        // console.log(res.data.search)
        this.result = res.data.search
      })
    },
    pre () {
      search({'keyword': this.keyword, 'last': 10, 'before': this.pageInfo.startCursor}).then(res => {
        this.result = res.data.search
      })
    },
    next () {
      search({'keyword': this.keyword, 'first': 10, 'after': this.pageInfo.endCursor}).then(res => {
        this.result = res.data.search
      })
    }
  },
  created () {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
<style scoped>
  .repository{
    text-align: left;
    border-bottom: 1px solid #eee;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    font-size: 12px;
    color: #586069;
  }
  .repository__name{
    font-weight: 600;
    font-size: 20px;
    color: #0366d6;
  }
  .repository__desc{
    font-size: 14px;
    margin-bottom: 8px;
  }
  .repository__time{
    display: inline-block;

  }
  .repository__license{
    display: inline-block;
    margin-top: 8px;
    margin-right: 16px;
  }
</style>
