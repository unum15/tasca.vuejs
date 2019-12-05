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
                        
                        <template v-slot:cell(contact_id)="data">
                            <b-form-select
                                    v-model="data.item.contact_id"
                                    @change="saveTest(data.item)"
                                    :options="contacts"
                                    value-field="id"
                                    text-field="name"
                                    :state="data.item.contact_id != null"
                                    required
                                >
                                </b-form-select>
                        </template>
                        
                        
                        <template v-slot:cell(tested_on)="data">
                            <b-form-input
                                    v-model="data.item.tested_on"
                                    @change="saveTest(data.item)"
                                    type="date"
                                    :state="data.item.tested_on != null"
                                >
                                </b-form-input>
                        </template>
                        <template v-slot:cell(reading_1)="data">
                            <b-form-input
                                    v-model="data.item.reading_1"
                                    @change="saveTest(data.item)"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="11"
                                    :state="data.item.reading_1 != null"
                                >
                                </b-form-input>
                        </template>
                        <template v-slot:cell(reading_2)="data">
                            <b-form-input
                                    v-model="data.item.reading_2"
                                    @change="saveTest(data.item)"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="11"
                                    :state="data.item.reading_2 != null"
                                >
                                </b-form-input>
                        </template>
                        <template v-slot:cell(notes)="data">
                            <b-form-input
                                    v-model="data.item.notes"
                                    @change="saveTest(data.item)"
                                    type="text"
                                >
                                </b-form-input>
                        </template>
                        <template v-slot:cell(result)="data">
                            <div v-if="['DCDA', 'DC'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
                                <b-badge v-if="data.item.reading_1 >= 1 && data.item.reading_2 >= 1" variant="success">Closed Tight</b-badge>
                                <b-badge v-else variant="danger">Leaked</b-badge>
                            </div>
                            <div v-if="['PCVB', 'AVB', 'SVB', 'PVB'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
                                <b-badge v-if="(data.item.reading_1 >= 1) && (data.item.reading_2) >= 1" variant="success">Opened Under 1#</b-badge>
                                <b-badge v-else variant="danger">Did Not Open</b-badge>
                            </div>
                            <div v-if="['RPDA', 'RP'].includes(backflow_test_report.backflow_assembly.backflow_type.name)">
                                <b-badge v-if="data.item.reading_1 - data.item.reading_2 >= 2" variant="success">Closed Tight</b-badge>
                                <b-badge v-else variant="danger">Leaked</b-badge>
                            </div>
                        </template>
                    </b-table>
                </b-row>
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
                <b-row>
                    <b-col>
                        <b-form-group label="Repairs By">
                            <b-form-select
                                v-model="repair_contact_id"
                                @change="save"
                                :options="contacts"
                                value-field="id"
                                text-field="name"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Date">
                            <b-form-input
                                v-model="repair_date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col v-for="valve in valves" :key="valve.id">
                        {{ valve.name }}
                        <div v-for="part in valve.backflow_valve_parts" :key="part.id" style="text-align:left">
                            <b-form-checkbox>
                              {{ part.name }}
                            </b-form-checkbox>
                        </div>
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
            filter: null,
            repair_contact_id: null,
            repair_date: null,
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
                        key: 'contact_id',
                        label: 'Tested By',
                        sortable: true
                    },
                    {
                        key: 'tested_on',
                        label: 'Date',
                        sortable: true
                    },
                    {
                        key: 'reading_1',
                        label: 'First Valve',
                        sortable: true
                    },
                    {
                        key: 'reading_2',
                        label: 'Second Valve',
                        sortable: true
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
                        sortable: false
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
        this.repair_contact_id = localStorage.getItem('id');
        this.repair_date = this.today;
        if(this.backflow_test_report_id !== null) {
            this.$http.get('/backflow_test_report/' + this.backflow_test_report_id + '?includes=backflow_assembly,backflow_assembly.property,backflow_assembly.backflow_type,backflow_tests').then(response => {
                this.backflow_test_report = response.data.data;
                this.client_id = this.backflow_test_report.backflow_assembly.property.client_id;
                this.getProperties();
                this.getValves();
                this.property_id = this.backflow_test_report.backflow_assembly.property_id;
                this.getBackflowAssemblies();
                if(this.backflow_test_report.backflow_repairs.length){
                    this.repair_contact_id = this.backflow_test_report.backflow_repairs[0].contact_id;
                    this.repair_date = this.backflow_test_report.repaired_on;
                }
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
        getValves() {
          if((this.backflow_test_report.backflow_assembly.backflow_type)&&(this.backflow_test_report.backflow_assembly.backflow_type.backflow_super_type_id)){
            this.$http.get('/backflow_valves?includes=backflow_valve_parts&backflow_super_type_id=' + this.backflow_test_report.backflow_assembly.backflow_type.backflow_super_type_id).then(response => {
              this.valves = response.data.data;
            })
          }
          else{
            this.valves = []
          }
        },
        getBackflowAssemblies(){
            if(this.property_id){
                this.$http.get('/backflow_assemblies?includes=backflow_type&property_id=' + this.property_id).then(response => {
                    this.backflow_assemblies = response.data.data;
                    if(this.backflow_assemblies.length == 1){
                       this.backflow_test_report.backflow_assembly_id=this.backflow_assemblies[0].id;
                       this.backflow_test_report.backflow_assembly=this.backflow_assemblies[0];
                       this.getValves();
                     }
                 });
            }
            else{
                this.backflow_assemblies = [];
            }
        },
        setBackflow(){
            let assemblies = this.backflow_assemblies.filter(a => (this.backflow_test_report.backflow_assembly_id == a.id));
            this.backflow_test_report.backflow_assembly=assemblies[0];
            this.getValves();
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

