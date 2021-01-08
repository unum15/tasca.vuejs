<template>
    <div>
        
        <b-table
            small
            striped
            hover
            :items="backflow_assemblies"
            :fields="fields"
            responsive
        >
            <template v-slot:cell(notes)="data">
                <img src="@/assets/details.png" v-b-tooltip.hover.bottomleft :title="data.value" fluid alt="details" style="margin-left:5px;width:25px;" />
            </template>
            <template v-slot:cell(serial_number)="data">
                <a :href="'/backflow_assembly/'+data.item.id">
                    {{ data.value }}
                </a>
            </template>
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
            <template v-slot:cell(reading_notes)="data">
                <b-form-input
                  type="text"
                  v-model="data.item.reading_notes"
                  @change="save(data.index)"
                >
                </b-form-input>
            </template>
            <template v-slot:cell(actions)="data">
                <img src="@/assets/new.png" v-b-tooltip.hover.bottomleft title="New Test" @click="newTest(data.index)" fluid alt="+" style="width:20px;cursor:pointer;" />
                <a v-if="data.item.backflow_test_report_id" :href="'/backflow_test_report/'+data.item.backflow_test_report_id" target="edit_report" >
                    <img src="@/assets/edit.png" v-b-tooltip.hover.bottomleft title="Edit Test" fluid alt="edit" style="margin-left:5px;width:25px;" />
                </a>
            </template>
        </b-table>
    </div>
</template>
<script>
import moment from 'moment';
import backflows from '../common/Backflows.js';
import { mapState } from 'vuex';
export default {
    name: 'CreateBackflowTestReport',
    props: {
        backflow_assemblies: {required: 'true'},
        property_data: {default: false}
    },
    data () {
        return {
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
                        key: 'notes',
                        label: 'Notes',
                        sortable: false
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
                        label: 'Test 1, RV, or Air',
                        sortable: false
                    },
                    {
                        key: 'test_2',
                        label: 'Test 2, 3, or Check',
                        sortable: false
                    },
                    {
                        key: 'reading_notes',
                        label: 'Notes',
                        sortable: false
                    },
                    {
                        key: 'actions',
                        label: 'Actions',
                        sortable: false
                    }
                ],
                property_fields : [
                    {
                        key: 'property.name',
                        label: 'Property',
                        sortable: true
                    },
                    {
                        key: 'property.address1',
                        label: 'Address',
                        sortable: true
                    },
                ]
        };
    },
    created () {
        this.passed = backflows.passed // shared code between here and EditBackflowTestReport;
        if(this.property_data){
            this.fields = this.property_fields.concat(this.fields);
        }
    },
    methods: {
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
        ...mapState({
          contact_id: state => state.user.id
        })
    },
};
</script>

