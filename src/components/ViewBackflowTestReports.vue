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
                    <b-col style="text-align:bottom;">
                        <b-form-checkbox v-model="use.client">Client name in filename</b-form-checkbox>
                    </b-col>
                    <b-col>                
                        <b-form-checkbox v-model="use.property">Property name in filename</b-form-checkbox>
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
                <template v-slot:cell(id)="data">
                    <a :href="'/backflow_test_report/' + data.value"> {{ data.value }} </a>
                    <a href="" v-on:click.stop.prevent="openWindow('/api/backflow_test_report/' + data.value + '/pdf?use_client=' + use.client + '&use_property=' + use.property + '&', 'pdf')"> PDF </a>
                </template>
                
                
                <template v-slot:cell(passed)="data">
                    <b-badge v-if="data.item.last_test.passed" variant="success">Closed Tight</b-badge>
                    <b-badge v-else variant="danger">Leaked</b-badge>
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
                    key: 'backflow_assembly.property.client.name',
                    label: 'Client',
                    sortable: true
                },
                {
                    key: 'backflow_assembly.property.name',
                    label: 'Property',
                    sortable: true
                },
                {
                    key: 'backflow_assembly.serial_number',
                    label: 'Backflow Assembly',
                    sortable: true
                },
                {
                    key: 'visual_inspection_notes',
                    label: 'Visual Inspection Notes',
                    sortable: true
                },
                {
                    key: 'backflow_installed_to_code',
                    label: 'To Code',
                    sortable: true
                },
                {
                    key: 'notes',
                    label: 'Notes',
                    sortable: true
                },
                {
                    key: 'last_test.tested_on',
                    label: 'Date',
                    sortable: true
                },
                {
                    key: 'backflow_assembly.backflow_type.name',
                    label: 'Type',
                    sortable: true
                },
                {
                    key: 'last_test.reading_1',
                    label: 'Reading 1',
                    sortable: true
                },
                {
                    key: 'last_test.reading_2',
                    label: 'Reading 2',
                    sortable: true
                },
                {
                    key: 'passed',
                    label: 'Result',
                    sortable: false
                }
            ],
            use: {
              client: true,
              property: true
            }
        }
    },
    created() {
        this.$http.get('/backflow_test_reports?includes=backflow_assembly,backflow_tests,backflow_assembly.backflow_type,backflow_assembly.property,backflow_assembly.property.client').then(response => {
            this.backflow_test_reports = response.data.data;
            this.backflow_test_reports.map(r => {
                if(r.backflow_tests.length > 0){
                    r.last_test = r.backflow_tests[r.backflow_tests.length-1];
                }
                else{
                    r.last_test = {};
                }
            });
        });
    },
    methods: {
        openWindow: function (link, tab) {
            window.open(link, tab);
        }
    }
}
</script>

