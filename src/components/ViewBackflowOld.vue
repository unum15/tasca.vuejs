<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Backflow Old
        </head>
        Group
        <el-select
            v-model="group"
            filterable
            default-first-option
            placeholder="Select Group"
            @change="getZips();"
        >
        <el-option
              v-for="group in groups"
              :key="group"
              :label="group"
              :value="group">
            </el-option>
        </el-select>
        Zip
        <el-select
            v-model="zip"
            filterable
            default-first-option
            placeholder="Select Zip"
            @change="getBackflows();getClients();"
        >
            <el-option
              v-for="zip in zips"
              :key="zip"
              :label="zip"
              :value="zip">
            </el-option>
        </el-select>
        <main>
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="backflows"
                :fields="fields"
            >
                <template v-slot:cell(client_id)="data">
                    <el-select
                        v-model="data.item.client_id"
                        filterable
                        default-first-option
                        placeholder="Select Property"
                        @change="getProperties(data.item)"
                    >
                        <el-option
                          v-for="client in clients"
                          :key="client.id"
                          :label="client.name"
                          :value="client.id">
                        </el-option>
                    </el-select>
                    <b-button @click="createClient(data.item)">Add Client</b-button>
                </template>
                <template v-slot:cell(property_id)="data">
                    <el-select
                        v-model="data.item.property_id"
                        filterable
                        default-first-option
                        placeholder="Select Property"
                        @change="getUnits(data.item)"
                        :disabled="data.item.client_id == null"
                    >
                        <el-option
                          v-for="property in data.item.properties"
                          :key="property.id"
                          :label="property.name + '-' + property.address1"
                          :value="property.id">
                        </el-option>
                    </el-select>
                    <b-button @click="createProperty(data.item)" :disabled="data.item.client_id == null">Add Property</b-button>
                </template>
                <template v-slot:cell(unit_id)="data">
                    <el-select
                        v-model="data.item.unit_id"
                        filterable
                        default-first-option
                        placeholder="Select Unit"
                        :disabled="data.item.property_id == null"
                    >
                        <el-option
                          v-for="unit in data.item.units"
                          :key="unit.id"
                          :label="unit.name"
                          :value="unit.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-slot:cell(save)="data">
                    <b-button @click="save(data.item)">
                        Save
                    </b-button>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewBackflowOld',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            backflows: [],
            filter: null,
            fields: [
                    {
                        key: 'owner',
                        label: 'Owner',
                        sortable: true
                    },
                    {
                        key: 'location',
                        label: 'Location',
                        sortable: true
                    },
                    {
                        key: 'laddress',
                        label: 'Laddress',
                        sortable: true
                    },
                    {
                        key: 'client_id',
                        label: 'Clients',
                        sortable: false
                    },
                    {
                        key: 'property_id',
                        label: 'Property',
                        sortable: false
                    },
                    {
                        key: 'unit_id',
                        label: 'Unit',
                        sortable: false
                    },
                    {
                        key: 'save',
                        label: 'Save',
                        sortable: false
                    }
            ],
            properties: [],
            zips: [],
            clients: [],
            zip: null,
            units: [],
            group: null,
            groups: []
        }
    },
    created() {
        this.$http.get('/backflow_old/groups').then(response => {
            this.groups = response.data.data;
        });
    },
    methods: {
        getZips(){
            this.$http.get('/backflow_old/zips?group='+this.group).then(response => {
                this.zips = response.data.data;
            });
        },
        getProperties(item){
            this.$http.get('/properties?client_id=' + item.client_id).then((results) => {
                let index = this.backflows.map(b => (b.id)).indexOf(item.id);
                this.backflows[index].properties = results.data;
            });
        },
        getUnits(item){
            this.$http.get('/property_units?property_id=' + item.property_id).then((results) => {
                let index = this.backflows.map(b => (b.id)).indexOf(item.id);
                this.backflows[index].units = results.data.data;
            });
        },
        getClients(){
            this.$http.get('/clients?zip=' + this.zip).then(response => {
                this.clients = response.data;
            });
        },
        getBackflows(){
            this.$http.get('/backflow_old?zip=' + this.zip).then(response => {
                this.backflows = [];
                response.data.data.map(b =>{
                    let backflow = b;
                    backflow.client_id = null;
                    backflow.property_id = null;
                    backflow.unit_id = null;
                    backflow.properties = [];
                    backflow.units = [];
                    this.backflows.push(backflow);
                });
            });
        },
        save(item){
            this.$http.post('/backflow_old/export/' + item.id, {property_id: item.property_id, unit_id: item.unit_id}).then(response =>{
                if(response.data){
                    let index = this.backflows.map(b => (b.id)).indexOf(item.id);
                    this.backflows.splice(index,1);
                }
            })
        },
        createClient(item){
            this.$http.post('/backflow_old/export/client/' + item.id).then(response =>{
                if(response.data){
                    this.getClients();
                    item.client_id = response.data.data.id
                }
            })
        },
        createProperty(item){
            this.$http.post('/backflow_old/export/property/' + item.id, {client_id: item.client_id}).then(response =>{
                if(response.data){
                    this.getProperties(item);
                    item.property_id = response.data.data.id
                }
            })
        }
    }
}
</script>

