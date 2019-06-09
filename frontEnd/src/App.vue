<template>
  <v-app>
    <v-toolbar
    color="cyan"
      dark >
      <v-toolbar-title class="headline text-uppercase">
        <span>Tia Multie User Server</span>
        
        <span class="font-weight-light px-2">Dashboard</span>
      </v-toolbar-title>
    </v-toolbar>
  
    <v-content>
      <v-container fluid>
      <generalServerView :users = "users" :projects = "projects"/>
      <allProjectsView  :users = "users" :projects = "projects"/>
      <allUsersView  :users = "users" :projects = "projects"/>
       
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import generalServerView from './components/generalServerView'
import allUsersView from './components/allUsersView'
import allProjectsView from './components/allProjectsView'
const axios = require ('axios')
export default {
  name: 'App',
  components: {
    generalServerView,
    allUsersView,
    allProjectsView


  },
  data () {
    return {
      users : [],
      projects : []
    }
  },
  methods : {

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
  },
    mounted() {
    this.getUsers()
    this.getProjects()
  },

}
</script>
