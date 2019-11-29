<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Services
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
                :items="services"
                :fields="fields"
            >
                <template v-slot:cell(id)="data">
                    <a :href="'/service/' + data.value"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewServices',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            services: [],
            filter: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
                        sortable: true
                    },
                    {
                        key: 'vehicle.name',
                        label: 'Vehicle',
                        sortable: true
                    },
                    {
                        key: 'service_type.name',
                        label: 'Service Type',
                        sortable: true
                    },
                    {
                        key: 'description',
                        label: 'Description',
                        sortable: true
                    },
                    {
                        key: 'quantity',
                        label: 'Quantity',
                        sortable: true
                    },
                    {
                        key: 'usage_type.name',
                        label: 'Usage Type',
                        sortable: true
                    },
                    {
                        key: 'usage_interval',
                        label: 'Usage Interval',
                        sortable: true
                    },
                    {
                        key: 'part_number',
                        label: 'Part Number',
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
                    {
                        key: 'time_interval',
                        label: 'Time Interval',
                        sortable: true
                    },
            ]
        }
    },
    created() {
        this.$http.get('/services?includes=usage_type,service_type,vehicle').then(response => {
            this.services = response.data.data;
        });
    }
}
</script>

