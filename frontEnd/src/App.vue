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
      <revisionChart/>
    </v-content>
  </v-app>
</template>

<script>
import revisionChart from './components/revisionChart'

export default {
  name: 'App',
  components: {
    revisionChart
  },
  data () {
    return {
      //
    }
  }
}
</script>
