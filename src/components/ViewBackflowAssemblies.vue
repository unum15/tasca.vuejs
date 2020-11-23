<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Backflow Assemblies
        </head>
        <main>
            <h1>View Backflow Assemblies</h1>
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
                  <b-col>
                    <b-form-group label="Active Filter" class="mb-0">
                        <b-form-select
                            @change="getBackflowAssemblies()"
                            :options="active_values"
                            v-model="active_filter">
                        </b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Month" class="mb-0">
                        <b-form-input v-model="month_match" placeholder="Month" :state="month_match_state"/>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Show Submitted" class="mb-0">
                      <b-form-checkbox v-model="submitted">
                      </b-form-checkbox>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="filtered_backflow_assemblies"
                :fields="fields"
                style="text-align:left;"
            >
                <template v-slot:cell(id)="data">
                    <a :href="'/backflow_assembly/' + data.value"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(property.name)="data">
                    <span v-b-popover.hover="data.item.property_unit ? data.item.property_unit.name : ''" :id="'property_' + data.item.id">{{ data.value }}</span>
                </template>
                <template v-slot:cell(contact.name)="data">
                    <span v-b-popover.hover="data.item.contact ? (data.item.contact.phone_numbers.length > 0 ? data.item.contact.phone_numbers[0].phone_number + ' ' : '') + (data.item.contact.emails.length > 0 ? data.item.contact.emails[0].email : '') : ''" :id="'property_' + data.item.id">{{ data.value }}</span>
                </template>
                <template v-slot:cell(backflow_test_reports)="data">
                    {{ data.value.length > 0 ? data.value[0].report_date : null }}
                </template>
                <template v-slot:cell(updated_at)="data">
                    {{ data.value.substr(0,10) }}
                </template>
                <template v-slot:cell(active)="data">
                    <b-form-checkbox v-model="data.item.active" @change="saveActive(data.item)">
                    </b-form-checkbox>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import moment from 'moment'
import LogicNode from '../common/LogicNode.js';
export default {
    name: 'ViewBackflowAssemblies',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            backflow_assemblies: [],
            filter: null,
            month_match: null,
            month_logic: null,
            submitted: true,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
                        sortable: true
                    },
                    {
                        key: 'property.client.name',
                        label: 'Client',
                        sortable: true
                    },
                    {
                        key: 'property.name',
                        label: 'Property',
                        sortable: true
                    },
                    {
                        key: 'contact.name',
                        label: 'Contact',
                        sortable: true
                    },
                    {
                        key: 'backflow_water_system.name',
                        label: 'System',
                        sortable: true
                    },
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
                        key: 'active',
                        label: 'Active',
                        sortable: true
                    },
                    {
                        key: 'month',
                        label: 'Month',
                        sortable: true
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
                        sortable: true
                    },
                    {
                        key: 'backflow_test_reports',
                        label: 'Last Test',
                        sortable: true
                    },
                    {
                        key: 'updated_at',
                        label: 'Updated At',
                        sortable: true
                    },
            ],
            active_filter: 1,
            active_values: [
                {
                    value: '1',
                    text: 'Active Only'
                },
                {
                    value: '0',
                    text: 'Inactive Only'
                },
                {
                    value: '',
                    text: 'All'
                }
            ]
        }
    },
    created() {
        this.getBackflowAssemblies();
    },
    methods: {
        getBackflowAssemblies(){
            let active = '';
            if(this.active_filter != ''){
                active = '&active=' + this.active_filter;
            }
            this.$http.get('/backflow_assemblies?includes=contact,property,backflow_water_system,backflow_size,backflow_type,backflow_manufacturer,backflow_model,backflow_test_reports,property_unit,property.client,contact.emails,contact.phoneNumbers' + active).then(response => {
                this.backflow_assemblies = response.data.data;
            });
        },
        saveActive(item){
            let ba = {
                active: !item.active
            }
            this.$http.patch('/backflow_assembly/' + item.id, ba);
        }
    },
    computed: {
        filtered_backflow_assemblies (){
            let assemblies = this.backflow_assemblies;
            if(this.month_match){
                assemblies = assemblies.filter(a => (this.month_logic.matches(a.month)));
            }
            if(!this.submitted){
                assemblies = assemblies.filter(a =>{
                    if((a.backflow_test_reports.length) && (a.backflow_test_reports[0].submitted_date)){
                        if(moment().diff(moment(a.backflow_test_reports[0].submitted_date), 'months', true) < 10){
                            return false;
                        }
                    }
                    return true;
                });
            }
            return assemblies;
        },
        month_match_state () {
            return this.month_match ? this.month_logic.valid : null;
        }
    },
    watch: {
        month_match(value){
            this.month_logic = new LogicNode(value,true);
        }
    }
}
</script>

