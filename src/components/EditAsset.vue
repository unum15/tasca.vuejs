<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset.name }}
        </h1>
        <main>
            <b-tabs content-class="mt-3">
                <b-tab title="General" active>
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
                                <b-form-group label="VIN/SN" label-cols="4" label-align="right">
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
                                <b-form-group label="Manufacture" label-cols="4" label-align="right">
                                    <b-form-input
                                        v-model="asset.manufacture"
                                        @change="save"
                                        type="text"
                                    >
                                    </b-form-input>
                                
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Asset Number" label-cols="4" label-align="right">
                                    <b-form-input
                                        v-model="asset.number"
                                        @change="save"
                                        type="text"
                                    >
                                    </b-form-input>
                                
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Purchase Cost" label-cols="4" label-align="right">
                                    <b-form-input
                                        v-model="asset.purchase_cost"
                                        @change="save"
                                        type="number"
                                    >
                                    </b-form-input>
                                
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Purchase Date" label-cols="4" label-align="right">
                                    <b-form-input
                                        v-model="asset.purchase_date"
                                        @change="save"
                                        type="date"
                                    >
                                    </b-form-input>
                                
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Location" label-cols="4" label-align="right">
                                    <b-form-select
                                        v-model="asset.asset_location_id"
                                        @change="save"
                                        :options="locations"
                                        value-field="id"
                                        text-field="name"
                                    >
                                    </b-form-select>
                                
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Parent Asset" label-cols="4" label-align="right">
                                    <b-form-select
                                        v-model="asset.parent_asset_id"
                                        @change="save"
                                        :options="filtered_assets"
                                        value-field="id"
                                        text-field="name"
                                    >
                                    </b-form-select>
                                
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
                    </b-container>
                </b-tab>
                <b-tab title="Appraisals">
                    <b-container fluid="md">
                        <b-table :items="appraisals" :fields="appraisal_fields">
                            <template v-slot:cell(date)="data">
                              <b-form-input
                                type="date"
                                @change="saveAppraisal(data.item)"
                                v-model="data.item.date"
                              >
                              </b-form-input>
                            </template>
                            <template v-slot:cell(appraisal)="data">
                              <b-form-input
                                type="number"
                                @change="saveAppraisal(data.item)"
                                v-model="data.item.appraisal"
                              >
                              </b-form-input>
                            </template>
                            <template v-slot:cell(delete)="data">
                              <img src="@/assets/delete.png" @click.stop="deleteAppraisal(data.item)" fluid alt="-" style="width:20px;cursor:pointer;"/>
                            </template>
                        </b-table>
                    </b-container>
                    <img src="@/assets/add.png" @click.stop="addAppraisal" fluid alt="-" style="width:20px;cursor:pointer;" />
                </b-tab>
                <b-tab title="Improvements">
                    <b-container fluid="md">
                        <b-table :items="improvements" :fields="improvement_fields">
                            <template v-slot:cell(description)="data">
                              <b-form-input
                                type="text"
                                @change="saveImprovement(data.item)"
                                v-model="data.item.description"
                              >
                              </b-form-input>
                            </template>
                            <template v-slot:cell(details)="data">
                              <b-form-input
                                type="text"
                                @change="saveImprovement(data.item)"
                                v-model="data.item.details"
                              >
                              </b-form-input>
                            </template>
                            <template v-slot:cell(date)="data">
                              <b-form-input
                                type="date"
                                @change="saveImprovement(data.item)"
                                v-model="data.item.date"
                              >
                              </b-form-input>
                            </template>
                            <template v-slot:cell(cost)="data">
                              <b-form-input
                                type="number"
                                @change="saveImprovement(data.item)"
                                v-model="data.item.cost"
                              >
                              </b-form-input>
                            </template>
                            <template v-slot:cell(delete)="data">
                              <img src="@/assets/delete.png" @click.stop="deleteImprovement(data.item)" fluid alt="-" style="width:20px;cursor:pointer;"/>
                            </template>
                        </b-table>
                    </b-container>
                    <img src="@/assets/add.png" @click.stop="addImprovement" fluid alt="-" style="width:20px;cursor:pointer;" />
                </b-tab>
                <b-tab title="Pictures">
                </b-tab>
            </b-tabs>
            <b-button @click="$router.push('/assets')">Done</b-button>
        </main>
    </div>
</template>
<script>
import moment from 'moment'
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
            assets: [],
            locations: [],
            appraisals: [],
            appraisal_fields: ['date','appraisal','delete'],
            improvements: [],
            improvement_fields: ['description','details','date','cost','delete']
        };
    },
    created () {
        this.$http.get('/asset_types').then(response => {
            this.asset_types = response.data.data;
        });
        this.$http.get('/asset_usage_types').then(response => {
            this.asset_usage_types = response.data.data;
        });
        this.$http.get('/asset_locations').then(response => {
            this.locations = response.data.data;
        });
        this.$http.get('/assets').then(response => {
            this.assets = response.data.data;
        });
        if(this.asset_id !== null) {
            this.$http.get('/asset/' + this.asset_id).then(response => {
                this.asset = response.data.data;
            });
            this.$http.get('/asset_appraisals?asset_id=' + this.asset_id).then(response => {
                this.appraisals = response.data.data;
            });
            this.$http.get('/asset_improvements?asset_id=' + this.asset_id).then(response => {
                this.improvements = response.data.data;
            });
        }
    },
    methods: {
        save() {
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
        },
        saveAppraisal(appraisal) {
            if((!appraisal.date)||(!appraisal.appraisal)){
                return;
            }
            if(appraisal.id === null){
                this.$http.post('/asset_appraisal',appraisal)
                    .then((results) => {
                        appraisal.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_appraisal/' + appraisal.id, appraisal);
            }
        },
        addAppraisal() {
            this.appraisals.push({
                id: null,
                asset_id: this.asset_id,
                date: moment().format('YYYY-MM-DD'),
                appraisal: null
            });
        },
        deleteAppraisal(appraisal) {
            this.$http.delete('/asset_appraisal/' + appraisal.id);
            this.appraisals = this.appraisals.filter(v => v.id !== appraisal.id);
        },
        saveImprovement(improvement) {
            if(!improvement.description){
                return;
            }
            if(improvement.id === null){
                this.$http.post('/asset_improvement',improvement)
                    .then((results) => {
                        improvement.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_improvement/' + improvement.id, improvement);
            }
        },
        addImprovement() {
            this.improvements.push({
                id: null,
                asset_id: this.asset_id,
                date: null,
                description: null,
                details: null
            });
        },
        deleteImprovement(improvement) {
            this.$http.delete('/asset_improvement/' + improvement.id);
            this.improvements = this.improvements.filter(v => v.id !== improvement.id);
        }
    },
    computed: {
        filtered_assets(){
            if(!this.asset.asset_type_id){
                return this.assets;
            }
            return this.assets.filter(a => (a.asset_type_id === this.asset.asset_type_id));
        }
    }
};
</script>

