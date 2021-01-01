<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Contacts
        </head>
        <main>
            <b-container fluid>
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group  label="Filter" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Type to Search" />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" class="my-1">
                    <b-form-group  label="Maximium Activity Level" class="mb-0">
                      <b-input-group>
                        <b-form-select
                            v-model="activity_level_id"
                            :options="activity_levels"
                            value-field="id"
                            text-field="name"
                            @change="getContacts"
                        />
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table small striped hover :filter="filter" :items="contacts" :fields="fields">
                <template v-slot:cell(name)="data">
                    <a :href="'/contact/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import { mapState } from 'vuex';
export default {
    name: 'ViewContacts',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            activity_level_id: null,
            activity_levels: [],
            contacts: [],
            filter: null,
            fields: [
                {
                    key: 'name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'contact_method.name',
                    label: 'Contact Method',
                    sortable: true,
                },
                {
                    key: 'login',
                    label: 'Login',
                    sortable: false
                },
                {
                    key: 'notes',
                    label: 'Notes',
                    sortable: false
                }
            ]
        }
    },
    created() {
        this.$http.get('/activity_levels').then((results) => {
            this.activity_levels = results.data;
        });
        this.activity_level_id = this.vuex_show_maximium_activity_level_id;
        this.getContacts();
    },
    methods: {
        getContacts(){
            if(this.activity_level_id){
                this.$http.get('/contacts?maximium_activity_level_id=' + this.activity_level_id).then((results) => {
                    this.contacts = results.data;
                });
            }
        }
    },
    computed: {
        ...mapState({
          vuex_show_maximium_activity_level_id: state => state.user.show_maximium_activity_level_id
        })
    },
    watch: {
        vuex_show_maximium_activity_level_id (){
            this.activity_level_id = this.vuex_show_maximium_activity_level_id;
            this.getContacts();
        }
    }
}
</script>