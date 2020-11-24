<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Asset Fuelings
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
                :items="asset_fuelings"
                :fields="fields"
            >
                <template v-slot:cell(id)="data">
                    <a :href="'/asset_fueling/' + data.value"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewAssetFuelings',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            asset_fuelings: [],
            filter: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
                        sortable: true
                    },
                    {
                        key: 'asset.name',
                        label: 'Asset',
                        sortable: true
                    },
                    {
                        key: 'usage',
                        label: 'Usage',
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
        this.$http.get('/asset_fuelings?includes=asset').then(response => {
            this.asset_fuelings = response.data.data;
        });
    }
}
</script>

