<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset_service.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset Type Filter" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="filter.asset_type_id"
                                :options="asset_types"
                                value-field="id"
                                text-field="name"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_service.asset_id"
                                @change="assetSelected();save();"
                                :options="filtered_assets"
                                value-field="id"
                                text-field="name"
                                :state="asset_service.asset_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset Service Type" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_service.asset_service_type_id"
                                @change="save"
                                :options="asset_service_types"
                                value-field="id"
                                text-field="name"
                                :state="asset_service.asset_service_type_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Description" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_service.description"
                                @change="save"
                                type="text"
                                :state="asset_service.description != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Quantity" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_service.quantity"
                                @change="save"
                                type="number"
                                :state="asset_service.quantity != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Unit" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_service.asset_unit_id"
                                @change="save"
                                :options="asset_units"
                                value-field="id"
                                text-field="name"
                                :state="asset_service.asset_unit_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset Usage Type" label-cols="4" label-align="right">
                            <b-form-radio-group
                                v-model="asset_service.asset_usage_type_id"
                                @change="save"
                                :options="asset_usage_types"
                                value-field="id"
                                text-field="name"
                                :state="asset_service.asset_usage_type_id != null"
                                required
                            >
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Usage Interval" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_service.usage_interval"
                                @change="save"
                                type="number"
                                :state="asset_service.usage_interval != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Part Number" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_service.part_number"
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
                                v-model="asset_service.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Time Interval" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_service.time_interval"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>
               <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/asset_services')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditAssetService',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        asset_service_id: {default: null}
    },
    data () {
        return {
            asset_service: { id: null, asset_usage_type_id: null },
            assets: [],
            asset_service_types: [],
            asset_usage_types: [],
            asset_units: [],
            asset_types: [],
            filter: {asset_type_id: null}
        };
    },
    created () {
        this.$http.get('/asset_types').then(response => {
            this.asset_types = response.data.data;
        });
        this.$http.get('/assets').then(response => {
            this.assets = response.data.data;
        });
        this.$http.get('/asset_service_types').then(response => {
            this.asset_service_types = response.data.data;
        });
        this.$http.get('/asset_usage_types').then(response => {
            this.asset_usage_types = response.data.data;
        });
        this.$http.get('/asset_units').then(response => {
            this.asset_units = response.data.data;
        });
        if(this.asset_service_id !== null) {
            this.$http.get('/asset_service/' + this.asset_service_id).then(response => {
                this.asset_service = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.asset_service.asset_id)||(!this.asset_service.asset_service_type_id)||(!this.asset_service.description)||(!this.asset_service.quantity)||(!this.asset_service.asset_usage_type_id)||(!this.asset_service.usage_interval)){
                return;
            }
            if(this.asset_service.id === null){
                this.$http.post('/asset_service',this.asset_service)
                    .then((results) => {
                        this.asset_service.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_service/' + this.asset_service.id, this.asset_service);
            }
        },
        assetSelected(){
            let assets = this.assets.filter(a => (a.id = this.asset_service.asset_id));
            if(!assets.length){
                return;
            }
            let asset = assets[0];
            this.asset_service.asset_usage_type_id = asset.asset_usage_type_id;
        }
    },
    computed: {
        filtered_assets(){
            if(!this.filter.asset_type_id){
                return this.assets;
            }
            return this.assets.filter(a => (a.asset_type_id === this.filter.asset_type_id));
        }
    }
};
</script>

