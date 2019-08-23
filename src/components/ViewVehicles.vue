<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Vehicles
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
                :items="vehicles"
                :fields="fields"
            >
                <template slot="id" slot-scope="data">
                    <a :href="'/vehicle/' + data.value"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewVehicles',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            vehicles: [],
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
                    key: 'vehicle_type.name',
                    label: 'Type',
                    sortable: true
                },
                {
                    key: 'year',
                    label: 'year',
                    sortable: true
                },
                {
                    key: 'make',
                    label: 'Make',
                    sortable: true
                },
                {
                    key: 'model',
                    label: 'Model',
                    sortable: true
                },
                {
                    key: 'trim',
                    label: 'Trim',
                    sortable: true
                },
                {
                    key: 'vin',
                    label: 'VIN',
                    sortable: true
                },
                {
                    key: 'notes',
                    label: 'Notes',
                    sortable: true
                }
            ]
        }
    },
    created() {
        this.$http.get('/notes').then(response => {
			this.notes = response.data.data;
		});
    }
}
</script>