<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset_fueling.name }}
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
                                v-model="asset_fueling.asset_id"
                                @change="assetSelected();save();"
                                :options="filtered_assets"
                                value-field="id"
                                text-field="name"
                                :state="asset_fueling.asset_id != null"
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
                                v-model="asset_fueling.asset_usage_type_id"
                                @change="save"
                                :options="asset_usage_types"
                                value-field="id"
                                text-field="name"
                                :state="asset_fueling.asset_usage_type_id != null"
                                required
                            >
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Hours/Miles" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_fueling.usage"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Date" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_fueling.date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Gallons" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_fueling.gallons"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Amount" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_fueling.amount"
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
                                v-model="asset_fueling.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>
               <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/asset_fuelings')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditAssetFueling',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        asset_fueling_id: {default: null}
    },
    data () {
        return {
            asset_fueling: { id: null, asset_usage_type_id: null },
            asset_usage_types: [],
            assets: [],
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
        this.$http.get('/asset_usage_types').then(response => {
            this.asset_usage_types = response.data.data;
        });
        if(this.asset_fueling_id !== null) {
            this.$http.get('/asset_fueling/' + this.asset_fueling_id).then(response => {
                this.asset_fueling = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.asset_fueling.asset_id)){
                return;
            }
            if(this.asset_fueling.id === null){
                this.$http.post('/asset_fueling',this.asset_fueling)
                    .then((results) => {
                        this.asset_fueling.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_fueling/' + this.asset_fueling.id, this.asset_fueling);
            }
        },
        assetSelected(){
            let assets = this.assets.filter(a => (a.id = this.asset_fueling.asset_id));
            if(!assets.length){
                return;
            }
            let asset = assets[0];
            this.asset_fueling.asset_usage_type_id = asset.asset_usage_type_id;
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

