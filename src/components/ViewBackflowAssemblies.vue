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
                <template slot="thead-top">
                    <tr>
                        <th v-for="field in fields" :key="field.key">
                            <b-form-input type="text" @input="filtersUpdated" v-model="filters[field.key]" v-if="filters[field.key] !== undefined "></b-form-input>
                        </th>  
                    </tr>
                </template>
                <template v-slot:cell(id)="data">
                    <a :href="'/backflow_assembly/' + data.value"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(property)="data">
                    <span v-b-popover.hover="data.item.property_unit ? data.item.property_unit.name : ''" :id="'property_' + data.item.id">{{ data.item.property ? data.item.property.name : '' }}</span>
                </template>
                <template v-slot:cell(contact)="data">
                    <span v-b-popover.hover="data.item.contact ? (data.item.contact.phone_numbers.length > 0 ? data.item.contact.phone_numbers[0].phone_number + ' ' : '') + (data.item.contact.emails.length > 0 ? data.item.contact.emails[0].email : '') : ''" :id="'property_' + data.item.id">{{ data.item.contact ? data.item.contact.name : '' }}</span>
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
import LogicNode from '../common/LogicNode.js';
import filtersMixin from '../mixins/Filters.js';
export default {
    name: 'ViewBackflowAssemblies',
    components: {
        'TopMenu': TopMenu,
    },
    mixins: [filtersMixin],
    data() {
        return {
            backflow_assemblies: [],
            filtered_backflow_assemblies: [],
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
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'property',
                        label: 'Property',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'contact',
                        label: 'Contact',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'backflow_water_system.name',
                        label: 'System',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'use',
                        label: 'Use',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'placement',
                        label: 'Placement',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'backflow_type.name',
                        label: 'Type',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'backflow_manufacturer.name',
                        label: 'Manufacturer',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'backflow_size.name',
                        label: 'Size',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'backflow_model.name',
                        label: 'Model',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'serial_number',
                        label: 'Serial',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'active',
                        label: 'Active',
                        sortable: true,
                        filter: 'yes'
                    },
                    {
                        key: 'month',
                        label: 'Month',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'backflow_test_reports',
                        label: 'Last Test',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'updated_at',
                        label: 'Updated At',
                        sortable: true,
                        filter: null
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
        this.filtersInit('assets', this.fields.map(f => (f.key)));
        this.getBackflowAssemblies();
    },
    methods: {
        getBackflowAssemblies(){
            this.$http.get('/backflow_assemblies?includes=contact,property,backflow_water_system,backflow_size,backflow_type,backflow_manufacturer,backflow_model,backflow_test_reports,property_unit,property.client,contact.emails,contact.phoneNumbers').then(response => {
                this.backflow_assemblies = response.data.data;
                this.filtersUpdated();
            });
        },
        saveActive(item){
            let ba = {
                active: item.active
            }
            this.$http.patch('/backflow_assembly/' + item.id, ba);
        },
        filtersUpdated(){
            this.filtered_backflow_assemblies=this.filterColumns(this.backflow_assemblies);
        },
    },
    computed: {
        month_match_state () {
            return this.month_match ? this.month_logic.valid : null;
        },
    },
    watch: {
        month_match(value){
            this.month_logic = new LogicNode(value,true);
        },
    }
}
</script>

