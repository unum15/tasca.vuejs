<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Backflow Water Systems
        </head>
        <main>
            <b-container fluid>
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group label="Filter" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Type to Search" />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="backflow_water_systems"
                :fields="fields"
                 style="text-align:left;"
            >
                <template v-slot:cell(name)="data">
                    <a href="/backflow_water_systems/" @click.stop.prevent="editWaterSystem(data.item.id)"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(created_at)="data">
                    {{ formatDate(data.value) }}
                </template>
                <template v-slot:cell(updated_at)="data">
                    {{ formatDate(data.value) }}
                </template>
            </b-table>
        </main>
        <b-modal ref="add-water-system-modal" title="Add Water System" @ok="getBackflowWaterSystems" ok-only>
            <EditBackflowWaterSystemForm :backflow_water_system_id="edit_backflow_water_system_id"></EditBackflowWaterSystemForm>
        </b-modal>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import moment from 'moment';
import EditBackflowWaterSystemForm from './EditBackflowWaterSystemForm';
export default {
    name: 'ViewBackflowWaterSystems',
    components: {
        TopMenu,
        EditBackflowWaterSystemForm
    },
    data() {
        return {
            backflow_water_systems: [],
            filter: null,
            edit_backflow_water_system_id: null,
            fields: [
                    {
                        key: 'abbreviation',
                        label: 'Abbreviation',
                        sortable: true
                    },
                    {
                        key: 'name',
                        label: 'Name',
                        sortable: true
                    },
                    {
                        key: 'address',
                        label: 'Address',
                        sortable: true
                    },
                    {
                        key: 'city',
                        label: 'City',
                        sortable: true
                    },
                    {
                        key: 'state',
                        label: 'State',
                        sortable: true
                    },
                    {
                        key: 'zip',
                        label: 'Zip',
                        sortable: true
                    },
                    {
                        key: 'phone',
                        label: 'Phone',
                        sortable: true
                    },
                    {
                        key: 'contact',
                        label: 'Contact',
                        sortable: true
                    },
                    {
                        key: 'email',
                        label: 'Email',
                        sortable: true
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
                        sortable: true
                    },
                    {
                        key: 'sort_order',
                        label: 'Sort Order',
                        sortable: true
                    },
                    {
                        key: 'created_at',
                        label: 'Created At',
                        sortable: true
                    },
                    {
                        key: 'updated_at',
                        label: 'Updated At',
                        sortable: true
                    },
            ]
        }
    },
    created() {
        this.getBackflowWaterSystems();
    },
    methods: {
        getBackflowWaterSystems(){
            this.$http.get('/backflow_water_systems').then(response => {
                this.backflow_water_systems = response.data.data;
            });
        },
        formatDate(date) {
            return moment(date).format('MM-DD-YYYY');
        },
        editWaterSystem(id){
            this.edit_backflow_water_system_id=id;
            this.$refs['add-water-system-modal'].show();
        }
    }
}
</script>

