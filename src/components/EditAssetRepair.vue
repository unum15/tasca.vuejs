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
                                v-model="asset_repair.asset_id"
                                @change="assetSelected();save();"
                                :options="filtered_assets"
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
                            <b-form-radio-group
                                v-model="asset_repair.asset_usage_type_id"
                                @change="save"
                                :options="asset_usage_types"
                                value-field="id"
                                text-field="name"
                                :state="asset_repair.asset_usage_type_id != null"
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
                            <el-select
                                v-model="asset_repair.where"
                                filterable
                                allow-create
                                placeholder="Select Where"
                                @change="save"
                                clearable
                                style="width:100%"
                            >
                                <el-option
                                  v-for="where in wheres"
                                  :key="where.where"
                                  :label="where.where"
                                  :value="where.where"
                                  >
                                </el-option>
                            </el-select>

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
            asset_repair: { id: null, asset_usage_type_id: null },
            assets: [],
            asset_usage_types: [],
            asset_types: [],
            filter: {asset_type_id: null},
            wheres: []
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
        this.$http.get('/asset_repairs/unique/where').then(response => {
            this.wheres = response.data.data;
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
        },
        assetSelected(){
            let assets = this.assets.filter(a => (a.id = this.asset_repair.asset_id));
            if(!assets.length){
                return;
            }
            let asset = assets[0];
            this.asset_repair.asset_usage_type_id = asset.asset_usage_type_id;
            this.filter.asset_type_id = asset.asset_type_id;
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

