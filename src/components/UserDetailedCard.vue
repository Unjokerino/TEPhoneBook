<template>
    <v-card flat>

     
       
        <v-row class="mx-0 detailed-card">
        <v-col cols="4" class="flex-column">
            <div class="align-self-center pa-2 detailed-card__avatar" v-if="user.photo_normal" v-html="user.photo_normal"></div>
            <v-img
                v-else
                class="align-self-center pa-2 detailed-card__avatar"
                src="../assets/avatar.jpg"
                aspect-ratio="1.5"
            />
        </v-col>
        <v-col>
            <v-row class="d-flex align-center">
                <v-col  cols=6>
                    <v-list-item two-line>
                        <v-list-item-content>
                        <v-list-item-title class="headline" v-html="user.name" />
                        <v-list-item-subtitle v-html="user.title" />
                        </v-list-item-content>
                    </v-list-item>
                </v-col> 
                <v-col class="text-right" cols=6>
                  
                  <div v-show="absence" >
                    <v-chip label color="primary">{{absence}}</v-chip>
                </div>
                </v-col>
            </v-row>
            <v-card-text>
                <v-row align="center">
                <v-col cols="12">
                    <div v-if="user.subdivision" class="d-flex flex-column">
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
                        >
                            {{user.subdivision[0].name}}
                        </span>
                    </div>
                    <v-list-item>
                        <v-list-item-icon><v-icon>mdi-phone-classic</v-icon></v-list-item-icon>
                        <v-list-item-title> <a :href="'tel:+'+user.phone">{{user.phone}}</a></v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon><v-icon>mdi-phone</v-icon></v-list-item-icon>
                        <v-list-item-title> <a :href="'tel:+'+user.phone_internal">{{user.phone_internal}}</a></v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon><v-icon>mdi-cellphone</v-icon></v-list-item-icon>
                        <v-list-item-title> <a :href="'tel:+'+user.mobile">{{user.mobile}}</a></v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-icon><v-icon>mdi-email</v-icon></v-list-item-icon>
                        <v-list-item-title> <a :href="'mailto:'+user.email">{{user.email}}</a></v-list-item-title>
                    </v-list-item>
                    <div class="d-flex flex-column">
                        <div class="text-subtitle-1">
                            <span class="text-h6"> Рабочее место: </span> 
                            <span>
                                <span class="text-transform-capitilize" v-html="user.address" /> 
                                <span>{{user.address && ','}} {{user.room}}</span>
                            </span>
                        </div>
                        <span class="text-h6" > Руководитель:</span>
                        <UserSmallCard :transition="transition" v-for="chief in chiefs" :key="chief.id" :user="chief" />
                        <span class="text-h6" > Коллеги:</span>
                        <UserSmallCard :transition="transition" v-for="colleague in colleagues" :key="colleague.id" :user="colleague" />
                        <div class="text-h6">Замещения:</div>
                    </div>
                </v-col>
                </v-row>
            </v-card-text>
        </v-col>
        </v-row>
    </v-card>
</template>

<script>
import '../css/userCardDetailed.css'
import UserSmallCard from './UserSmallCard'
export default {
    props:{
        user:Object,
        chiefs:Array,
        colleagues:Array,
        absence:String
    },
    components:{
        UserSmallCard
    }
}
</script>

<style>

</style>