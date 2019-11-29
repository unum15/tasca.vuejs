<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ backflow_test_report.name }}
        </h1>
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
                    <b-col>
                        <b-form-group label="Backflow Assembly">
                            <b-form-select
                                v-model="backflow_test_report.backflow_assembly_id"
                                @change="setBackflow();save();"
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
                        {{ backflow_test_report.backflow_assembly.use }}
                    </b-col>
                    <b-col>
                        {{ backflow_test_report.backflow_assembly.placement }}
                    </b-col>
                    <b-col>
                        {{ backflow_test_report.backflow_assembly.backflow_type.name }}
                    </b-col>
                </b-row>
            </b-container>
            <b-tabs v-if="backflow_test_report.backflow_assembly_id">
                <b-tab title="Tests">
                    <b-tabs vertical pills>
                        <b-tab v-for="test,index in backflow_test_report.backflow_tests" :key='index' :title="'Test ' + index">
                            <b-container>
                                <b-row>
                                    <b-col>
                                        <b-form-group label="Test By">
                                            <b-form-select
                                                v-model="test.contact_id"
                                                @change="saveTest(test)"
                                                :options="contacts"
                                                value-field="id"
                                                text-field="name"
                                                :state="test.contact_id != null"
                                                required
                                            >
                                            </b-form-select>
                                        </b-form-group>
                                    </b-col>
                                    
                                    <b-col>
                                        <b-form-group label="Date">
                                            <b-form-input
                                                v-model="test.tested_on"
                                                @change="saveTest(test)"
                                                type="date"
                                                :state="test.tested_on != null"
                                            >
                                            </b-form-input>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                                <div v-if="['DCDA', 'DC'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
                                    <b-row>
                                        <b-col>
                                            Check Valve #1
                                        </b-col>
                                        <b-col>
                                            Check Valve #2
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col>
                                            <b-form-group label="Held at #">
                                                <b-form-input
                                                    v-model="test.reading_1"
                                                    @change="saveTest"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="11"
                                                    :state="test.reading_1 != null"
                                                >
                                                </b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            <b-form-group label="Held at #">
                                                <b-form-input
                                                    v-model="test.reading_2"
                                                    @change="saveTest"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="11"
                                                >
                                                </b-form-input>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col v-if="test.reading_1 >= 1" class="warning">
                                            <b-badge variant="success">Closed Tight</b-badge>
                                        </b-col>
                                        <b-col v-else>
                                            <b-badge variant="danger">Leaked</b-badge>
                                        </b-col>
                                        <b-col v-if="test.reading_2 >= 1" class="warning">
                                            <b-badge variant="success">Closed Tight</b-badge>
                                        </b-col>
                                        <b-col v-else>
                                            <b-badge variant="danger">Leaked</b-badge>
                                        </b-col>
                                    </b-row>
                                </div>
                                <div v-if="['PCVB', 'AVB', 'SVB', 'PVB'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
                                    <b-row>
                                        <b-col>
                                            Air Inlet
                                        </b-col>
                                        <b-col>
                                            Pressure Vacuum Breaker
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col>
                                            <b-form-group label="Opened At">
                                                <b-form-input
                                                    v-model="test.reading_1"
                                                    @change="saveTest(test)"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="11"
                                                    :state="test.reading_1 != null"
                                                >
                                                </b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            <b-form-group label="Check Valve">
                                                <b-form-input
                                                    v-model="test.reading_2"
                                                    @change="saveTest(test)"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="11"
                                                >
                                                </b-form-input>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col v-if="test.reading_1 >= 1" class="warning">
                                            <b-badge variant="success">Opened Under 1#</b-badge>
                                        </b-col>
                                        <b-col v-else>
                                            <b-badge variant="danger">Did Not Open</b-badge>
                                        </b-col>
                                        <b-col v-if="test.reading_2 >= 1" class="warning">
                                            <b-badge variant="success">Closed Tight</b-badge>
                                        </b-col>
                                        <b-col v-else>
                                            <b-badge variant="danger">Leaked</b-badge>
                                        </b-col>
                                    </b-row>
                                </div>
                                <div v-if="['RPDA', 'RP'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
                                    <b-row>
                                        <b-col>
                                            Check Valve #1
                                        </b-col>
                                        <b-col>
                                            Check Valve #2
                                        </b-col>
                                        <b-col>
                                            Differential Pressure Relief Valve
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col>
                                            <b-form-group label="PSI Across #">
                                                <b-form-input
                                                    v-model="test.reading_1"
                                                    @change="saveTest(test)"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="11"
                                                >
                                                </b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            PCI Across #
                                        </b-col>
                                        <b-col>
                                            <b-form-group label="Opened at #">
                                                <b-form-input
                                                    v-model="test.reading_2"
                                                    @change="saveTest(test)"
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="11"
                                                >
                                                </b-form-input>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col v-if="test.reading_1 - test.reading_2 >= 2" class="warning">
                                            <b-badge variant="success">Closed Tight</b-badge>
                                        </b-col>
                                        <b-col v-else>
                                            <b-badge variant="danger">Leaked</b-badge>
                                        </b-col>
                                        <b-col v-if="test.reading_1 > 0" class="warning">
                                            <b-badge variant="success">Closed Tight</b-badge>
                                        </b-col>
                                        <b-col v-else>
                                            <b-badge variant="danger">Leaked</b-badge>
                                        </b-col>
                                        <b-col v-if="test.reading_2 >= 2" class="warning">
                                            <b-badge variant="success">Opened Under #2</b-badge>
                                        </b-col>
                                        <b-col v-else>
                                            <b-badge variant="danger">Did Not Open</b-badge>
                                        </b-col>
                                    </b-row>
                                </div>
                                </b-container>
                            </b-tab>
                        </b-tabs>
                        <b-button @click="addTest">Add Test</b-button>
                    </b-tab>
                <b-tab title="Repairs">
                    <b-tabs vertical pills>
                        <b-tab v-for="repair,index in backflow_test_report.backflow_repairs" :key='index' :title="'Repair ' + index">
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
                <b-tab title="Installation">
                    <b-container>
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
                                    >
                                    </b-form-textarea>
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-container>
                </b-tab>
            </b-tabs>
        <b-button @click="$router.push('/backflow_test_reports')">Done</b-button>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
