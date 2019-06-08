<template>
  <v-app>
    <v-toolbar
    color="cyan"
      dark app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Tia Multie User Server</span>
        
        <span class="font-weight-light px-2">Dashboard</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <generalServerView/>
    </v-content>
  </v-app>
</template>

<script>
import generalServerView from './components/generalServerView'

export default {
  name: 'App',
  components: {
    generalServerView
  },
  data () {
    return {
      //
    }
  }
}
</script>
