<template>
    <div>
        <h1>
            {{ backflow_water_system.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Name" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.name"
                                @change="save"
                                type="text"
                                :state="backflow_water_system.name != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Address" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.address"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="City" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.city"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="State" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.state"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Zip" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.zip"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Phone" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.phone"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Contact" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.contact"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Email" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.email"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Notes" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Sort Order" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.sort_order"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Abbreviation" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="backflow_water_system.abbreviation"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
export default {
    name: 'EditBackflowWaterSystemForm',
    props: {
        backflow_water_system_id: {default: null}
    },
    data () {
        return {
            backflow_water_system: { id: null },
        };
    },
    created () {
        this.getBackflowWaterSystem();
    },
    methods: {
        getBackflowWaterSystem() {
            if(this.backflow_water_system_id !== null) {
                this.$http.get('/backflow_water_system/' + this.backflow_water_system_id).then(response => {
                    this.backflow_water_system = response.data.data;
                });
            }
        },
        save () {
            if((!this.backflow_water_system.name)){
                return;
            }
            if(this.backflow_water_system.id === null){
                this.$http.post('/backflow_water_system',this.backflow_water_system)
                    .then((results) => {
                        this.backflow_water_system.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/backflow_water_system/' + this.backflow_water_system.id, this.backflow_water_system);
            }
        }
    },
    watch: {
        backflow_water_system_id(){
            this.getBackflowWaterSystem();
        }
    }
};
</script>

