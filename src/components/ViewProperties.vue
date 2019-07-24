<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Properties
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
                            @change="getProperties"
                        />
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table small striped hover :filter="filter" :items="properties" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'/client/'+ data.item.client_id +'/property/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewProperties',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            activity_level_id: null,
            activity_levels: [],
            properties: [],
            filter: null,
            fields: [
                {
                    key: 'client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'name',
                    label: 'Property Name',
                    sortable: true
                },
                {
                    key: 'contact.name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'property_type.name',
                    label: 'Type',
                    sortable: true,
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
        this.getProperties();
    },
    methods: {
        getProperties(){
            this.$http.get('/properties?maximium_activity_level_id=' + this.activity_level_id).then((results) => {
                this.properties = results.data;
            });
        }
    }
}
</script>