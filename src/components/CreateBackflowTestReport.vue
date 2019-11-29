<template>
    <div>
        <TopMenu></TopMenu>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Client">
                         <el-select v-model="client_id" filterable placeholder="Select Client" @change="getProperties();">
                            <el-option
                              v-for="client in clients"
                              :key="client.id"
                              :label="client.name"
                              :value="client.id">
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Property">
                            <b-form-select
                                v-model="property_id"
                                @change="getBackflowAssemblies()"
                                :options="properties"
                                value-field="id"
                                text-field="name"
                                :state="property_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                hover
                :items="backflow_assemblies"
                :fields="fields"
            >
                <template v-slot:cell(test_1)="data">
                    <b-form-input
                      type="number"
                    >
                    </b-form-input>
                  </b-form-group>
                </template>
                <template v-slot:cell(test_2)="data">
                    <b-form-input v-if="data.item.backflow_type.backflow_valves[0].show_value"
                      type="number"
                    >
                    </b-form-input>
                  </b-form-group>
                </template>
                <template v-slot:cell(test_3)="data">
                    <b-form-input v-if="data.item.backflow_type.backflow_valves.length > 2"
                      type="number"
                    >
                    </b-form-input>
                  </b-form-group>
                </template>
            </b-table>
            <b-button @click="$router.push('/backflow_test_reports')">Done</b-button>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'CreateBackflowTestReport',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        backflow_test_report_id: {default: null}
    },
    data () {
        return {
            client_id: null,
            property_id: null,
            clients: [],
            contacts: [],
            properties: [],
            backflow_test_report: {
                id: null,
                tests: [],
                repairs: []
            },
            backflow_assemblies: [],
            valves: [],
            settings: {},
            fields: [
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
                        label: 'Mfg',
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
                        label: 'SN',
                        sortable: true
                    },
                    {
                        key: 'test_1',
                        label: '',
                        sortable: false
                    },
                    {
                        key: 'test_2',
                        label: '',
                        sortable: false
                    },
                    {
                        key: 'test_3',
                        label: '',
                        sortable: false
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
                        sortable: false
                    }
                ]
        };
    },
    created () {
        this.$http.get('/settings').then(response => {
          this.settings = response.data;
          this.$http.get('/contacts?client_id=' + this.settings.operating_company_client_id).then(response => {
            this.contacts = response.data;
        });
        })
        this.$http.get('/clients?backflow_only=true').then(response => {
            this.clients = response.data;
        });
        if(this.backflow_test_report_id !== null) {
            this.$http.get('/backflow_test_report/' + this.backflow_test_report_id).then(response => {
                this.backflow_test_report = response.data.data;
            });
        }
        else{
            let id = localStorage.getItem('id')
            //this.backflow_test_report.final_test_contact_id = id;
            this.backflow_test_report.initial_test_contact_id = id;
        }
    },
    methods: {
        getProperties() {
          if(this.client_id){
            this.$http.get('/properties?client_id=' + this.client_id).then(response => {
              this.properties = response.data
              if(this.properties.length == 1){
                 this.property_id= this.properties[0].id;
                 this.getBackflowAssemblies();
              }
            })
          }
          else{
            this.properties = []
          }
        },
        getBackflowAssemblies(){
            if(this.property_id){
                this.$http.get('/backflow_assemblies?includes=backflow_size,backflow_type,backflow_manufacturer,backflow_model,backflow_type.backflow_valves&property_id=' + this.property_id).then(response => {
                    this.backflow_assemblies = response.data.data;
                    if(this.backflow_assemblies.length == 1){
                       this.backflow_test_report.backflow_assembly_id=this.backflow_assemblies[0].id;
                       this.getBackflowValves();
                     }
                 });
            }
            else{
                this.backflow_assemblies = [];
            }
        },
        getBackflowValves(){
            if(this.backflow_test_report.backflow_assembly_id){
                let assemblies = this.backflow_assemblies.filter(a => (this.backflow_test_report.backflow_assembly_id == a.id));
                this.$http.get('/backflow_valves?includes=backflow_valve_parts&backflow_type_id=' + assemblies[0].backflow_type_id).then(response => {
                     this.valves = response.data.data;
                 });
            }
            else{
                this.valves = [];
            }
        },
        addTest(){
            this.backflow_test_report.tests.push({});
        },
        addRepair(){
            this.backflow_test_report.repairs.push({});
        },
        save () {
            if((!this.backflow_test_report.backflow_assembly_id)||(!this.backflow_test_report.visual_inspection_notes)||(!this.backflow_test_report.backflow_installation_status_id)){
                return;
            }
            if(this.backflow_test_report.id === null){
                this.$http.post('/backflow_test_report',this.backflow_test_report)
                    .then((results) => {
                        this.backflow_test_report.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/backflow_test_report/' + this.backflow_test_report.id, this.backflow_test_report);
            }
        }
    }
};
</script>

