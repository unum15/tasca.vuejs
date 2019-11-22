<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ backflow_assembly.name }}
        </h1>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Client">
                         <el-select v-model="client_id" filterable placeholder="Select Client" @change="getProperties();getContacts();">
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
                                v-model="backflow_assembly.property_id"
                                @change="save"
                                :options="properties"
                                value-field="id"
                                text-field="name"
                                :state="backflow_assembly.property_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Contact">
                            <b-form-select
                                v-model="backflow_assembly.contact_id"
                                @change="save"
                                :options="contacts"
                                value-field="id"
                                text-field="name"
                                :state="backflow_assembly.contact_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Water System">
                            <b-form-select
                                v-model="backflow_assembly.backflow_water_system_id"
                                @change="save"
                                :options="systems"
                                value-field="id"
                                text-field="name"
                                :state="backflow_assembly.backflow_water_system_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Use">
                            <b-form-select
                                v-model="backflow_assembly.backflow_use_id"
                                @change="save"
                                :options="uses"
                                value-field="id"
                                text-field="name"
                                :state="backflow_assembly.backflow_use_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Placement">
                            <b-form-input
                                v-model="backflow_assembly.placement"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Backflow Type">
                            <b-form-select
                                v-model="backflow_assembly.backflow_type_id"
                                @change="save"
                                :options="backflow_types"
                                value-field="id"
                                text-field="name"
                                :state="backflow_assembly.backflow_type_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Manufacturer">
                            <b-form-select
                                v-model="backflow_assembly.backflow_manufacturer_id"
                                @change="save"
                                :options="manufacturers"
                                value-field="id"
                                text-field="name"
                                :state="backflow_assembly.backflow_manufacturer_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Size">
                            <b-form-input
                                v-model="backflow_assembly.size"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Model Number">
                            <b-form-select
                                v-model="backflow_assembly.backflow_model_id"
                                @change="save"
                                :options="models"
                                value-field="id"
                                text-field="name"
                                :state="backflow_assembly.backflow_model_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Serial Number">
                            <b-form-input
                                v-model="backflow_assembly.serial_number"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form-group label="Notes">
                            <b-form-input
                                v-model="backflow_assembly.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
               <b-row>
                    <b-col>
                        <b-button @click="$router.push('/backflow_assemblies')">Done</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditBackflowAssembly',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        backflow_assembly_id: {default: null}
    },
    data () {
        return {
            client_id: null,
            clients: [],
            backflow_assembly: { id: null },
            backflow_types: [],
            properties: [],
            contacts: [],
            systems: [],
            uses: [],
            manufacturers: [],
            models: []
        };
    },
    created () {
        this.$http.get('/clients').then(response => {
            this.clients = response.data;
        });
        this.$http.get('/backflow_types').then(response => {
            this.backflow_types = response.data.data;
        });
        this.$http.get('/backflow_water_systems').then(response => {
            this.systems = response.data.data;
        });
        this.$http.get('/backflow_uses').then(response => {
            this.uses = response.data.data;
        });
        this.$http.get('/backflow_manufacturers').then(response => {
            this.manufactures = response.data.data;
        });
        this.$http.get('/backflow_models').then(response => {
            this.models = response.data.data;
        });
        if(this.backflow_assembly_id !== null) {
            this.$http.get('/backflow_assembly/' + this.backflow_assembly_id).then(response => {
                this.backflow_assembly = response.data.data;
            });
        }
    },
    methods: {
        getProperties() {
          if(this.client_id){
            this.$http.get('/properties?client_id=' + this.client_id).then(response => {
              this.properties = response.data
              if(this.properties.length == 1){
                 this.backflow_assembly.property_id= this.properties[0].id;
              }
            })
          }
          else{
            this.properties = []
          }
        },
        getContacts() {
          if(this.client_id){
            this.$http.get('/contacts?client_id=' + this.client_id).then(response => {
              console.log(response.data);
              this.contacts = response.data
              if(this.contacts.length == 1){
                 this.backflow_assembly.contact_id = this.contacts[0].id;
              }
            })
          }
          else{
            this.contacts = []
          }
        },
        save () {
            if((!this.backflow_assembly.property_id)||(!this.backflow_assembly.contact_id)){
                return;
            }
            if(this.backflow_assembly.id === null){
                this.$http.post('/backflow_assembly',this.backflow_assembly)
                    .then((results) => {
                        this.backflow_assembly.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/backflow_assembly/' + this.backflow_assembly.id, this.backflow_assembly);
            }
        }
    }
};
</script>

