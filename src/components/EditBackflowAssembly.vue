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
                         <el-select
                            v-model="client_id"
                            filterable
                            default-first-option
                            placeholder="Select Client"
                            @change="getProperties();getContacts();">
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
                                @change="getUnits();getAccounts();save();"
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
                        <b-form-group label="Unit">
                            <el-select
                                v-model="backflow_assembly.property_unit_id"
                                filterable
                                clearable
                                default-first-option
                                placeholder="Select Unit"
                                @change="save();"
                            >
                            <el-option
                              v-for="unit in units"
                              :key="unit.id"
                              :label="unit.name"
                              :value="unit.id">
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
                                clearable
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
                            <el-select
                                v-model="backflow_assembly.month"
                                filterable
                                default-first-option
                                placeholder="Select Month"
                                @change="save"
                                clearable
                            >
                                <el-option
                                  v-for="index in 12"
                                  :key="index"
                                  :label="index"
                                  :value="index"
                                  >
                                </el-option>
                            </el-select>
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
                                clearable
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
                        <img src="@/assets/add.png" v-b-tooltip.hover title="Add Water System" @click.stop="showWaterSystemModal()" alt="x" style="width:20px;float:left;" />
                    </b-col>
                    <b-col>
                        <b-form-group label="Account">
                            <el-select
                                v-model="backflow_assembly.property_account_id"
                                filterable
                                placeholder="Select Account"
                                @change="save"
                                clearable
                            >
                            <el-option
                              v-for="account in accounts"
                              :key="account.id"
                              :label="account.number"
                              :value="account.id"
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
                                clearable
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
                                clearable
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
                                clearable
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
                                clearable
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
                    <b-col md="auto">
                        <b-form-group label="Model Number">
                            <el-select
                                v-model="backflow_assembly.backflow_model_id"
                                filterable
                                default-first-option
                                placeholder="Select Model"
                                @change="setTypeAndManufacturer();save();"
                                clearable
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
                    <img src="@/assets/add.png" v-b-tooltip.hover title="Add Model" @click.stop="addModel()" alt="x" style="width:20px;float:left;" />
                    </b-col>
                    <b-col>
                         <b-form-checkbox
                            v-model="backflow_assembly.active"
                            @input="save"
                          >
                            Active
                          </b-form-checkbox>
                          <br />
                          <b-form-checkbox
                            v-model="backflow_assembly.need_access"
                            @input="save"
                          >
                            Need Access
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
                                clearable
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
                        <img src="@/assets/add.png" v-b-tooltip.hover title="Add Size" @click.stop="$bvModal.show('add-size-modal')" alt="x" style="width:20px;float:left;" />
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
                        <b-button v-b-modal.view-pictures style="margin:5px;" :disabled='backflow_assembly==null'>View Pictures ({{ this.pictures.length }})</b-button>
                        <b-button v-b-modal.upload-pictures style="margin:5px;" :disabled='backflow_assembly==null'>Add Pictures</b-button>
                    </b-col>
                </b-row>
               <b-row>
                    <b-col>
                        <b-button @click="$router.push('/backflow_assemblies')" style="margin:5px;">View Assemblies</b-button>
                        <b-button @click="newAssembly" style="margin:5px;">New</b-button>
                        <b-button @click="addAssembly" style="margin:5px;">Add Additional</b-button>
                        <b-button v-b-modal.clearable>Clearable</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
        <b-modal id="view-pictures" title="View Pictures">
            <div v-for="picture in pictures" :key="picture.filename">
                <img :src="'/api/uploads/backflows/pictures/' + picture.filename" style="width:600px;" :alt="picture.original_filename" />
                {{ picture.original_filename }}
            </div>
        </b-modal>
        <b-modal id="upload-pictures" title="Upload Pictures" @ok="uploadPictures">
            <b-form-group label="Upload Picture">
                <b-form-file
                    v-model="new_pictures"
                    :state="Boolean(new_pictures)"
                    placeholder="Choose files or drop them here..."
                    drop-placeholder="Drop files here..."
                    multiple
                ></b-form-file>
            </b-form-group>
        </b-modal>
        <b-modal id="clearable" title="Clearable Fields" ok-only>
            Check the fields to clear. Uncheck to keep.
            <br />
            <br />
          <b-container>
            <b-row v-for="(field,key) in fields" :key="key">
                <b-col>
                    <b-form-checkbox
                        v-model="field.clear"
                        @input="saveClearable(key)"
                      >
                        {{ field.name }}
                      </b-form-checkbox>
                </b-col>
            </b-row>
          </b-container>
        </b-modal>
        <b-modal ref="add-size-modal" title="Add Size" @ok="addSize">
            <b-form-group label="Size">
                <el-select
                    v-model="new_size"
                    filterable
                    default-first-option
                    placeholder="Select Size"
                    @change="save"
                >
                <el-option
                  v-for="size in unfiltered_sizes"
                  :key="size.id"
                  :label="size.name"
                  :value="size.id"
                  >
                </el-option>
              </el-select>
            </b-form-group>
        </b-modal>

        <b-modal ref="add-water-system-modal" title="Add Water System" @ok="addWaterSystem" ok-only>
            <EditBackflowWaterSystemForm :backflow_water_system_id="edit_backflow_water_system_id"></EditBackflowWaterSystemForm>
        </b-modal>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
