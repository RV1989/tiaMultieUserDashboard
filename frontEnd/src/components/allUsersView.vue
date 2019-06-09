<template>
<section>
<v-toolbar color="cyan" dark>
      <v-toolbar-title>Users</v-toolbar-title>
    </v-toolbar>
  <div v-for="(user) in users" :key="user.id">
        <userView :userId="user.id" :users="users" :projects="projects"/>
  </div>

  </section>

    

    

</template>

<script>
import userView from "./userView";

const axios = require("axios");
export default {
  components: {
    userView
  },
  props: ["users", "projects"],
  data: () => ({})
};
</script>
