<template>

    <v-card >
       <v-card-title>
      <span class="title font-weight-light">User: {{computedUser.computerName}} </span>
    </v-card-title>
    <v-divider v-bind:class="'projectDivider'" :key="index" :inset="false" v-bind:style="{ borderColor: computedUser.color}"></v-divider>
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
    props : ['userId', 'users' , 'projects'],
    data: () => ({
    generalCharData: [],
    generalActivity:[],

  }),
  computed: {
    computedUser() {
      return this.users.find(x => x.id == this.userId)? this.users.find(x => x.id == this.userId) : {color: '#000000' , computerName : 'unknown user'}
    }
    },
  methods: {
    getGeneralChatData(){
      axios
      .get(`/api/revisions/chart/user/${this.userId}`)
      .then(response => {
        this.generalCharData = response.data
               })
    },
    getGeneralActivity(){
      axios
      .get(`/api/revisions/activity/user/${this.userId}?limit=50`)
      .then(response => {
          
        this.generalActivity = response.data
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
