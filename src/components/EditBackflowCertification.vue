<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ backflow_certification.name }}
        </h1>
        <main>
            <b-container style="text-align:left">
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
                                :state="property_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Backflow Assembly">
                            <b-form-select
                                v-model="backflow_certification.backflow_assembly_id"
                                @change="getBackflowValves();save();"
                                :options="backflow_assemblies"
                                value-field="id"
                                text-field="use"
                                :state="backflow_certification.backflow_assembly_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <div v-if="backflow_certification.backflow_assembly_id">
                <b-row>
                    <b-col>
                        <b-form-group label="Proper installation and use">
                            <b-form-radio v-model="backflow_certification.backflow_installed_to_code" name="backflow_installed_to_code" value="true">To Code</b-form-radio>
                            <b-form-radio v-model="backflow_certification.backflow_installed_to_code" name="backflow_installed_to_code" value="false">Not To code</b-form-radio>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Visual Inspection Notes">
                            <b-form-textarea
                                v-model="backflow_certification.visual_inspection_notes"
                                @change="save"
                                type="text"
                                :state="backflow_certification.visual_inspection_notes != null"
                                required
                            >
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col></b-col>
                    <b-col v-for="valve in valves" :key="valve.id">
                        {{ valve.name }}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>Initial</b-col>
                    <b-col v-for="valve in valves" :key="valve.id">
                        <b-form-group :label="valve.test_name">
                            <b-form-input
                                v-model="valve.value"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                            <b-form-radio name="valve.test_name" value="true">{{valve.success_label}}</b-form-radio>
                            <b-form-radio name="valve.test_name" value="false">{{valve.fail_label}}</b-form-radio>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>Repairs</b-col>
                    <b-col v-for="valve in valves" :key="valve.id">
                        <b-form-checkbox>Cleaned</b-form-checkbox>
                        <b-form-group label="Replaced">
                            <b-form-checkbox v-for="parts in valve.backflow_valve_parts">{{parts.name}}</b-form-checkbox>
                            <b-form-checkbox>Other</b-form-checkbox>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>Final</b-col>
                    <b-col v-for="valve in valves" :key="valve.id">
                        <b-form-group :label="valve.test_name">
                            <b-form-radio name="valve.test_name" value="true">{{valve.success_label}}</b-form-radio>
                            <b-form-radio name="valve.test_name" value="false">{{valve.fail_label}}</b-form-radio>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Initial Test By">
                            <b-form-select
                                v-model="backflow_certification.initial_test_contact_id"
                                @change="save"
                                :options="contacts"
                                value-field="id"
                                text-field="name"
                                :state="backflow_certification.initial_test_contact_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    
                    <b-col>
                        <b-form-group label="Date">
                            <b-form-input
                                v-model="backflow_certification.initial_test_date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Repairs By">
                            <b-form-select
                                v-model="backflow_certification.repairs_contact_id"
                                @change="save"
                                :options="contacts"
                                value-field="id"
                                text-field="name"
                                :state="backflow_certification.repairs_contact_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Date">
                            <b-form-input
                                v-model="backflow_certification.initial_test_date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Final Test By">
                            <b-form-select
                                v-model="backflow_certification.final_test_contact_id"
                                @change="save"
                                :options="contacts"
                                value-field="id"
                                text-field="name"
                                :state="backflow_certification.final_test_contact_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Date">
                            <b-form-input
                                v-model="backflow_certification.initial_test_date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="This assembly's INITIAL TEST performance was:">
                            <b-form-radio v-model="backflow_certification.initial" name="initial" value="true">Satisfactory</b-form-radio>
                            <b-form-radio v-model="backflow_certification.initial" name="initial" value="false">Unsatisfactory</b-form-radio>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="This assembly's FINAL TEST performance was:">
                            <b-form-radio v-model="backflow_certification.final" name="initial" value="true">Satisfactory</b-form-radio>
                            <b-form-radio v-model="backflow_certification.final" name="initial" value="false">Unsatisfactory</b-form-radio>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-button @click="$router.push('/backflow_certifications')">Done</b-button>
                    </b-col>
                </b-row>
                </div>
               
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditBackflowCertification',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        backflow_certification_id: {default: null}
    },
    data () {
        return {
            client_id: null,
            property_id: null,
            clients: [],
            contacts: [],
            properties: [],
            backflow_certification: { id: null },
            backflow_assemblies: [],
            valves: []
        };
    },
    created () {
        this.$http.get('/clients').then(response => {
            this.clients = response.data;
        });
        this.$http.get('/contacts').then(response => {
            this.contacts = response.data;
        });
        if(this.backflow_certification_id !== null) {
            this.$http.get('/backflow_certification/' + this.backflow_certification_id).then(response => {
                this.backflow_certification = response.data.data;
            });
        }
        else{
            let id = localStorage.getItem('id')
            //this.backflow_certification.final_test_contact_id = id;
            this.backflow_certification.initial_test_contact_id = id;
        }
    },
    methods: {
        getProperties() {
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
                this.$http.get('/backflow_assemblies?property_id=' + this.property_id).then(response => {
                     this.backflow_assemblies = response.data.data;
                 });
            }
            else{
                this.backflow_assemblies = [];
            }
        },
        getBackflowValves(){
            if(this.backflow_certification.backflow_assembly_id){
                let assemblies = this.backflow_assemblies.filter(a => (this.backflow_certification.backflow_assembly_id == a.id));
                this.$http.get('/backflow_type_valves?includes=backflow_valve_parts&backflow_style_id=' + assemblies[0].backflow_style_id).then(response => {
                     this.valves = response.data.data;
                 });
            }
            else{
                this.valves = [];
            }
        },
        save () {
            if((!this.backflow_certification.backflow_assembly_id)||(!this.backflow_certification.visual_inspection_notes)||(!this.backflow_certification.backflow_installation_status_id)){
                return;
            }
            if(this.backflow_certification.id === null){
                this.$http.post('/backflow_certification',this.backflow_certification)
                    .then((results) => {
                        this.backflow_certification.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/backflow_certification/' + this.backflow_certification.id, this.backflow_certification);
            }
        }
    }
};
</script>

