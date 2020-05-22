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
                responsive
            >
                <template v-slot:cell(test_1)="data">
                    <b-form-input
                      type="number"
                      step="0.1"
                      min="0"
                      max="11"
                      v-model="data.item.reading_1"
                      @change="save(data.index)"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(test_2)="data">
                    <b-form-input
                      type="number"
                      step="0.1"
                      min="0"
                      max="11"
                      v-model="data.item.reading_2"
                      @change="save(data.index)"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(notes)="data">
                    <b-form-input
                      type="text"
                      v-model="data.item.reading_notes"
                      @change="save(data.index)"
                    >
                    </b-form-input>
                </template>
                <template v-slot:cell(actions)="data">
                    <img src="@/assets/new.png" v-b-tooltip.hover title="New Test" @click="newTest(data.index)" fluid alt="+" style="width:20px;cursor:pointer;" />
                    <a v-if="data.item.backflow_test_report_id" :href="'/backflow_test_report/'+data.item.backflow_test_report_id" target="edit_report" >
                        <img src="@/assets/edit.png" v-b-tooltip.hover title="Edit Test" fluid alt="edit" style="margin-left:5px;width:25px;" />
                    </a>
                </template>
            </b-table>
            <b-button @click="$router.push('/backflow_test_reports')">Done</b-button>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import moment from 'moment';
import backflows from '../common/Backflows.js';
export default {
    name: 'CreateBackflowTestReport',
    components: {
        'TopMenu': TopMenu
    },
    props: {
    },
    data () {
        return {
            client_id: null,
            property_id: null,
            clients: [],
            contact_id: null,
            properties: [],
            backflow_assemblies: [],
            tests: [],
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
                        label: 'Test 1',
                        sortable: false
                    },
                    {
                        key: 'test_2',
                        label: 'Test 2',
                        sortable: false
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
                        sortable: false
                    },
                    {
                        key: 'actions',
                        label: 'Actions',
                        sortable: false
                    }
                ]
        };
    },
    created () {
        this.$http.get('/clients?backflow_only=true').then(response => {
            this.clients = response.data;
        });
        this.contact_id = localStorage.getItem('id')
        this.passed = backflows.passed // shared code between here and EditBackflowTestReport;
    },
    methods: {
        getProperties() {
          this.backflow_assemblies = [];
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
                this.$http.get('/backflow_assemblies?includes=backflow_size,backflow_type,backflow_manufacturer,backflow_model,backflow_super_type,backflow_type.backflow_super_type.backflow_valves,backflow_test_reports,backflow_test_reports.backflow_tests&property_id=' + this.property_id).then(response => {
                    let bas = response.data.data;
                    bas.map(ba => {
                        if(ba.backflow_test_reports.length){
                            if((ba.backflow_test_reports[0].submitted_date==null)&&(ba.backflow_test_reports[0].backflow_tests.length)){
                                let last_test = ba.backflow_test_reports[0].backflow_tests[ba.backflow_test_reports[0].backflow_tests.length-1];
                                ba.reading_1 = last_test.reading_1;
                                ba.reading_2 = last_test.reading_2;
                                ba.reading_notes = last_test.notes;
                                ba.backflow_test_report_id = ba.backflow_test_reports[0].id;
                            }
                        }
                    });
                    this.backflow_assemblies = bas;
                 });
            }
            else{
                this.backflow_assemblies = [];
            }
        },
        save (index) {
            let item = this.backflow_assemblies[index]
            if(!item.backflow_test_report_id){
                this.$http.post('/backflow_test_report',{backflow_assembly_id: item.id, backflow_installed_to_code: true, 'report_date': this.today})
                    .then((results) => {
                        this.backflow_assemblies[index].backflow_test_report_id = results.data.data.id;
                        this.saveTest(index);
                    });
            }
            else{
                this.saveTest(index);
            }
        },
        saveTest (index){
            let item = this.backflow_assemblies[index];
            let passed = this.passed(item);
            let test = {
                backflow_test_report_id: item.backflow_test_report_id,
                contact_id: this.contact_id,
                reading_1: item.reading_1,
                reading_2: item.reading_2,
                notes: item.reading_notes,
                tested_on: this.today,
                passed: passed
            };
            if(!item.test_id){
                this.$http.post('/backflow_test',test)
                    .then((results) => {
                        this.backflow_assemblies[index].test_id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/backflow_test/' + item.test_id, test);
            }
        },
        edit(id){
            let edit_route = this.$router.resolve({name: 'EditBackflowTestReport', query: {backflow_test_report_id: id}});
            window.open(edit_route.href, '_blank');
        },
        newTest (index){
            this.backflow_assemblies[index].test_id = null;
            this.backflow_assemblies[index].reading_1 = null;
            this.backflow_assemblies[index].reading_2 = null;
            this.backflow_assemblies[index].reading_notes = null;
        }
    },
    computed:{
        today() {
            return moment().format('YYYY-MM-DD');
        },
    },
};
</script>

