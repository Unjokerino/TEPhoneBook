<template >
  <v-card color="card" :id="`user_${user.id}`" key="1" class="user-card">
    <div class="favorites">
      <v-btn
        icon
        @click="setFavorite"
        :color="favorite ? 'yellow darken-2' : 'blue-grey lighten-2'"
      >
        <v-icon size="32">mdi-star</v-icon>
      </v-btn>
    </div>
    <div class="user-card__expand-btn">
      <v-btn icon @click="changeExpandState">
        <v-icon size="32">{{expand ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
      </v-btn>
    </div>

    <div @click="getDepartment" :value="openPanel" class="user-card__header">
      <div class="user-card__avatar">
        <div class="user-card__status"></div>
        <div  v-if="user.photo" v-html="user.photo" class="user-card__avatar__photo">
        </div>
        <div v-else class="user-card__avatar__photo">
          <img  src="../assets/avatar.jpg" alt />
        </div>
      </div>
      <div class="user-card__main-info">
        <div v-show="absence" class="user-card__menu-header">
          <v-chip label color="primary">{{absence}}</v-chip>
        </div>

        <div class="user-card__main-info__menu">
          <div class="user-card__name text-subtitle-1">{{user.name}}</div>
          <div class="user-card__title text-subtitle-2">{{user.title}}</div>
          <div class="user-card__subdivision">
            <router-link
              target="_blank"
              v-if="user.subdivision.length > 0"
              :to="'/orgstructure/'+user.subdivision[1].id"
            >
              <span class="text-subtitle-1" v-html="user.subdivision[1].name" />
            </router-link>
            <span
              class="text-subtitle-2"
              v-if="user.subdivision.length > 0"
            >{{user.subdivision[0].name}}</span>
          </div>
          <div v-show="user.address" class="user-card__address text-subtitle-2">
            <span v-if="user.address">
              Офис:
              <router-link to>
                <span class="text-transform-capitilize" v-html="user.address" />
                <span>{{user.address && ','}} {{user.room}}</span>
              </router-link>
            </span>
          </div>
          <div v-show="user.phone || user.phone_internal " class="user-card__contacts_phone text-subtitle-2">
            <div class="d-flex flex-column">
              <div v-if="user.phone">
                <v-icon class="mr-3">mdi-phone-classic</v-icon>
                <a :href="'tel:+'+user.phone">{{user.phone}}</a>
              </div>
              <div v-if="user.phone_internal" class="my-1">
                <v-icon class="mr-3">mdi-phone</v-icon>
                <a :href="'tel:+'+user.phone_internal">{{user.phone_internal}}</a>
              </div>
            </div>
          </div>
          <div class="user-card__contacts_email text-subtitle-2">
            <div class="d-flex flex-column">
              <div v-if="user.mobile" class="my-1">
                <v-icon class="mr-3">mdi-cellphone</v-icon>
                <a :href="'tel:+'+user.mobile">{{user.mobile}}</a>
              </div>
              <div v-if="user.email">
                <v-icon class="mr-3">mdi-email</v-icon>
                <a :href="'mailto:'+user.email">{{user.email}}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="user-card__menu-footer"></div>
      </div>
    </div>
    <v-expand-transition>
      <div v-show="expand" class="user-card__content">
        <p class="text-h6 mt-2">Руководитель:</p>
 
        <v-skeleton-loader
          :loading="!chiefLoaded"
           color="card"
          type="list-item-avatar-two-line@1"
        > 
        <transition-group>
            <UserSmallCard :transition="transition" v-for="chief in chiefs" :key="chief.id" :user="chief" />
        </transition-group>
        </v-skeleton-loader>

        <p class="text-h6 mt-2">Коллеги:</p>
        <v-skeleton-loader
          :loading="!colleaguesLoaded"
          color="card"
          type="list-item-avatar-two-line@3"
        >
          <div class="user-card__colleagues">
              <UserSmallCard :transition="transition" v-for="colleague in colleagues" :absence="absence" :key="colleague.id" :user="colleague" />
          </div>
        </v-skeleton-loader>
        <v-card-actions>
          <v-btn @click.stop="dialog = true" text color="primary">Подробная информация</v-btn>
        </v-card-actions>
      </div>
    </v-expand-transition>
    <v-dialog v-model="dialog" max-width="1400">
      <v-card class="mx-auto">

        <UserDetailedCard :absence="absence" :chiefs="chiefs" :colleagues="colleagues" :user="user"/>
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
import UserSmallCard from "./UserSmallCard";
import "../css/mansory.css";
//import userListTest from "../assets/userListTest.json";
import UserDetailedCard from './UserDetailedCard'
export default {
  name: "UserCard",
  props: {
    user: Object,
    favorite:Boolean,
  },
  components: {
    UserSmallCard,
    UserDetailedCard
  },
  data: () => ({
    transition: "scale-transition",
    expand: false,
    absence: "",
    dialog: false,
    smallUserDialog: false,
    opened: [],
    openPanel: false,
    hasGotten: false,
    chiefs: [],
    colleaguesLoaded: false,
    chiefLoaded: false,
    colleagues: [],
  }),
  watch: {
    dialog(val) {
      console.log(val);
    },
  },
  mounted() {
    this.getFavorites();
    this.checkAbsences();
    //console.log(this.$route);
  },
  computed: {
    user_email() {
      let emailArr = this.user.email.split("-");

      return `${
        emailArr[0].charAt(0).toUpperCase() + emailArr[0].slice(1).toLowerCase()
      }-
              ${emailArr[1][0].toUpperCase() + emailArr[1][1].toUpperCase()}
              ${emailArr[1].slice(0, 2)}`;
    },
  },
  methods: {
    checkAbsences() {
      let result = "";
      if (this.user.absences) {
        this.user.absences.forEach((element) => {
          let dateStart = element.DateStartAbsence.split(".");
          dateStart = `${dateStart[1]}.${dateStart[0]}.${dateStart[2]}`;
          dateStart = new Date(dateStart);
          let dateFinish = element.DateFinishAbsence.split(".");
          dateFinish = `${dateFinish[1]}.${dateFinish[0]}.${dateFinish[2]}`;
          dateFinish = new Date(dateFinish);
          let today = new Date();
          let temptoday = new Date()
          let three_days = new Date(temptoday.setDate(temptoday.getDate() + 3))
          if (dateStart < today && dateFinish >= today){
            result = `${element.NameAbsence} до ${element.DateFinishAbsence}`;     
          }            
          if (dateStart < three_days && dateFinish >= today){
            result = ` ${element.NameAbsence} c ${element.DateStartAbsence} до ${element.DateFinishAbsence}`;
            
          }

        });
      }
      this.absence = result;
      return result;
    },
    formatEmail(email) {
      let emailArr = email.split("-");
      return `${
        emailArr[0].charAt(0).toUpperCase() + emailArr[0].slice(1).toLowerCase()
      }`;
    },
    async setFavorite() {
      const event = this.favorite ? 'DELETE' : 'POST'
      let fd = new FormData()
      fd.append('event', event)
      fd.append('user_id', this.user.id)
      await fetch('http://trs-msu-test/phonebook/users/favorites.php', {method:'POST', body:fd})
      this.favorite = !this.favorite;

    },
    getFavorites() {
      if (localStorage.favorites) {
        let favorites = JSON.parse(localStorage.favorites);
        favorites.forEach((element) => {
          element === this.user.id ? (this.favorite = true) : "";
        });
      }
    },
    changeExpandState() {
      this.expand = !this.expand;
    },
    async getDepartment(e) {
      if (e.target.nodeName === "DIV") this.changeExpandState();
      if (!this.hasGotten) {
         
        this.chiefs = await this.getChief();
        this.chiefLoaded = true;
        this.colleagues = await this.getColleagues();
        this.hasGotten = true;
      }
    },
    async getChief() {
        try {
          let response = await fetch(
            `http://trs-msu-test/phonebook/users/getChief.php?user_id=${this.user.id}`
          );
          let json = await response.json();
          let chiefs = [];
          json.forEach(async (element) => {
            let response_chief = await fetch(
              `http://trs-msu-test/phonebook/users/getUsers.php?tabn=${element.tabn}`
            );
            let json_chief = await response_chief.json();
            this.chiefs = [...this.chiefs, ...json_chief];
          });
          return chiefs;
        } catch (error) {
          console.warn(error)
          this.chiefLoaded = true;
          return []
          //TEST
          //return [userListTest[0], userListTest[1]];
        }
    },
    async getColleagues() {
      try {
        let response = await fetch(
          `http://trs-msu-test/phonebook/users/getColleagues.php?user_id=${this.user.id}&sort=title_rank`
        );
        let json = await response.json();
        this.colleaguesLoaded = true;
        let filteredJson = [];
        json.filter((elem) => {
          elem.id !== this.user.id ? filteredJson.push(elem) : "";
        });
        return filteredJson;
      } catch (error) {
        console.warn(error)
        this.colleaguesLoaded = true;
        return []
        //return userListTest;
      }
    },
    test(e) {
      console.log(e);
    },
  },
};
</script>
