<template>

    <v-card >
          <v-card-title>
      <span class="title font-weight-light">Server</span>
    </v-card-title>
    <v-layout row wrap style="max-height:500px">
         <v-flex xs7>
  <revisionChart :charData = "generalCharData"/>
   </v-flex>
    <v-flex xs5>
  <revisionActivity :activity = "generalActivity" :users = "users" :projects = "projects"/>
   </v-flex>
  </v-layout>
   </v-card>

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
    props: [ "users", "projects"],
    data: () => ({
    generalCharData: [],
    generalActivity:[],


  }),
  methods: {
    getGeneralChatData(){
      axios
      .get('/api/revisions/chart')
      .then(response => {
        this.generalCharData = response.data
               })
    },
    getGeneralActivity(){
      axios
      .get('/api/revisions/activity?limit=50')
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
  },

  }
</script>
