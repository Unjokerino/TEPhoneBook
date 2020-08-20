<template>
  <v-container>
    <div class="search-container">
      <div class="search-container__input-cotnainer ">
        <input class=" search-container_search-input" v-model="searchQuery" @change="search" placeholder="Поиск" type="search" />
        <div color="black" v-if="found_ids.length">{{found_ids.length}}</div>
        <input class="search-container_search-btn " @click="search" type="button" value="Искать" />
      </div>
      <v-select
        flat
        outlined
        class="search-container__tpo-select my-3"
        value="Другие сети"
        :items="['Тюменские распределительные сети', 'Другие сети']"
      />
    </div>
    <v-card color="card">
     
      <v-row class="pa-4" justify="space-between">
        <v-col cols="12">
          <v-treeview
            :open-all="openAll"
            :active="active"
            :items="items"
            :load-children="(item) => fetchDeps(item,0,2)"
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

export default {
  data: () => ({
    active: [],
    avatar: null,
    open: [],
    searchQuery:'',
    users: [],
    found_ids:[],
    openAll:false,
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
    let department_id = this.$route.params.department_id;
    department_id ? this.getPath(department_id) : this.fetchDeps();
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
        await this.fetchDeps(null)
        let url = "http://trs-msu-test/phonebook/users";
        let response = await fetch(
          `${url}/getPath.php?id=${department_id}`
        )
        let json = await response.json();
        const fetchAndOpen = async (i) => {
          const item = json[i]
          item.children = []
          await this.fetchDeps(item, i, 1)
          if(i > 0){
            await fetchAndOpen(i - 1)
          }
        }
        await fetchAndOpen(json.length - 1)
    },

    async fetchDepsAuto(item,is_not_last){
      console.log('auto')
      let url = "http://trs-msu-test/phonebook/users";
         
          let response = await fetch(`${url}/getDeps.php?parent_id=${item.id}`);
          let json = await response.json();
          
          json.forEach(elem => {
            if (!elem.children) {
              elem.children = [];
            }
            item.children.push({ ...elem });
          });
          this.open.push(item.id) 
          if(!is_not_last){
            this.active.push(item.id)
          }
          
          let result = await fetch(
            `${url}/getUsers.php?sort=title_rank&departament_sap=${item.departament_sap}`
          )
          let json_users = await result.json()
          
          this.users = [...this.users];
          
          
          if(json.length){
            item.children = [...json_users, ...item.children];
          }else{
            item.children = [...json_users];
          }
          return item;
          
    },

    async fetchDeps(item,is_not_last,clickType=0) {
      console.log(clickType)
      let url = "http://trs-msu-test/phonebook/users";
      if (item) {
         
          let response = await fetch(`${url}/getDeps.php?parent_id=${item.id}`);
          let json = await response.json();
          
          json.forEach(elem => {
            if (!elem.children) {
              elem.children = [];
            }
            item.children.push({ ...elem });
          });
          if(!is_not_last){
            this.active.push(item.id)
          }
        
          if(!this.open.includes(item.id)){
            this.open.push(item.id) 
          }

          
          
          let result = await fetch(
            `${url}/getUsers.php?sort=title_rank&departament_sap=${item.departament_sap}`
          )
          let json_users = await result.json()
          
          this.users = [...this.users];
          
          
          if(json.length){
            item.children = [...json_users, ...item.children];
          }else{
            item.children = [...json_users];
          }
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
    async search(){
      if (this.searchQuery) {
        try {
          let response = await fetch(`http://trs-msu-test/phonebook/users/searchTree.php?search=${this.searchQuery}`)
          let json = await response.json()
          this.initial_items = json
          const openNode = (elem) =>{
            
           let children = elem.children
           this.open.push(elem.id)
           children.forEach(child =>{
            this.open.push(child.id)

            if(child.children){
              openNode(child)
            }else{
              this.found_ids.push(child.id)
            }
           })
          
          }
          json.forEach(elem =>{
            openNode(elem)
          })
       
          this.openAll = true
        } catch (error) {
          console.warn(error)
          this.fetchDeps()
        }

      }
    }
  }
};
</script>

<style>
</style>