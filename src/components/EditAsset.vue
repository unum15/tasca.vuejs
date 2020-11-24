<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Name" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.name"
                                @change="save"
                                type="text"
                                :state="asset.name != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset Type" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset.asset_type_id"
                                @change="save"
                                :options="asset_types"
                                value-field="id"
                                text-field="name"
                                :state="asset.asset_type_id != null"
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
                                v-model="asset.asset_usage_type_id"
                                @change="save"
                                :options="asset_usage_types"
                                value-field="id"
                                text-field="name"
                            >
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Year" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.year"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Make" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.make"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Model" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.model"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Trim" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.trim"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Vin" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.vin"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Parent Asset" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.parent_asset_id"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Notes" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/assets')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditAsset',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        asset_id: {default: null}
    },
    data () {
        return {
            asset: { id: null },
            asset_types: [],
            asset_usage_types: [],
        };
    },
    created () {
        this.$http.get('/asset_types').then(response => {
            this.asset_types = response.data.data;
        });
        this.$http.get('/asset_usage_types').then(response => {
            this.asset_usage_types = response.data.data;
        });
        if(this.asset_id !== null) {
            this.$http.get('/asset/' + this.asset_id).then(response => {
                this.asset = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.asset.name)||(!this.asset.asset_type_id)){
                return;
            }
            if(this.asset.id === null){
                this.$http.post('/asset',this.asset)
                    .then((results) => {
                        this.asset.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset/' + this.asset.id, this.asset);
            }
        }
    }
};
</script>