import moment from 'moment';
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
                backflow_tests: [],
                backflow_repairs: [],
                backflow_assembly: {backflow_type: {}},
                backflow_installed_to_code: true
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
            this.$http.get('/backflow_test_report/' + this.backflow_test_report_id + '?includes=backflow_assembly,backflow_assembly.property,backflow_assembly.backflow_type,backflow_tests').then(response => {
                this.backflow_test_report = response.data.data;
                this.client_id = this.backflow_test_report.backflow_assembly.property.client_id;
                this.getProperties();
                this.property_id = this.backflow_test_report.backflow_assembly.property_id;
                this.getBackflowAssemblies();
            });
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
                this.$http.get('/backflow_assemblies?includes=backflow_type&property_id=' + this.property_id).then(response => {
                    this.backflow_assemblies = response.data.data;
                    if(this.backflow_assemblies.length == 1){
                       this.backflow_test_report.backflow_assembly_id=this.backflow_assemblies[0].id;
                       this.backflow_test_report.backflow_assembly=this.backflow_assemblies[0];
                     }
                 });
            }
            else{
                this.backflow_assemblies = [];
            }
        },
        setBackflow(){
            let assemblies = this.backflow_assemblies.filter(a => (this.backflow_test_report.backflow_assembly_id == a.id));
            this.backflow_test_report.backflow_assembly=this.backflow_assemblies[0];
        },
        addTest(){
            let id = localStorage.getItem('id')
            this.backflow_test_report.backflow_tests.push({backflow_test_report_id: this.backflow_test_report.id, tested_on: this.today, contact_id: id});
        },
        addRepair(){
            this.backflow_test_report.backflow_repairs.push({});
        },
        save () {
            if((!this.backflow_test_report.backflow_assembly_id)||(!this.backflow_test_report.backflow_installed_to_code)){
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
        },
        saveTest (test) {
            if(!this.backflow_test_report.id){
                this.save();
                return;
            }
            test.backflow_test_report_id = this.backflow_test_report.id;
            if(!test.id){
                this.$http.post('/backflow_test',test)
                    .then((results) => {
                        test.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/backflow_test/' + test.id, test);
            }
        }
    },
    computed:{
        today() {
            return moment().format('YYYY-MM-DD');
        },
    },
};
</script>

