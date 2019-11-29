<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Fuelings
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
                :items="fuelings"
                :fields="fields"
            >
                <template v-slot:cell(id)="data">
                    <a :href="'/fueling/' + data.value"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewFuelings',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            fuelings: [],
            filter: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
                        sortable: true
                    },
                    {
                        key: 'vehicle.name',
                        label: 'Vehicle Name',
                        sortable: true
                    },
                    {
                        key: 'beginning_reading',
                        label: 'Beginning Reading',
                        sortable: true
                    },
                    {
                        key: 'ending_reading',
                        label: 'Ending Reading',
                        sortable: true
                    },
                    {
                        key: 'date',
                        label: 'Date',
                        sortable: true
                    },
                    {
                        key: 'gallons',
                        label: 'Gallons',
                        sortable: true
                    },
                    {
                        key: 'amount',
                        label: 'Amount',
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
        this.$http.get('/fuelings?includes=vehicle').then(response => {
            this.fuelings = response.data.data;
        });
    }
}
</script>

