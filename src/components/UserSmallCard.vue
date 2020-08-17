<template>
  <v-card @click="dialog = true" flat class="user-card__small">
    <div style="display:flex">
      <div class="__status"></div>
      <div class="__avatar">
        <div v-if="user.photo" v-html="user.photo"/>
        <img v-else src="../assets/avatar.jpg" alt />
      </div>
    </div>
    <div class="__main-info">
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title ><b>{{user.name}}</b></v-list-item-title>
          <v-list-item-title class="d-flex flex-wrap"> 
            <span>{{user.title}}</span>
            <a :href="`tel+:${user.phone}`">{{user.phone && ' | ' + user.phone}}</a>
            <a :href="`mailto:${user.email}`">
              {{user.email && ' | ' + user.email}} 
            </a>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
     <v-dialog v-model="dialog" max-width="800">
      <v-card class="mx-auto">
        <v-row class="mx-0">
          <v-col class="flex-column">
            <v-img
              class="align-self-center pa-2"
              src="../assets/avatar.jpg"
              aspect-ratio="1.5"
            ></v-img>
          </v-col>
          <v-col>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline" v-html="user.name" />
                <v-list-item-subtitle v-html="user.title" />
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <v-row align="center">
                <v-col cols="6">
                  <router-link
                    v-for="(subdivision, index) in user.subdivision"
                    :key="index"
                    :to="'/orgstructure/'+subdivision.id"
                  >
                    <span v-html="subdivision.name" />
                  </router-link>
                </v-col>
              </v-row>
            </v-card-text>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false" text>Закрыть</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import "../css/userCard.css";

export default {
  name: "UserCard",
  props: {
    user: Object
  },
  data: () => ({
    dialog:false,
  }),
  methods: {
    
  },
  mounted(){
  
  }
};
</script>
