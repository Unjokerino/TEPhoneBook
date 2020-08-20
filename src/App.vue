<template>
  <v-app  id="inspire">
    <v-app-bar color="background" flat app>
      <v-app-bar-nav-icon class="drawer_icon" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/TElogo.png"
          transition="scale-transition"
          width="100"
        />
      </div>
       
      <router-link class="menu_item" v-if="$route.path !== '/'" to="/">
        <v-btn text>
          <span class="mr-2">Главная</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </router-link>
      <router-link class="menu_item" v-else to="/orgstructure">
        <v-btn text>
          <span class="mr-2">Орг.структура</span>
          <v-icon>mdi-sitemap</v-icon>
        </v-btn>
      </router-link>

      <router-link class="menu_item" to="/favorites">
        <v-btn text>
          <span class="mr-2">Избранное</span>
          <v-icon>mdi-star-outline</v-icon>
        </v-btn>
      </router-link>

      <v-spacer></v-spacer>
       <v-switch
          v-model="$vuetify.theme.dark"
          hide-details
          inset
          label="Темная тема"
        />
      <router-link class="menu_item" to="/about">
        <v-btn text>
          <span class="mr-2">Обратная связь</span>
          <v-icon>mdi-account-box</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>
    <v-navigation-drawer color="background" v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item v-if="$route.path === '/orgstructure'">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link to="/">
                <v-btn text>
                  <span class="mr-2">Главная</span>
                </v-btn>
              </router-link>
            </v-list-item-title>
          </v-list-item>
          <v-list-item v-if="$route.path === '/'">
            <v-list-item-icon>
              <v-icon>mdi-sitemap</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link to="/orgstructure">
                <v-btn text>
                  <span class="mr-2">Орг.структура</span>
                </v-btn>
              </router-link>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-star-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link to="/favorites">
                <v-btn text>
                  <span class="mr-2">Избранное</span>
                </v-btn>
              </router-link>
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account-box</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <router-link to="/about">
                <v-btn text>
                  <span class="mr-2">Обратная связь</span>
                </v-btn>
              </router-link>
            </v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-content :style="`background:${backgroundColor}`">
      
      <router-view color="primary"></router-view>
    </v-content>
    <v-footer color="background" padless>
      <v-row justify="center" no-gutters>
        <v-col class=" py-4 text-center" cols="12">
          {{ new Date().getFullYear() }} —
          <strong>Россети Тюмень</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import 'whatwg-fetch'
export default {
  name: "App",

  components: {},
  mounted() {
   
  },
  computed:{
    backgroundColor(){
      return this.$vuetify.theme.dark ? this.$vuetify.theme.themes.dark.background : this.$vuetify.theme.themes.light.background
    },
  },
  watch: {
    $route(val) {
      console.log(val);
    },
  },
  data: () => ({
    drawer: false,
  }),
};
</script>