import EditBackflowWaterSystemForm from './EditBackflowWaterSystemForm';
export default {
    name: 'EditBackflowAssembly',
    components: {
        TopMenu,
        EditBackflowWaterSystemForm
    },
    props: {
        backflow_assembly_id: {default: null}
    },
    data () {
        return {
            client_id: null,
            clients: [],
            backflow_assembly: { id: null, backflow_size_id: null, active: true, property_unit_id: null, contact_id: null },
            backflow_types: [],
            properties: [],
            units: [],
            contacts: [],
            systems: [],
            uses: [],
            manufacturers: [],
            models: [],
            sizes: [],
            placements: [],
            new_pictures: [],
            pictures: [],
            accounts: [],
            new_size: null,
            edit_backflow_water_system_id: null,
            fields: {
                'property_id': {
                    name: 'Property',
                    clear: false
                },
                'property_unit_id': {
                    name: 'Unit',
                    clear: false
                },
                'contact_id': {
                    name: 'Contact',
                    clear: false
                },
                'month': {
                    name: 'Month',
                    clear: true
                },
                'backflow_water_system_id': {
                    name: 'Water System',
                    clear: true
                },
                'property_account_id': {
                    name: 'Account',
                    clear: true
                },
                'use': {
                    name: 'Use',
                    clear: true
                },
                'placement': {
                    name: 'Placement',
                    clear: true
                },
                'gps': {
                    name: 'GPS',
                    clear: true
                },
                'backflow_type_id': {
                    name: 'Type',
                    clear: true
                },
                'backflow_manufacturer_id': {
                    name: 'Manufacture',
                    clear: true
                },
                'backflow_model_id': {
                    name: 'Model',
                    clear: true
                },
                'active': {
                    name: 'Active',
                    clear: true,
                    default: true
                },
                'need_access': {
                    name: 'Need Access',
                    clear: true,
                    default: false
                },
                'backflow_size_id': {
                    name: 'Size',
                    clear: true
                },
                'serial_number': {
                    name: 'Serial',
                    clear: true
                },
                'notes': {
                    name: 'Notes',
                    clear: true
                }
            }
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
        this.$http.get('/backflow_manufacturers').then(response => {
            this.manufacturers = response.data.data;
        });
        this.$http.get('/backflow_sizes').then(response => {
            this.sizes = response.data.data;
        });
        this.getModels();
        this.$http.get('/backflow_assembly/unique/use').then(response => {
            this.uses = response.data.data;
        });
        this.$http.get('/backflow_assembly/unique/placement').then(response => {
            this.placements = response.data.data;
        });
        this.loadClearable();
        if(this.backflow_assembly_id !== null) {
            this.$http.get('/backflow_assembly/' + this.backflow_assembly_id + '?includes=property').then(response => {
                this.client_id = response.data.data.property.client_id;
                this.backflow_assembly = response.data.data;
                this.getPictures();
                this.getProperties(false);
                this.getContacts(false);
                this.getUnits(false);
                this.getAccounts(false);
            });
        }
    },
    methods: {
        uploadPictures(){
            this.new_pictures.map(p => {
                let backflow_picture = new FormData();
                backflow_picture.append('picture', p);
                backflow_picture.append('backflow_assembly_id', this.backflow_assembly.id);
                this.$http.post('/backflow_picture',backflow_picture,{headers: {'Content-Type': 'multipart/form-data'}}).then(() => {
                    this.getPictures();
                });
            });
        },
        getPictures(){
            this.$http.get('/backflow_pictures?backflow_assembly_id=' + this.backflow_assembly.id).then(response => {
                this.pictures = response.data.data;
            });
        },
        getModels(){
            this.$http.get('/backflow_models?includes=backflow_sizes').then(response => {
                this.models = response.data.data;
            });
        },
        getProperties(clear=true) {
          if(clear){
            this.backflow_assembly.property_id = null;
            this.backflow_assembly.property_unit_id = null;
          }
          if(this.client_id){
            this.$http.get('/properties?client_id=' + this.client_id).then(response => {
              this.properties = response.data;
              if(this.properties.length == 1){
                 this.backflow_assembly.property_id = this.properties[0].id;
                 this.getUnits(clear);
              }
            })
          }
          else{
            this.properties = []
          }
        },
        getUnits(clear=true) {
          if(clear){
            console.log('clear');
            this.backflow_assembly.property_unit_id = null;
          }
          if(this.backflow_assembly.property_id){
            this.$http.get('/property_units?property_id=' + this.backflow_assembly.property_id).then(response => {
              this.units = response.data.data
            })
          }
          else{
            this.units = []
          }
        },
        getAccounts(clear=true) {
          if(clear){
            this.backflow_assembly.account_id = null;
          }
          if(this.backflow_assembly.property_id){
            this.$http.get('/property_accounts?property_id=' + this.backflow_assembly.property_id).then(response => {
              this.accounts = response.data.data
              if(this.accounts.length == 1){
                this.backflow_assembly.account_id = this.accounts[0].id;
              }
            })
          }
          else{
            this.units = []
          }
        },
        getContacts(clear=true) {
          if(clear){
            this.backflow_assembly.contact_id = null;
          }
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
            if(!this.backflow_assembly.property_id){
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
        },
        newAssembly(){
            this.backflow_assembly = {id: null, property_id: null, use: null, placement: null, gps: null, backflow_type_id: null, backflow_manufacturer_id: null, backflow_model_id: null, backflow_size_id: null, serial_number:null, notes: null, active: true, need_access: false };
            this.client_id = null;
            this.properties = [];
            this.units = [];
            this.accounts = [];
            this.contacts = [];
        },
        addAssembly(){
            this.backflow_assembly.id = null;
            Object.keys(this.fields).map(k => {
                if(this.fields[k].clear){
                    if(typeof this.fields[k].default !== 'undefined'){
                        this.backflow_assembly[k] = this.fields[k].default;
                    }
                    else{
                        this.backflow_assembly[k] = null;
                    }
                }
            });
            if(this.fields.property_id.clear){
                this.client_id = null;
                this.properties = [];
                this.units = [];
                this.accounts = [];
                this.contacts = [];
            }
        },
        addModel(){
            let name=prompt("Model Number?");
            if(name){
                let model = {
                    backflow_manufacturer_id: this.backflow_assembly.backflow_manufacturer_id,
                    backflow_type_id: this.backflow_assembly.backflow_type_id,
                    name : name
                };
                this.$http.post('/backflow_model',model).then(response => {
                    this.getModels();
                    this.backflow_assembly.backflow_model_id = response.data.data.id
                });
            }
        },
        showSizeModal(){
         this.$refs['add-size-modal'].show();
        },
        addSize(){
            let model = {
                sizes: [this.new_size]
            };
            this.$http.patch('/backflow_model/'+this.backflow_assembly.backflow_model_id,model).then(() => {
                this.getModels();
                this.backflow_assembly.backflow_size_id = this.new_size;
            });
        },
        showWaterSystemModal(){
         this.$refs['add-water-system-modal'].show();
        },
        addWaterSystem(){
            this.$http.get('/backflow_water_systems').then(response => {
                let systems = response.data.data;
                var new_systems = systems.filter(ns => !this.systems.find(s => ns.id == s.id));
                this.systems = systems;
                if(new_systems.length){
                    this.backflow_assembly.backflow_water_system_id = new_systems[0];
                }
            });
        },
        saveClearable(field){
            localStorage.setItem('edit_backflow_assemblies-'+field+'-clear', this.fields[field].clear)
        },
        loadClearable(){
            Object.keys(this.fields).map(k => {
                let clear = localStorage.getItem('edit_backflow_assemblies-'+k+'-clear');
                if(clear !== null){
                    this.fields[k].clear = clear;
                }
            });
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
        },
        unfiltered_sizes(){
            if(!this.backflow_assembly.backflow_model_id){
              return this.sizes;
            }
            let model = this.models.filter(m => (this.backflow_assembly.backflow_model_id == m.id))[0];
            if(model){
                let sizes = this.sizes.filter(s => {
                    let matches = model.backflow_sizes.filter(ms => (s.id == ms.id));
                    if(matches.length){
                        return false;
                    }
                    return true;
                });
                return sizes;
            }
            return [];
        }
    },
    watch: {
        filtered_sizes(){
            if(this.filtered_sizes.length == 1){
                this.backflow_assembly.backflow_size_id = this.filtered_sizes[0].id;
            }
        },
    }
};
</script>

