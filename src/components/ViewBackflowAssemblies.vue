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
                        key: 'water_system',
                        label: 'Water System',
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
                        key: 'backflow_style_id',
                        label: 'Backflow Style Id',
                        sortable: true
                    },
                    {
                        key: 'manufacturer',
                        label: 'Manufacturer',
                        sortable: true
                    },
                    {
                        key: 'size',
                        label: 'Size',
                        sortable: true
                    },
                    {
                        key: 'model_number',
                        label: 'Model Number',
                        sortable: true
                    },
                    {
                        key: 'serial_number',
                        label: 'Serial Number',
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
        this.$http.get('/backflow_assemblies?includes=contact,property').then(response => {
            this.backflow_assemblies = response.data.data;
        });
    }
}
</script>

