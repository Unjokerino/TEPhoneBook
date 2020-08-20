<template >

  <v-container>
    <div class="search-container">
      <v-card color="background" flat id="searchBox"  class="sticky">
        <div class="search-container__input-cotnainer">
          <input
            @change="searchUser"
            v-model="searchQuery"
            autocomplete="on"
            name="search"
            class="search-container_search-input"
            placeholder="Поиск"
            type="search"
          />
          <input
            @click="searchUser"
            class="search-container_search-btn"
            type="button"
            value="Искать"
          />
        </div>
        <div class="search-container__tpo-select">
          <v-select
            class="align-center my-3"
            outlined
            
            return-object
            item-text="title"
            item-value="id"
            v-model="dep"
            dense
            :items="deps"
          />
          <div class="d-flex align-center">
            <v-icon
              style="height:fit-content"
              :size="row.size"
              v-for="row in serachRows"
              :color="row.title == serachRow.title ? 'primary' : ''"
              @click="() => setRows(row)"
              :key="row.title"
            >{{row.icon}}</v-icon>
          </div>
        </div>
      </v-card>

      <div v-if="showLoader" class="d-flex justify-center align-items-center">
        <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
      </div>

      <div v-else class="masonry-wrapper">
        <div class="masonry" :style="'columns:' + serachRow.title">
          <div v-for="(user,index) in users" :key="index" class="masonry-item">
           
            <div class="masonry-content">
              <UserCard
                :favorite="favorites.find(favorite => favorite === user.id) && true"
                :key="user.id"
                :user="user"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="text-center " v-show="showNothingFinded">
        Ничего не найдено :с
      </div>
    </div>
  </v-container>
</template>

<script>
import "../css/index.css";
import "../css/mansory.css";
import UserCard from "./UserCard";
//import userListTest from "../assets/userListTest.json";
import testDeps from "../assets/testDeps.json";
import testFavorites from "../assets/testFavorites.json";
import "whatwg-fetch";
export default {
  name: "HomeScreen",
  components: {
    UserCard,
  },
  watch: {
    dialog(val) {
      console.log(val);
    },
    dep(val) {
      val.id
        ? (this.params = `departament_id=${val.id}&param=1`)
        : (this.params = "");
      this.searchUser();
    },
  },
  computed: {
  
    cardWidth() {
      let row = this.serachRow;
      switch (row.title) {
        case "1":
          return 100;
        case "2":
          return 48;
        case "3":
          return 32;

        default:
          return 100;
      }
    },
  },
  mounted() {
    this.getMainData();

    document.addEventListener("scroll", () => {
      const searchBox = document.querySelector("#searchBox");

      if (searchBox.offsetTop > 12) {
        searchBox.classList.add("scrolled");
      } else {
        searchBox.classList.remove("scrolled");
      }
    });
  },
  data: () => ({
    params: "",
    showNothingFinded: false,
    userInfo: {},
    dep: { title: "Искать везде", id: undefined },
    deps: [{ title: "Искать везде", id: undefined }],
    serachRows: [
      { title: "3", value: 4, icon: "mdi-grid", size: 30 },
      { title: "2", value: 6, icon: "mdi-view-grid-outline", size: 32 },
      { title: "1", value: 12, icon: "mdi-view-list", size: 40 },
    ],
    searchQuery: "",
    serachRow: localStorage.serachRows
      ? JSON.parse(localStorage.serachRows)
      : { title: "1", value: 12 },
    users: [],
    showLoader: false,
    favorites: []
  }),

  methods: {
    async getMainData() {
      this.showLoader = true
      await this.getDepsList();
      await this.getUserInfo();
      await this.getUsers();
      this.showLoader = false 
    },
    onScroll(e) {
      console.log(e);
    },
    searchUser() {
      if (this.searchQuery) {
        this.showLoader = true;
        fetch(
          `http://trs-msu-test/phonebook/users/getUsers.php?${this.params}&search=${this.searchQuery}`
        ).then((response) => {
          response
            .json()
            .then((response_json) => {
              if(response_json.length > 0){
                 this.users = response_json;
                 this.showNothingFinded = false
              }else{
                this.users = []
                this.showNothingFinded = true
              }
             
              this.showLoader = false;
            })
            .catch((this.showLoader = false));
        });
      } else {
        this.getUsers();
      }
    },
    async getDepsList() {
      try {
        let response = await fetch(
          "http://trs-msu-test/phonebook/users/getDepsList.php",
          {
            method: "GET",
          }
        );
        let deps = await response.json();
        this.deps = [...this.deps, ...deps];
      } catch (error) {
        console.error(error);
        this.deps = [...this.deps, ...testDeps];
      }
    },

    async getUserInfo() {
      try {
        let response = await fetch(
          "http://trs-msu-test/phonebook/users/getInfo.php",
          {
            method: "GET",
          }
        );
        let json = await response.json();
        let user = json[0];
        let dep = this.deps.find((dep) => dep.id == user.departament_id);
        if (dep) {
          this.dep = dep;
        }
        this.userInfo = user;
        return user;
      } catch (error) {
        console.error(error)
      }
    },
    async getFavorites() {
      try {
        const response = await fetch(
          "http://trs-msu-test/phonebook/users/favorites.php"
        );
        const json = await response.json();
        this.favorites = json;
      } catch (error) {
        console.error(error);
      }
    },
    async getUsers() {
      const fd = new FormData();
      await this.getFavorites();
      fd.append("users_id", JSON.stringify(this.favorites));
      if (this.dep.id) {
        fd.append("departament_id", this.dep.id);
        fd.append("param", 1);
      }

      this.users = [];
      this.showLoader = true;
      fetch(`http://trs-msu-test/phonebook/users/getUsers.php?`, {
        method: "POST",
        body: fd,
      })
        .then((response) => {
          response
            .json()
            .then((response_json) => {
              this.users = response_json;
              this.showLoader = false;
            })
            .catch((this.showLoader = false));
        })
        .catch((e) => {
          console.log(123, e);
          this.users = testFavorites;
          this.showLoader = false;
        });
    },
    setRows(event) {
      this.serachRow = event;
      localStorage.serachRows = JSON.stringify(event);
    },
  },
};
</script>
