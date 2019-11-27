<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Backflow Assemblies
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
                :items="backflow_assemblies"
                :fields="fields"
            >
                <template slot="id" slot-scope="data">
                    <a :href="'/backflow_assembly/' + data.value"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewBackflowAssemblies',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            backflow_assemblies: [],
            filter: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
                        sortable: true
                    },
                    {
                        key: 'property.name',
                        label: 'Property',
                        sortable: true
                    },
                    {
                        key: 'contact.name',
                        label: 'Contact',
                        sortable: true
                    },
                    {
                        key: 'backflow_water_system.name',
                        label: 'System',
                        sortable: true
                    },
                    {
                        key: 'use',
                        label: 'Use',
                        sortable: true
                    },
                    {
                        key: 'placement',
                        label: 'Placement',
                        sortable: true
                    },
                    {
                        key: 'backflow_type.name',
                        label: 'Type',
                        sortable: true
                    },
                    {
                        key: 'backflow_manufacturer.name',
                        label: 'Manufacturer',
                        sortable: true
                    },
                    {
                        key: 'backflow_size.name',
                        label: 'Size',
                        sortable: true
                    },
                    {
                        key: 'backflow_model.name',
                        label: 'Model',
                        sortable: true
                    },
                    {
                        key: 'serial_number',
                        label: 'Serial',
                        sortable: true
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
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
        this.$http.get('/backflow_assemblies?includes=contact,property,backflow_water_system,backflow_size,backflow_type,backflow_manufacturer,backflow_model').then(response => {
            this.backflow_assemblies = response.data.data;
        });
    }
}
</script>

