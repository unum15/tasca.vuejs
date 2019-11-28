<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ backflow_test_report.name }}
        </h1>
        <main>
            <b-tabs>
                <b-tab title="General">
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
                            <b-col>
                                <b-form-group label="Backflow Assembly">
                                    <b-form-select
                                        v-model="backflow_test_report.backflow_assembly_id"
                                        @change="getBackflowValves();save();"
                                        :options="backflow_assemblies"
                                        value-field="id"
                                        text-field="serial_number"
                                        :state="backflow_test_report.backflow_assembly_id != null"
                                        required
                                    >
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Proper installation and use">
                                    <b-form-radio v-model="backflow_test_report.backflow_installed_to_code" name="backflow_installed_to_code" value="true">To Code</b-form-radio>
                                    <b-form-radio v-model="backflow_test_report.backflow_installed_to_code" name="backflow_installed_to_code" value="false">Not To code</b-form-radio>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Visual Inspection Notes">
                                    <b-form-textarea
                                        v-model="backflow_test_report.visual_inspection_notes"
                                        @change="save"
                                        type="text"
                                        :state="backflow_test_report.visual_inspection_notes != null"
                                        required
                                    >
                                    </b-form-textarea>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-tab>
                <b-tab title="Tests" v-if="backflow_test_report.backflow_assembly_id">
                    <b-tabs vertical pills>
                        <b-tab v-for="test,index in backflow_test_report.tests" :key='index' :title="'Test ' + index">
                            <b-container>
                                <b-row>
                                    <b-col>
                                        <b-form-group label="Test By">
                                            <b-form-select
                                                v-model="backflow_test_report.initial_test_contact_id"
                                                @change="save"
                                                :options="contacts"
                                                value-field="id"
                                                text-field="name"
                                                :state="backflow_test_report.initial_test_contact_id != null"
                                                required
                                            >
                                            </b-form-select>
                                        </b-form-group>
                                    </b-col>
                                    
                                    <b-col>
                                        <b-form-group label="Date">
                                            <b-form-input
                                                v-model="backflow_test_report.initial_test_date"
                                                @change="save"
                                                type="date"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col v-for="valve in valves" :key="valve.id">
                                        {{ valve.test_label }}
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col v-for="valve in valves" :key="valve.id">
                                        <b-form-group :label="valve.test_value">
                                            <b-form-input v-if="valve.store_value"
                                                v-model="valve.value"
                                                @change="save"
                                                type="number"
                                            >
                                            </b-form-input>
                                            <b-form-radio name="valve.test_name" value="true">{{valve.success_label}}</b-form-radio>
                                            <b-form-radio name="valve.test_name" value="false">{{valve.fail_label}}</b-form-radio>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                                </b-container>
                            </b-tab>
                        </b-tabs>
                        <b-button @click="addTest">Add Test</b-button>
                    </b-tab>
                <b-tab title="Repairs"  v-if="backflow_test_report.backflow_assembly_id">
                    <b-tabs vertical pills>
                        <b-tab v-for="repair,index in backflow_test_report.repairs" :key='index' :title="'Repair ' + index">
                            <b-container>
                            <b-row>
                                    <b-col v-for="valve in valves" :key="valve.id">
                                        {{ valve.test_label }}
                                    </b-col>
                                </b-row>
                                                    <b-row>
                                    <b-col>
                                        <b-form-group label="Repairs By">
                                            <b-form-select
                                                v-model="backflow_test_report.repairs_contact_id"
                                                @change="save"
                                                :options="contacts"
                                                value-field="id"
                                                text-field="name"
                                                :state="backflow_test_report.repairs_contact_id != null"
                                                required
                                            >
                                            </b-form-select>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-form-group label="Date">
                                            <b-form-input
                                                v-model="backflow_test_report.initial_test_date"
                                                @change="save"
                                                type="date"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col v-for="valve in valves" :key="valve.id">
                                        <b-form-checkbox>Cleaned</b-form-checkbox>
                                        <b-form-group label="Replaced">
                                            <b-form-checkbox v-for="part in valve.backflow_valve_parts" :key="part.id">{{part.name}}</b-form-checkbox>
                                            <b-form-checkbox>Other</b-form-checkbox>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-tab>
                        </b-tabs>
                    <b-button @click="addRepair">Add Repair</b-button>
                </b-tab>
            </b-tabs>
        <b-button @click="$router.push('/backflow_test_reports')">Done</b-button>
                    
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditBackflowTestReport',
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
            settings: {}
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
                this.$http.get('/backflow_assemblies?property_id=' + this.property_id).then(response => {
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

