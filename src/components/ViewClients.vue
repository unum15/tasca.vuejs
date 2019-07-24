<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Clients
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
                            @change="getClients"
                        />
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table small striped hover :filter="filter" :items="clients" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'/client/' + data.item.id"> {{ data.value }} </a>
                </template>
                <template slot="projects" slot-scope="data">
                    <a :href="'/client/' + data.item.id + '/projects'"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewClients',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            clients: [],
            filter: null,
            activity_level_id: null,
            activity_levels: [],
            fields: [
                {
                    key: 'name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'projects',
                    label: 'Projects',
                    sortable: false
                },
                {
                    key: 'client_type.name',
                    label: 'Client Type',
                    sortable: true,
                },
                {
                    key: 'activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'billing_contact.name',
                    label: 'Billing Contact',
                    sortable: true,
                },
                {
                    key: 'billing_property.city',
                    label: 'Address',
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
        this.activity_level_id = localStorage.getItem('show_maximium_activity_level_id');
        this.getClients();
    },
    methods: {
        getClients(){
            this.$http.get('/clients?maximium_activity_level_id=' + this.activity_level_id).then((results) => {
                this.clients = results.data;
            });
        }
    }
}
</script>