<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset_repair.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_repair.asset_id"
                                @change="save"
                                :options="assets"
                                value-field="id"
                                text-field="name"
                                :state="asset_repair.asset_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset Usage Type" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_repair.asset_usage_type_id"
                                @change="save"
                                :options="asset_usage_types"
                                value-field="id"
                                text-field="name"
                                :state="asset_repair.asset_usage_type_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Usage" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_repair.usage"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Repair" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_repair.repair"
                                @change="save"
                                type="text"
                                :state="asset_repair.repair != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Date" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_repair.date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Amount" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_repair.amount"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Where" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_repair.where"
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
                                v-model="asset_repair.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/asset_repairs')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditAssetRepair',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        asset_repair_id: {default: null}
    },
    data () {
        return {
            asset_repair: { id: null },
            assets: [],
            asset_usage_types: [],
        };
    },
    created () {
        this.$http.get('/assets').then(response => {
            this.assets = response.data.data;
        });
        this.$http.get('/asset_usage_types').then(response => {
            this.asset_usage_types = response.data.data;
        });
        if(this.asset_repair_id !== null) {
            this.$http.get('/asset_repair/' + this.asset_repair_id).then(response => {
                this.asset_repair = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.asset_repair.asset_id)||(!this.asset_repair.asset_usage_type_id)||(!this.asset_repair.repair)){
                return;
            }
            if(this.asset_repair.id === null){
                this.$http.post('/asset_repair',this.asset_repair)
                    .then((results) => {
                        this.asset_repair.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_repair/' + this.asset_repair.id, this.asset_repair);
            }
        }
    }
};
</script>

