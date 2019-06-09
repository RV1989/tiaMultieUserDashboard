<template>

    <v-card >
      <v-card-title>
      <span class="title font-weight-light">{{computedProject.name}} </span>
    </v-card-title>
    <v-divider v-bind:class="'projectDivider'" :key="index" :inset="false" v-bind:style="{ borderColor: computedProject.color}"></v-divider>
    <v-layout row wrap style="max-height:500px">
         <v-flex xs7>
  <revisionProjectChart :charData = "generalCharData"/>
   </v-flex>
    <v-flex xs5>
  <revisionProjectActivity :activity = "generalActivity" :users = "users" :projects = "projects"/>
   </v-flex>
  </v-layout>
   </v-card>

</template>

<script>
  import revisionProjectChart from './revisionProjectChart'
  import revisionProjectActivity from './revisionProjectActivity'
const axios = require ('axios')
  export default {
    components: {
      revisionProjectChart,
      revisionProjectActivity
    },
    props : ['projectId' ,'users' , 'projects'],
    data: () => ({
    generalCharData: [],
    generalActivity:[],
  }),
   computed: {
    computedProject() {
      return this.projects.find(x => x.id == this.projectId)? this.projects.find(x => x.id == this.projectId) : {color: '#000000' , name : 'unknown Project'}
    }
    },
  methods: {
    getGeneralChatData(){
      axios
      .get(`/api/revisions/chart/project/${this.projectId}`)
      .then(response => {
        this.generalCharData = response.data
               })
    },
    getGeneralActivity(){
      axios
      .get(`/api/revisions/activity/project/${this.projectId}?limit=50`)
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
