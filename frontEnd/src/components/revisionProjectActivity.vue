<template>
  <div>
    <v-layout row >
      <v-flex >
        <v-card > 
          <v-toolbar color="cyan" dark>
            <v-toolbar-title>Recent activity</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-list two-line  style="max-height: 400px"
       class="scroll-y" >
            <template v-for="(item,index) in computedActivity" >
              <v-list-tile  :key="item.id">
                <v-list-tile-avatar >
                  <img :src=" 'https://api.adorable.io/avatars/285/'+item.userId+'@adorable.png' ">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.revisionComment"></v-list-tile-title>
                  <v-list-tile-sub-title > {{item.project.name}}  </v-list-tile-sub-title>
                <v-list-tile-sub-title > 
                   <span class="text-lg-left">{{item.user.computerName}}</span>
                    <span style="float:right;">    {{item.dateTime}}</span>

                    </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider v-bind:class="'projectDivider'" :key="index" :inset="true" v-bind:style="{ borderColor: item.user.color}"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["activity", "users", "projects"],
  data: () => ({}),
  methods: {},
  computed: {
    computedActivity() {
        let newList = []
        for (let item of this.activity){            
            item.user = this.users.find(x => x.id === item.userId)? this.users.find(x => x.id === item.userId): {computerName : 'unknown'}
            item.project = this.projects.find(x => x.id === item.projectId)? this.projects.find(x => x.id === item.projectId) : {color: '#000000' , name : 'unknown Project'}
            newList.push(item)
        }

        return newList

    }
  }
};
</script>

<style>
.projectDivider {
   border-width: 2px;

  }
</style>