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
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row v-if="property_id">
                    <b-col>
                      <b-table
                        ref="backflowsTable"
                        selectable
                        :items="backflow_assemblies"
                        :fields="backflow_fields"
                        striped
                        responsive="sm"
                        @row-selected="backflowSelected"
                        context-changed="tableUpdated"
                        select-mode="single"
                    >
                        <template v-slot:cell(include)="data">
                                <b-form-checkbox v-model="data.item.include" />
                        </template>
                    </b-table>
                    </b-col>
                </b-row>
                <div v-if="backflow_assembly.id">
                    <b-row>
                        <b-col>
                            <b-form-group label="Report Date">
                              <b-form-input
                                type="date"
                                v-model="backflow_test_report.report_date"
                                @input="save"
                              >
                              </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-button @click="newReport">New Report</b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            {{ backflow_assembly.use }}
                        </b-col>
                        <b-col>
                            {{ backflow_assembly.placement }}
                        </b-col>
                        <b-col>
                            {{ backflow_assembly.backflow_type.name }}
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
                                    @input="save"
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
                                    @input="save"
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
                                <b-form-checkbox
                                    v-model="data.item.passed"
                                    @change="saveTest(data.item)"
                                    
                                >
                                </b-form-checkbox>
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
                            <b-container>
                                <b-row>
                                    <b-col>
                                        {{ valve.name }} Valve
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
                                        Cleaned
                                    </b-col>
                                    <b-col>
                                        Replaced
                                    </b-col>
                                </b-row>
                                <b-row style="text-align:left;">
                                    <b-col>
                                        <b-form-checkbox-group
                                            v-model="cleanings[valve.id]"
                                            :name="'valve-cleanings-' + valve.id"
                                            @input="saveCleaning(valve.id)"
                                            :options="valve.backflow_valve_parts"
                                            value-field="id"
                                            text-field="name"
                                            stacked
                                        >
                                        </b-form-checkbox-group>
                                    </b-col>
                                    <b-col>
                                        <b-form-checkbox-group
                                            v-model="repairs[valve.id]"
                                            :name="'valve-repairs-' + valve.id"
                                            @input="saveRepair(valve.id)"
                                            :options="valve.backflow_valve_parts"
                                            value-field="id"
                                            text-field="name"
                                            stacked
                                        >
                                        </b-form-checkbox-group>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-col>
                    </b-row>
                </div>
        </b-container>
            <b-button @click="$router.push('/backflow_test_reports')">Done</b-button>
            <b-button @click="preview" v-if="includedBackflowAssemblies.length">Preview</b-button>
            <b-button @click="pdf" v-if="includedBackflowAssemblies.length">PDF</b-button>
            <b-button @click="submit" v-if="includedBackflowAssemblies.length">Submit</b-button>
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
            cleanings: [],
            repairs: [],
            filter: null,
            repair_contact_id: null,
            repair_date: null,
            backflow_test_report: {
                id: null,
                backflow_tests: [],
                backflow_repairs: [],
                backflow_installed_to_code: true
            },
            backflow_assemblies: [],
            reports: [],
            report_id: null,
            backflow_assembly: { backflow_type: null},
            backflow_fields: [
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
                    label: 'Manufacturer',
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
                    label: 'Serial',
                    sortable: true
                },
                {
                    key: 'include',
                    label: 'Include',
                    sortable: false
                }
            ],
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
                this.property_id = this.backflow_test_report.backflow_assembly.property_id;
                this.backflow_assembly = this.backflow_test_report.backflow_assembly;
                this.backflow_assembly_id = this.backflow_test_report.backflow_assembly.id;
                this.backflow_assembly = this.backflow_test_report.backflow_assembly;
                this.getBackflowAssemblies();
                this.getValves();
                this.report_id = this.backflow_test_report_id;
                this.getReport();
            });
        }
    },
    updated () {
            this.$nextTick(function () {
                if(this.$refs.backflowsTable){
                    let index = this.backflow_assemblies.indexOf(this.backflow_assembly);
                    this.$refs.backflowsTable.selectRow(index);
                }
            });
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
          if((this.backflow_assembly.backflow_type)&&(this.backflow_assembly.backflow_type.backflow_super_type_id)){
            this.$http.get('/backflow_valves?includes=backflow_valve_parts&backflow_super_type_id=' + this.backflow_assembly.backflow_type.backflow_super_type_id).then(response => {
              this.valves = response.data.data;
            })
          }
          else{
            this.valves = []
          }
        },
        getReports() {
          if(this.backflow_assembly.id){
            this.$http.get('/backflow_test_reports?backflow_assembly_id=' + this.backflow_assembly.id).then(response => {
                this.reports = response.data.data;
                this.reports = this.reports.sort((a, b) => (a.report_date < b.report_date) ? 1 : -1)
                if(this.reports.length){
                    this.report_id = this.reports[0].id;
                    this.getReport();
                }
            })
          }
          else{
            this.reports = []
          }
        },
        getReport() {
          if(this.report_id){
            this.$http.get('/backflow_test_report/' + this.report_id + '?includes=backflow_assembly,backflow_assembly.property,backflow_assembly.backflow_type,backflow_tests,backflow_repairs,backflow_cleanings').then(response => {
                this.backflow_test_report = response.data.data;
                if(this.backflow_test_report.backflow_repairs.length){
                    this.repair_contact_id = this.backflow_test_report.backflow_repairs[0].contact_id;
                    this.repair_date = this.backflow_test_report.backflow_repairs[0].repaired_on;
                }
                this.backflow_test_report.backflow_repairs.map(r => {
                    this.repairs[r.backflow_valve_id] = [];
                });
                this.backflow_test_report.backflow_repairs.map(r => {
                    this.repairs[r.backflow_valve_id].push(r.backflow_valve_part_id);
                });
                this.backflow_test_report.backflow_cleanings.map(c => {
                    this.cleanings[c.backflow_valve_id] = [];
                });
                this.backflow_test_report.backflow_cleanings.map(c => {
                    this.cleanings[c.backflow_valve_id].push(c.backflow_valve_part_id);
                });
            });
          }
          else{
            this.backflow_test_report =
            {
                id: '',
                backflow_tests: [],
                backflow_repairs: [],
                backflow_installed_to_code: true,
                report_date: this.today,
                backflow_assembly_id : this.backflow_assembly.id
            }
            this.save();
          }
        },
        getBackflowAssemblies(){
            if(this.property_id){
                this.$http.get('/backflow_assemblies?includes=backflow_size,backflow_type,backflow_manufacturer,backflow_model&property_id=' + this.property_id).then(response => {
                    let assemblies = response.data.data;
                    assemblies.map( a => {
                        a.include=true;
                    });
                    this.backflow_assemblies = assemblies;
                    if(this.backflow_assemblies.length == 1){
                       this.backflow_assembly_id=this.backflow_assemblies[0].id;
                       this.backflow_assembly=this.backflow_assemblies[0];
                       this.getValves();
                    }
                    else{
                       let row = this.backflow_assemblies.findIndex(b => b.id === this.backflow_assembly_id);
                       this.$refs.backflowsTable.selectRow(row);
                    }
                 });
            }
            else{
                this.backflow_assemblies = [];
            }
        },
        setBackflow(){
            let assemblies = this.backflow_assemblies.filter(a => (this.backflow_assembly_id == a.id));
            this.backflow_assembly=assemblies[0];
            this.getValves();
        },
        addTest(){
            let id = localStorage.getItem('id')
            this.backflow_test_report.backflow_tests.push({backflow_test_report_id: this.backflow_test_report.id, tested_on: this.today, contact_id: id});
        },
        addRepair(){
            this.backflow_repairs.push({});
        },
        save () {
            if((!this.backflow_test_report.backflow_assembly_id)||(!this.backflow_test_report.backflow_installed_to_code)){
                return;
            }
            if(!this.backflow_test_report.id){
                this.$http.post('/backflow_test_report',this.backflow_test_report)
                    .then((results) => {
                        this.backflow_test_report.id = results.data.data.id;
                        this.report_id = results.data.data.id;
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
        },
        backflowSelected (items) {
            if(items.length){
                this.backflow_assembly=items[0];
                this.getReports();
                this.getValves();
            }
            else{
                this.backflow_assembly={};
            }
        },
        saveCleaning (valve_id){
            let cleaning = {
                parts: this.cleanings[valve_id],
                valve_id: valve_id,
                contact_id: this.repair_contact_id,
                cleaned_on: this.repair_date
            }
            this.$http.put('/backflow_test_report/' + this.backflow_test_report.id + '/cleanings', cleaning);
        },
        saveRepair (valve_id){
            let repair = {
                parts: this.repairs[valve_id],
                valve_id: valve_id,
                contact_id: this.repair_contact_id,
                repaired_on: this.repair_date
            }
            this.$http.put('/backflow_test_report/' + this.backflow_test_report.id + '/repairs', repair);
        },
        newReport (){
            this.reports.unshift({
                id: '',
                backflow_tests: [],
                backflow_repairs: [],
                backflow_installed_to_code: true,
                report_date: this.today
            });
            this.report_id='';
            this.cleanings=[];
            this.repairs=[];
            this.repair_contact_id = localStorage.getItem('id');
            this.repair_date=this.today;
            this.getReport();
        },
        pdf (){
            let url = '/api/backflow_test_reports/pdf?';
            this.includedBackflowAssemblies.map(a => {
                url += 'backflow_test_report_id[]='+a.id+'&'
            })
            window.open(url, 'backflow_pdf');
        },
        preview(){
            window.open('/api/backflow_test_reports/html?backflow_test_report_id[]='+this.backflow_test_report.id, 'backflow_preview');
        },
        submit(){
        }
    },
    computed:{
        today() {
            return moment().format('YYYY-MM-DD');
        },
        includedBackflowAssemblies(){
            return this.backflow_assemblies.filter(a => a.include);
        }
    },
};
</script>

