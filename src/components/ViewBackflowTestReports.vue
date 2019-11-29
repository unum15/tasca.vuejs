<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Backflow Certifications
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
                :items="backflow_test_reports"
                :fields="fields"
            >
                <template slot="id" slot-scope="data">
                    <a :href="'/backflow_certification/' + data.value"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewBackflowTestReports',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            backflow_test_reports: [],
            filter: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
                        sortable: true
                    },
                    {
                        key: 'backflow_assembly.serial',
                        label: 'Backflow Assembly',
                        sortable: true
                    },
                    {
                        key: 'visual_inspection_notes',
                        label: 'Visual Inspection Notes',
                        sortable: true
                    },
                    {
                        key: 'backflow_installation_status_id',
                        label: 'Backflow Installation Status Id',
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
        this.$http.get('/backflow_test_reports?includes=backflow_assembly').then(response => {
            this.backflow_test_reports = response.data.data;
        });
    }
}
</script>

