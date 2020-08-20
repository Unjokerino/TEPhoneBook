<template>
  <v-card color="card" @click="openDialog" flat class="user-card__small">
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
            <span class="mx-1">|</span>
            <a :href="`tel+:${user.phone}`">{{user.phone && user.phone}}</a>
            <span class="mx-1">|</span>
            <a :href="`mailto:${user.email}`">
              {{user.email && user.email}} 
            </a>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
     <v-dialog v-model="dialog" max-width="1200">
      <v-card class="mx-auto">

        <UserDetailedCard :user="user"/>
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
import UserDetailedCard from './UserDetailedCard'
export default {
  name: "UserCard",
  props: {
    user: Object
  },
  components:{
    UserDetailedCard
  },
  data: () => ({
    dialog:false,
  }),
  methods: {
    openDialog(e){
      if(e.target.nodeName !== "A"){
        this.dialog = true
      }
    }
  },
  mounted(){
  
  }
};
</script>
