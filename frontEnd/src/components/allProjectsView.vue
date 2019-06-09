<template>
  <section>
    <v-toolbar color="cyan" dark>
      <v-toolbar-title>Projects</v-toolbar-title>
    </v-toolbar>
    <div v-for="(project) in projects" :key="project.id">
      <projectView :projectId="project.id" :users="users" :projects="projects"/>
    </div>
  </section>
</template>

<script>
import projectView from "./projectView";

const axios = require("axios");
export default {
  components: {
    projectView
  },
  props: ["users", "projects"],
  data: () => ({})
};
</script>
