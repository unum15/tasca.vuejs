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
                            <el-select
                                v-model="backflow_assembly.property_id"
                                filterable
                                default-first-option
                                placeholder="Select Property"
                                @change="save"
                            >
                            <el-option
                              v-for="property in properties"
                              :key="property.id"
                              :label="property.name"
                              :value="property.id">
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Contact">
                            <el-select
                                v-model="backflow_assembly.contact_id"
                                filterable
                                default-first-option
                                placeholder="Select Contact"
                                @change="save"
                            >
                            <el-option
                              v-for="contact in contacts"
                              :key="contact.id"
                              :label="contact.name"
                              :value="contact.id"
                            >
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Month">
                            <b-form-input
                                v-model="backflow_assembly.month"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Water System">
                            <el-select
                                v-model="backflow_assembly.backflow_water_system_id"
                                filterable
                                default-first-option
                                placeholder="Select Water System"
                                @change="save"
                            >
                            <el-option
                              v-for="system in systems"
                              :key="system.id"
                              :label="system.name"
                              :value="system.id"
                              >
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Use">
                            <el-select
                                v-model="backflow_assembly.use"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="Select Use"
                                @change="save"
                            >
                                <el-option
                                  v-for="use in uses"
                                  :key="use.use"
                                  :label="use.use"
                                  :value="use.use"
                                  >
                                </el-option>
                            </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Placement">
                            <el-select
                                v-model="backflow_assembly.placement"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="Select Placement"
                                @change="save"
                            >
                                <el-option
                                  v-for="placement in placements"
                                  :key="placement.placement"
                                  :label="placement.placement"
                                  :value="placement.placement"
                                  >
                                </el-option>
                            </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="GPS">
                            <b-form-input
                                v-model="backflow_assembly.gps"
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
                            <el-select
                                v-model="backflow_assembly.backflow_type_id"
                                filterable
                                default-first-option
                                placeholder="Select Backflow Type"
                                @change="save"
                            >
                            <el-option
                              v-for="type in backflow_types"
                              :key="type.id"
                              :label="type.name"
                              :value="type.id"
                              >
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Manufacturer">
                            <el-select
                                v-model="backflow_assembly.backflow_manufacturer_id"
                                filterable
                                default-first-option
                                placeholder="Select Manufacturer"
                                @change="save"
                            >
                            <el-option
                              v-for="manufacturer in manufacturers"
                              :key="manufacturer.id"
                              :label="manufacturer.name"
                              :value="manufacturer.id"
                              >
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Model Number">
                            <el-select
                                v-model="backflow_assembly.backflow_model_id"
                                filterable
                                default-first-option
                                placeholder="Select Model"
                                @change="setTypeAndManufacturer();save();"
                            >
                            <el-option
                              v-for="model in filtered_models"
                              :key="model.id"
                              :label="model.name"
                              :value="model.id"
                              >
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                         <b-form-checkbox
                            v-model="backflow_assembly.active"
                          >
                            Active
                          </b-form-checkbox>

                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Size">
                            <el-select
                                v-model="backflow_assembly.backflow_size_id"
                                filterable
                                default-first-option
                                placeholder="Select Size"
                                @change="save"
                            >
                            <el-option
                              v-for="size in filtered_sizes"
                              :key="size.id"
                              :label="size.name"
                              :value="size.id"
                              >
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
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
                            <b-form-textarea
                                v-model="backflow_assembly.notes"
                                @change="save"
                                placeholder="Notes..."
                                rows="6"
                              ></b-form-textarea>
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
            backflow_assembly: { id: null, backflow_size_id: null },
            backflow_types: [],
            properties: [],
            contacts: [],
            systems: [],
            uses: [],
            manufacturers: [],
            models: [],
            sizes: [],
            placements: []
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
        this.$http.get('/backflow_sizes').then(response => {
            this.sizes = response.data.data;
        });
        this.$http.get('/backflow_manufacturers').then(response => {
            this.manufacturers = response.data.data;
        });
        this.$http.get('/backflow_models?includes=backflow_sizes').then(response => {
            this.models = response.data.data;
        });
        this.$http.get('/backflow_assembly/unique/use').then(response => {
            this.uses = response.data.data;
        });
        this.$http.get('/backflow_assembly/unique/placement').then(response => {
            this.placements = response.data.data;
        });
        if(this.backflow_assembly_id !== null) {
            this.$http.get('/backflow_assembly/' + this.backflow_assembly_id + '?includes=property').then(response => {
                this.client_id = response.data.data.property.client_id;
                this.getProperties();
                this.getContacts();
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
        },
        setTypeAndManufacturer(){
            if(!this.backflow_assembly.backflow_model_id){
                return;
            }
            let models = this.models.filter(m => (m.id == this.backflow_assembly.backflow_model_id));
            let model = models[0];
            this.backflow_assembly.backflow_type_id = model.backflow_type_id;
            this.backflow_assembly.backflow_manufacturer_id = model.backflow_manufacturer_id
        }
    },
    computed: {
        filtered_models(){
          return this.models.filter(m => {
            if((this.backflow_assembly.backflow_type_id !=  null) && (this.backflow_assembly.backflow_type_id != m.backflow_type_id)){
              return false;
            }
            if((this.backflow_assembly.backflow_manufacturer_id !=  null) && (this.backflow_assembly.backflow_manufacturer_id != m.backflow_manufacturer_id)){
              return false;
            }
            return true;
          });
        },
        filtered_sizes(){
            if(!this.backflow_assembly.backflow_model_id){
              return this.sizes;
            }
            let model = this.models.filter(m => (this.backflow_assembly.backflow_model_id == m.id))[0];
            if(model){
                let sizes = this.sizes.filter(s => {
                    let matches = model.backflow_sizes.filter(ms => (s.id == ms.id));
                    if(matches.length){
                        return true;
                    }
                    return false;
                });
                return sizes;
            }
            return [];
        }
    },
    watch: {
        filtered_sizes(){
            if(this.filtered_sizes.length == 1){
                this.backflow_assembly.backflow_size_id = this.filtered_size[0].id;
            }
        }
    }
};
</script>

