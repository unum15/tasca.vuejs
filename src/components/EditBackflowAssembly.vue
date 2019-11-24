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
                         <el-select v-model="client_id" filterable default-first-option placeholder="Select Client" @change="getProperties();getContacts();">
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
                            <el-select v-model="backflow_assembly.backflow_water_system_id" filterable allow-create default-first-option placeholder="Select Water System" @change="save">
                            <el-option
                              v-for="system in systems"
                              :key="system.id"
                              :label="system.name"
                              :value="system.id"
                              :state="backflow_assembly.backflow_water_system_id != null"
                              >
                            </el-option>
                          </el-select>
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
                                list="sizes-list"
                                v-model="backflow_assembly.size"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                            <datalist id="sizes-list">
                                <option v-for="size in sizes">{{ size.size }}</option>
                            </datalist>
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
            models: [],
            sizes: [],
            tmp_ids: {}
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
            this.manufacturers = response.data.data;
        });
        this.$http.get('/backflow_models').then(response => {
            this.models = response.data.data;
        });
        this.$http.get('/backflow_assembly/unique/size').then(response => {
            this.sizes = response.data.data;
            console.log(this.sizes);
        });
        if(this.backflow_assembly_id !== null) {
            this.$http.get('/backflow_assembly/' + this.backflow_assembly_id + '?includes=property').then(response => {
                this.client_id = response.data.data.property.client_id;
                this.getProperties();
                this.getContacts();
                this.backflow_assembly = response.data.data;
                console.log(this.backflow_assembly.backflow_use_id);
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
        saveSelect(name, resource, options){
            this.$http.post('/' + resource,{name})
                .then((results) => {
                    //this[options].push({id:results.data.data.id, name: results.data.data.name});
                    this.tmp_ids[options] = results.data.data.id;
                    this.save();
            });
        },
        save () {
            if((!this.backflow_assembly.property_id)||(!this.backflow_assembly.contact_id)){
                return;
            }
            let tmp_bfa = {...this.backflow_assembly};
            if(isNaN(this.backflow_assembly.backflow_water_system_id)){
                if(!this.tmp_ids['systems']){
                    this.saveSelect(this.backflow_assembly.backflow_water_system_id, 'backflow_water_system','systems');
                    return;
                }
                else{
                    tmp_bfa.backflow_water_system_id = this.tmp_ids['systems'];
                }
            }
            if(tmp_bfa.id === null){
                this.$http.post('/backflow_assembly',tmp_bfa)
                    .then((results) => {
                        this.backflow_assembly.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/backflow_assembly/' + this.backflow_assembly.id, tmp_bfa);
            }
        }
    }
};
</script>

