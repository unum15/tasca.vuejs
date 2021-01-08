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
            >
                <template v-slot:cell(id)="data">
                    <a :href="'/backflow_water_system/' + data.value"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewBackflowWaterSystems',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            backflow_water_systems: [],
            filter: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
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
                    {
                        key: 'abbreviation',
                        label: 'Abbreviation',
                        sortable: true
                    },
            ]
        }
    },
    created() {
        this.$http.get('/backflow_water_systems').then(response => {
            this.backflow_water_systems = response.data.data;
        });
    }
}
</script>

