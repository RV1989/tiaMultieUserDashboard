<template>
<div>
    <v-card style="max-height:500px">
    <v-layout row wrap>
         <v-flex xs7>
  <revisionChart :charData = "generalCharData"/>
   </v-flex>
    <v-flex xs5>
  <revisionActivity :activity = "generalActivity" :users = "users" :projects = "projects"/>
   </v-flex>
  </v-layout>
   </v-card>
  </div>
</template>

<script>
  import revisionChart from './revisionChart'
  import revisionActivity from './revisionActivity'
const axios = require ('axios')
  export default {
    components: {
      revisionChart,
      revisionActivity
    },
    data: () => ({
    generalCharData: [],
    generalActivity:[],
    users :[],
    projects: []

  }),
  methods: {
    getGeneralChatData(){
      axios
      .get('/api/revisionsChart')
      .then(response => {
        this.generalCharData = response.data
               })
    },
    getGeneralActivity(){
      axios
      .get('/api/revisionsActivity')
      .then(response => {
          
        this.generalActivity = response.data
               })
    },
     getUsers(){
      axios
      .get('/api/users')
      .then(response => {
          
        this.users = response.data
               })
    },
      getProjects(){
      axios
      .get('/api/projects')
      .then(response => {
          
        this.projects = response.data
               })
    },
  }
    ,
    mounted() {
    this.getGeneralChatData()
    this.getGeneralActivity()
    this.getUsers()
    this.getProjects()
  },

  }
</script>
