<template>
  <v-container>
    <div class="search-container">
      <div class="search-container__input-cotnainer">
        <input class="search-container_search-input" placeholder="Поиск" type="search" />
        <input class="search-container_search-btn" type="button" value="Искать" />
      </div>
      <v-select
        flat
        class="search-container__tpo-select"
        value="Другие сети"
        :items="['Тюменские распределительные сети', 'Другие сети']"
      />
    </div>
    <v-card>
     
      <v-row class="pa-4" justify="space-between">
        <v-col cols="12">
          <v-treeview

            :active.sync="active"
            :items="items"
            :load-children="fetchDeps"
            :open.sync="open"
            :item-text="''"
            
            open-on-click
            transition
          >
            <template v-slot:prepend="{ item }">
              <div v-if="item" style="display:flex">
                
               <v-list-item-title v-if="item.manager_id" >{{item.name}}</v-list-item-title>
               <UserCard v-else style="align-self:center" :user="item"/>
           
              </div>
            </template>
          </v-treeview>
        </v-col>

        <v-divider vertical></v-divider>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import "../css/index.css";
import UserCard from './UserSmallCard'
const avatars = [
  "?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban",
  "?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun",
  "?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong",
  "?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair",
  "?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly"
];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
export default {
  data: () => ({
    active: [],
    avatar: null,
    open: [],
    users: [],
    initial_items: [],
    department_id: undefined
  }),
  components:{
    UserCard
  },

  computed: {
    items() {
      return this.initial_items;
    },
    selected() {
      if (!this.active.length) return undefined;

      const id = this.active[0];
      let user = undefined;
      this.users.forEach(element => {
        element.id == id ? (user = element) : "";
      });
      return user;
    }
  },
  mounted() {
    console.log(this.$route);
    let department_id = this.$route.params.department_id;
    if (department_id) {
      this.getPath(department_id);
    } else {
      this.fetchDeps();
    }
  },
  watch: {
    $route(val) {
      let department_id = val.params.department_id;
      
      if (department_id) {
        this.getPath(department_id);
      }
    },
    selected: "randomAvatar"
  },

  methods: {
    async getPath(department_id) {
        let url = "http://trs-msu-test/phonebook/users";
        fetch(
          `${url}/getPath.php?id=${department_id}`
        ).then(async response => {
          let json = await response.json();

          json.forEach((element, index) => {
            if (index !== json.length - 1) {
              this.open.push(json[index + 1].id)
              json[index + 1].children = [element];
            } else {
              json[index].children = [];
            }
          });
          let root = json[json.length - 2]
          let result = await fetch(
            `${url}/getUsers.php?sort=title_rank&departament_sap=${json[0].departament_sap}`
          )
          let json_users = await result.json()
          this.users = [...this.users, ...json_users];
          json[0].children = this.users;
          this.initial_items = [root];
        });
      
    },
    async fetchUsers(item) {
      await pause(1500);

      return fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json())
        .then(json => item.children.push(...json))
        .catch(err => console.warn(err));
    },
    async fetchDeps(item) {
      let url = "http://trs-msu-test/phonebook/users";
      if (item) {
          let response = await fetch(`${url}/getDeps.php?parent_id=${item.id}`);
          let json = await response.json();

          let result = await fetch(
            `${url}/getUsers.php?sort=title_rank&departament_sap=${item.departament_sap}`
          )
         
          json.forEach(elem => {
            if (!elem.children) {
              elem.children = [];
            }
            item.children.push({ ...elem });
          });
          let json_users = await result.json()
          this.users = [...this.users, ...json_users];
          item.children = [...json_users, ...item.children];

          return item;
        
      } else {
        return fetch(
          "http://trs-msu-test/phonebook/users/getDeps.php?parent_id=0"
        )
          .then(res => res.json())
          .then(json => {
            let initial_items = [];
            for (let elem in json) {
              if (elem) {
                json[elem].children = [];
                initial_items.push({ ...json[elem] });
              }
            }

            this.initial_items = initial_items;
          })
          .catch(err => console.warn(err));
      }
    },
    randomAvatar() {
      this.avatar = avatars[Math.floor(Math.random() * avatars.length)];
    }
  }
};
</script>

<style>
</style>