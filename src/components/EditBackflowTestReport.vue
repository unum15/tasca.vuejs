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
                            >
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Report Notes">
                            <b-form-textarea
                                v-model="backflow_test_report.notes"
                                @change="save"
                            >
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col style="font-weight:bold">
                        Tests
                    </b-col>
                </b-row>
                <b-row>
                    <b-table
                        small
                        striped
                        hover
                        :filter="filter"
                        :items="backflow_test_report.backflow_tests"
                        :fields="test_fields"
                    >
                        <template v-slot:cell(id)="data">
                            <a :href="'/backflow_test_report/' + data.value"> {{ data.value }} </a>
                            <a :href="'/api/backflow_test_report/' + data.value + '/pdf'"> PDF </a>
                        </template>
                        
                        
                        <template v-slot:cell(result)="data">
                            <div v-if="['DCDA', 'DC'].includes(data.item.backflow_assembly.backflow_type.name)">
                                <b-badge v-if="data.item.last_test.reading_1 >= 1 && data.item.last_test.reading_2 >= 1" variant="success">Closed Tight</b-badge>
                                <b-badge v-else variant="danger">Leaked</b-badge>
                            </div>
                            <div v-if="['PCVB', 'AVB', 'SVB', 'PVB'].includes(data.item.backflow_assembly.backflow_type.name)">
                                <b-badge v-if="(data.item.last_test.reading_1 >= 1) && (data.item.last_test.reading_2) >= 1" variant="success">Opened Under 1#</b-badge>
                                <b-badge v-else variant="danger">Did Not Open</b-badge>
                            </div>
                            <div v-if="['RPDA', 'RP'].includes(data.item.backflow_assembly.backflow_type.name)">
                                <b-badge v-if="data.item.last_test.reading_1 - data.item.last_test.reading_2 >= 2" variant="success">Closed Tight</b-badge>
                                <b-badge v-else variant="danger">Leaked</b-badge>
                            </div>
                        </template>
                    </b-table>
                </b-row>
                    <div v-for="test,index in backflow_test_report.backflow_tests" :key="index">
                    <b-row v-if="['DCDA', 'DC'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
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
                            <b-col>
                                Check Valve #1
                            </b-col>
                            <b-col>
                                Check Valve #2
                            </b-col>
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
                    <b-row v-if="['PCVB', 'AVB', 'SVB', 'PVB'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
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
                            <b-col>
                                Air Inlet
                            </b-col>
                            <b-col>
                                Pressure Vacuum Breaker
                            </b-col>
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
                    <b-row v-if="['RPDA', 'RP'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
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
                        <b-col>
                            Check Valve #1 <Br />
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
                            
                            <b-form-group label="Differential Pressure Relief Valve">
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
                        <b-col>
                            <b-form-textarea
                                v-model="test.notes"
                                @change="saveTest(test)"
                            >
                            </b-form-textarea>
                        </b-col>
                        <b-col v-if="test.reading_2 - test.reading_1 >= 2" class="warning">
                            <b-badge variant="success">Passed</b-badge>
                        </b-col>
                        <b-col v-else>
                            <b-badge variant="danger">Failed</b-badge>
                        </b-col>
                    </b-row>
                </div>
                <b-row>
                    <b-col>
                        <b-button @click="addTest">Add Test</b-button>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col style="font-weight:bold">
                        Repairs
                    </b-col>
                </b-row>
            <div v-for="repair in backflow_test_report.backflow_repairs">
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
                    <b-col>
                        <b-form-group label="Valve Type">
                            <b-form-select
                                v-model="repair.backflow_valve_type_id"
                                @change="save"
                                :options="valves"
                                value-field="id"
                                text-field="name"
                                :state="repair.backflow_valve_type_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Part Replaced">
                            <b-form-select
                                v-model="repair.backflow_valve_part_id"
                                @change="save"
                                :options="parts"
                                value-field="id"
                                text-field="name"
                                :state="repair.backflow_valve_part_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
            </div>
            <b-row>
                <b-col>
                    <b-button @click="addRepair">Add Repair</b-button>
                </b-col>
            </b-row>
        </b-container>
        <b-button @click="$router.push('/backflow_test_reports')">Done</b-button><b-button @click="$router.push('/api/backflow_test_report/' + backflow_test_report.id + '/pdf')">PDF</b-button>
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
            parts: [],
            settings: {},
            test_fields: [
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
                        key: 'result',
                        label: 'Result',
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

