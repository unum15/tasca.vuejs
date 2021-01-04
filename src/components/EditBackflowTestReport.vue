<template>
    <div  style="padding-bottom:100px;">
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
                        style="text-align:left"
                    >
                        <template v-slot:cell(include)="data">
                                <b-form-checkbox v-if="data.item.backflow_test_reports.length" v-model="data.item.include" />
                        </template>
                        <template v-slot:cell(serial_number)="data">
                            <a :href="'/backflow_assembly/'+data.item.id">
                                {{ data.value }}
                            </a>
                        </template>
                    </b-table>
                    </b-col>
                </b-row>
                <div v-if="backflow_assembly.id && backflow_assembly.backflow_test_reports.length">
                    <b-row>
                        <b-col>
                            <b-form-group label="Tag Year End">
                              <b-form-input
                                type="number"
                                v-model="backflow_test_report.tag_year"
                                @input="save"
                              >
                              </b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col>
                        </b-col>
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
                            <b-form-group label="Submitted Date">
                              <b-form-input
                                type="date"
                                v-model="backflow_test_report.submitted_date"
                                @input="save"
                              >
                              </b-form-input>
                            </b-form-group>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-form-group label="Proper installation and use" style="text-align:left;">
                                <b-form-radio v-model="backflow_test_report.backflow_installed_to_code" name="backflow_installed_to_code" value="true">To Code</b-form-radio>
                                <b-form-radio v-model="backflow_test_report.backflow_installed_to_code" name="backflow_installed_to_code" value="false">Not To code</b-form-radio>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Assembly Notes">
                                <b-form-textarea
                                    v-model="backflow_assembly.notes"
                                    @input="saveBackflowAssembly"
                                >
                                </b-form-textarea>
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
                    <b-row v-if="active_reports.length>1">
                        <b-table
                            small
                            striped
                            hover
                            :items="active_reports"
                            :fields="active_reports_fields"
                            id="tests-table"
                        >
                            <template v-slot:cell(backflow_tests)="data">
                                {{ data.value.length }}
                            </template>
                             <template v-slot:cell(show_details)="row">
                                <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                                  {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                                </b-button>
                              </template>
                             <template v-slot:row-details="data">
                                <b-card>
                                  <b-row v-for="test in data.item.backflow_tests" :key="test.id">
                                    {{ test }}
                                  </b-row>
                        
                                  <b-button size="sm" @click="deleteReport(data.item.id)">Delete Report</b-button>
                                </b-card>
                            </template>
                        </b-table>
                    </b-row>
                    <b-row>
                        <b-col style="font-weight:bold;text-align:left;font-size:200%;">
                            Test Results
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
                            id="tests-table"
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
                                        @change="checkPassed(data.item);saveTest(data.item)"
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
                                        @change="checkPassed(data.item);saveTest(data.item)"
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
                                <img src="@/assets/failed.png" v-if="!data.item.passed" @click.stop="markTestPassed(data.item.id)" fluid alt="failed" style="width:20px;cursor:pointer;" />
                                <img src="@/assets/checkmark.png" v-if="data.item.passed" @click.stop="markTestFailed(data.item.id)" fluid alt="passed" style="width:20px;cursor:pointer;" />
                            </template>
                            <template v-slot:cell(actions)="data">
                                <img src="@/assets/delete.png" @click.stop="deleteTest(data.item.id)" fluid alt="delete" style="width:20px;cursor:pointer;" />
                            </template>
                        </b-table>
                    </b-row>
                    <b-row>
                        <b-col>
                            <b-button @click="addTest">Add Test</b-button>
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col style="font-weight:bold;text-align:left;font-size:200%;">
                            Repairs
                        </b-col>
                    </b-row>
                    <b-row>
                        <b-col>
                        </b-col>
                        <b-col>
                        </b-col>
                        <b-col>
                            <b-form-group label="Repairs By">
                                <b-form-select
                                    v-model="repair_contact_id"
                                    @change="saveRepairs();saveCleanings();"
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
                                    @change="saveRepairs();saveCleanings();"
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
                                    <b-col style="font-weight:bold;">
                                        {{ valve.name }} Valve
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col style="font-weight:bold;text-align:left;">
                                        Cleaned
                                    </b-col>
                                    <b-col style="font-weight:bold;text-align:left;">
                                        Replaced
                                    </b-col>
                                </b-row>
                                <b-row style="text-align:left;">
                                    <b-col>
                                        <b-form-checkbox-group
                                            v-model="cleanings[valve.id]"
                                            :name="'valve-cleanings-' + valve.id"
                                            @change="saveCleaning($event, valve.id)"
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
                                            @change="saveRepair($event, valve.id);"
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
                </div>
            </b-container>
            <b-modal
                id="modal-preview"
                title="Backflow Test Report Preview"
                @show="showPreview"
                size="lg"
                ok-only
            >
                <div v-html="preview">
                </div>
                <b-button @click="previousPreview">Previous</b-button>
                <b-button @click="nextPreview">Next</b-button>
            </b-modal>
            <div>
                <b-button v-if="backflow_assembly.id && !backflow_assembly.backflow_test_reports.length" @click="newReport">New Report</b-button>
                <b-button @click="$router.push('/backflow_test_reports')">Done</b-button>
                <b-button v-b-modal.modal-preview v-if="includedBackflowAssemblies.length">Preview</b-button>
                <b-button @click="pdf" v-if="includedBackflowAssemblies.length">PDF</b-button>
                <b-button @click="pdfTag" v-if="includedBackflowAssemblies.length">PDF Tag</b-button>
                <b-button @click="submit" v-if="includedBackflowAssemblies.length">Submit</b-button>
            </div>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
import moment from 'moment';
import backflows from '../common/Backflows.js';
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
            preview: null,
            preview_backflow_test_report_index: null,
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
            active_reports_fields: [
                {
                    key: 'id',
                    label: 'ID',
                    sortable: false,
                },
                {
                    key: 'serial_number',
                    label: 'SN',
                    sortable: false,
                },
                {
                    key: 'backflow_tests',
                    label: '#Test',
                    sortable: false,
                },
                {
                    key: 'show_details',
                    label: '',
                    sortable: false,
                },
            ],
            backflow_fields: [
                {
                    key: 'use',
                    label: 'Use',
                    sortable: true,
                },
                {
                    key: 'placement',
                    label: 'Placement',
                    sortable: true,
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
                    },
                    {
                        key: 'actions',
                        label: '',
                        sortable: false
                    }
            ]
        };
    },
    created () {
        this.$http.get('/settings').then(response => {
            this.settings = response.data;
            if(this.settings.operating_company_client_id){
                this.$http.get('/contacts?client_id=' + this.settings.operating_company_client_id).then(response => {
                    this.contacts = response.data;
                });
            }
        })
        this.$http.get('/clients?backflow_only=true').then(response => {
            this.clients = response.data;
        });
        this.repair_contact_id = localStorage.getItem('id');
        this.repair_date = this.today;
        if(this.backflow_test_report_id !== null) {
            this.getRequestedReport();
        }
        this.passed = backflows.passed // shared code between here and CreateBackflowTestReport;
    },
    methods: {
        getRequestedReport () {
            this.$http.get('/backflow_test_report/' + this.backflow_test_report_id + '?includes=backflow_assembly,backflow_assembly.property,backflow_assembly.backflow_type,backflow_tests,backflow_assembly.backflow_type.backflow_super_type,backflow_assembly.backflow_test_reports,backflow_assembly.backflow_test_reports.backflow_tests').then(response => {
                let report = response.data.data
                this.client_id = report.backflow_assembly.property.client_id;
                this.getProperties();
                this.property_id = report.backflow_assembly.property_id;
                this.getBackflowAssemblies();
                this.backflow_assembly_id = report.backflow_assembly.id;
                this.backflow_assembly = report.backflow_assembly;
                this.backflow_test_report = report.backflow_assembly;
                this.getValves();
                this.getReport();
            });
        },
        getProperties () {
            this.property_id = null;
            this.cleanings = [];
            this.repairs = [];
            this.filter = null;
            this.repair_contact_id = null;
            this.repair_date = null;
            this.backflow_test_report = {
                id: null,
                backflow_tests: [],
                backflow_repairs: [],
                backflow_installed_to_code: true
            },
            this.backflow_assemblies = [];
            this.reports = [];
            this.report_id = null;
            this.backflow_assembly = { backflow_type: null};
            this.valves = [];
            this.parts = [];
            if(this.client_id){
                this.$http.get('/properties?client_id=' + this.client_id).then(response => {
                    this.properties = response.data
                    if(this.properties.length == 1){
                       this.property_id= this.properties[0].id;
                       this.getBackflowAssemblies();
                    }
                });
            }
            else{
              this.properties = []
            }
        },
        getValves() {
            this.valves = [];
            if((this.backflow_assembly.backflow_type)&&(this.backflow_assembly.backflow_type.backflow_super_type_id)){
                this.$http.get('/backflow_valves?includes=backflow_valve_parts&backflow_super_type_id=' + this.backflow_assembly.backflow_type.backflow_super_type_id).then(response => {
                  this.valves = response.data.data;
                })
            }
        },
        getReport() {
            this.repair_contact_id = localStorage.getItem('id');
            this.repair_date = this.today;
            this.repairs = [];
            this.cleanings = [];
            if((this.backflow_assembly)&&(this.backflow_assembly.backflow_test_reports.length)){
                this.$http.get('/backflow_test_report/'+this.backflow_assembly.backflow_test_reports[0].id+'?includes=backflow_tests,backflow_repairs,backflow_cleanings').then(response => {
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
        },
        getBackflowAssemblies(){
            if(this.property_id){
                this.$http.get('/backflow_assemblies?includes=backflow_size,backflow_type,backflow_type.backflow_super_type,backflow_manufacturer,backflow_model,backflow_test_reports.backflow_tests&recent_reports=30&active=1&property_id=' + this.property_id).then(response => {
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
        newReport(){
            this.backflow_test_report = {
                id: '',
                backflow_tests: [],
                backflow_repairs: [],
                backflow_installed_to_code: true,
                report_date: this.today,
                submitted_date: '',
                backflow_assembly_id : this.backflow_assembly.id
            };
            this.save();
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
        save () {
            if((!this.backflow_test_report.backflow_assembly_id)||(!this.backflow_test_report.backflow_installed_to_code)){
                return;
            }
            if(!this.backflow_test_report.id){
                this.$http.post('/backflow_test_report',this.backflow_test_report)
                    .then((results) => {
                        this.backflow_test_report.id = results.data.data.id;
                        this.report_id = results.data.data.id;
                        this.backflow_assembly.backflow_test_reports.push(this.backflow_test_report);
                    });
            }
            else{
                this.$http.patch('/backflow_test_report/' + this.backflow_test_report.id, this.backflow_test_report);
            }
        },
        saveBackflowAssembly() {
            this.$http.patch('/backflow_assembly/' + this.backflow_assembly.id, this.backflow_assembly);
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
                switch(this.backflow_assembly.backflow_type.backflow_super_type.name){
                    case 'RP':
                        this.test_fields[2].label = 'RP Test';
                        this.test_fields[3].label = 'Check Test';
                        break;
                    case 'DC':
                        this.test_fields[2].label = 'First Test';
                        this.test_fields[3].label = 'Second Test';
                        break;
                    case 'PVB':
                        this.test_fields[2].label = 'Air Inlet Test';
                        this.test_fields[3].label = 'Check Test';
                        break;
                }
                this.getValves();
                this.getReport();
            }
            else{
                this.backflow_assembly={};
            }
        },
        saveCleaning (values, valve_id){
            if(!Array.isArray(values)){
                return;
            }
            let cleaning = {
                parts: values,
                valve_id: valve_id,
                contact_id: this.repair_contact_id,
                cleaned_on: this.repair_date
            }
            this.$http.put('/backflow_test_report/' + this.backflow_test_report.id + '/cleanings', cleaning);
        },
        saveCleanings(){
            this.cleanings.map( (values, valve_id) => {
                this.saveCleaning(values, valve_id);
            });
        },
        saveRepair(values, valve_id){
            let repair = {
                parts: values,
                valve_id: valve_id,
                contact_id: this.repair_contact_id,
                repaired_on: this.repair_date
            }
            this.$http.put('/backflow_test_report/' + this.backflow_test_report.id + '/repairs', repair);
        },
        saveRepairs(){
            this.repairs.map( (values,valve_id) => {
                this.saveRepair(values,valve_id);
            });
        },
        pdf(){
            let url = '/api/backflow_test_reports/pdf?';
            this.includedBackflowAssemblies.map(a => {
                if(a.backflow_test_reports.length){
                    url += 'backflow_test_report_id[]='+a.backflow_test_reports[0].id+'&';
                }
            })
            window.open(url, 'backflow_pdf');
        },
        pdfTag(){
            let url = '/api/backflow_assemblies/tags/pdf?';
            this.includedBackflowAssemblies.map(a => {
                if(a.backflow_test_reports.length){
                    url += 'backflow_assembly_id[]='+a.backflow_test_reports[0].backflow_assembly_id+'&';
                }
            })
            window.open(url, 'backflow_tag_pdf');
        },
        showPreview(){
            this.preview_backflow_test_report_index = 0;
            this.getPreview();
        },
        nextPreview(){
            this.preview_backflow_test_report_index++;
            if(this.preview_backflow_test_report_index >= this.includedBackflowAssemblies.length){
                this.preview_backflow_test_report_index = 0;
            }
            this.getPreview();
        },
        previousPreview(){
            this.preview_backflow_test_report_index--;
            if(this.preview_backflow_test_report_index < 0){
                this.preview_backflow_test_report_index = this.includedBackflowAssemblies.length-1;
            }
            this.getPreview();
        },
        getPreview(){
            this.$http.get('/backflow_test_reports/html?backflow_test_report_id[]='+this.includedBackflowAssemblies[this.preview_backflow_test_report_index].backflow_test_reports[0].id).then(response => {
                this.preview = response.data;
            });
        },
        previewTab(){
            let url = '/api/backflow_test_reports/html?';
            this.includedBackflowAssemblies.map(a => {
                if(a.backflow_test_reports.length){
                    url += 'backflow_test_report_id[]='+a.backflow_test_reports[0].id+'&';
                }
            })
            window.open(url, 'backflow_preview');
        },
        submit(){
            this.includedBackflowAssemblies.map(a => {
                if(a.backflow_test_reports.length){
                    a.backflow_test_reports[0].submitted_date = this.today
                    this.$http.patch('/backflow_test_report/' + a.backflow_test_reports[0].id, a.backflow_test_reports[0]);
                }
            })
        },
        markTestPassed(id){
            let a = this.backflow_test_report.backflow_tests.filter(a => (a.id == id));
            a[0].passed = true;
            this.saveTest(a[0]);
        },
        markTestFailed(id){
            let a = this.backflow_test_report.backflow_tests.filter(a => (a.id == id));
            a[0].passed = false;
            this.saveTest(a[0]);
        },
        checkPassed(item){
            item.backflow_type = this.backflow_assembly.backflow_type;
            item.passed = this.passed(item);
            this.$root.$emit('bv::refresh::table', 'tests-table')
        },
        deleteTest(id) {
            if(confirm("Delete test?")){
                if(id){
                    this.$http.delete('/backflow_test/' + id).then(() => {
                        this.getReport();
                    });
                }
                else{
                    this.getReport();
                }
            }
        },
        deleteReport(id) {
            if(confirm("Delete report?")){
                if(id){
                    this.$http.delete('/backflow_test_report/' + id).then(() => {
                        this.backflow_assemblies.map(a => {
                            a.backflow_test_reports = a.backflow_test_reports.filter(r => r.id != id);
                        });
                    });
                }
            }
        },
    },
    computed:{
        today() {
            return moment().format('YYYY-MM-DD');
        },
        includedBackflowAssemblies(){
            return this.backflow_assemblies.filter(a => a.include);
        },
        active_reports() {
            let reports = [];
            this.backflow_assembly.backflow_test_reports.map(r => {
                if(!r.submitted_date){
                    let report = {
                        id : r.id,
                        serial_number: this.backflow_assembly.serial_number,
                        backflow_tests: r.backflow_tests
                    };
                    reports.push(report);
                }
            });
            return reports;
        }
    },
};
</script>
<style>
 .modal-lg {
    max-width: 1024px !important;
    width: 1024px !important;
   }

  .modal-dialog {
    max-width: 1024px !important;
    width: 1024px !important;
  }
  
  .left-align {
    text-align: left;
  }
</style>
