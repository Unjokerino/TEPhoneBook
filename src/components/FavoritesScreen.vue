<template>
  <v-container>
    <div class="search-container">
      <v-expansion-panels flat hover>
        <v-row>
          <v-col v-for="user in users" :key="user.id" cols="12" sm="12" :xl="12" lg="6" md="12">
            <UserCard :user="user" />
            {{users}}
          </v-col>
        </v-row>
        <div class="text-center">
          <v-progress-circular
            style="flex:1;margin-top:30px"
            v-if="showLoader"
            :size="70"
            :width="4"
            color="primary"
            indeterminate
          />
        </div>
      </v-expansion-panels>
    </div>
  </v-container>
</template>

<script>
import "../css/index.css";
import UserCard from "./UserCard";

export default {
  name: "FavoritesScreen",
  components: {
    UserCard,
  },
  mounted() {
    this.getFavorites();
  },
  data: () => ({
    users: [],
    showLoader: false,
  }),
  methods: {
    getFavorites() {
      if (localStorage.favorites) {
        this.showLoader = true;
        let favorites = JSON.parse(localStorage.favorites);
        favorites.forEach((element) => {
          fetch(
            `http://trs-msu-test/phonebook/users/getUsers.php?user_id=${element}`
          )
            .then((response) => {
              response.json((json) => {
                this.users.push(json[0]);
                this.showLoader = false;
              });
            })
            .catch((this.showLoader = false));
        });
      }
    },
  },
};
</script>

<style>
</style>