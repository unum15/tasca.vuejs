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
                                <b-form-group label="Category" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.asset_category_id"
                                        @change="save"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="option in asset_categories"
                                            :value="option.id"
                                            :key="option.id"
                                            :label="option.number+' '+option.name"
                                            >
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <AssetAddNumber number_type='asset_category' numbers_type='asset_categories' @reload="reloadNumbers"/>
                            </b-col>
                        </b-form-row>
                        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Brand" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.asset_brand_id"
                                        @change="brandChanged"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="option in asset_brands.filter(n => (!this.asset.asset_category_id || n.asset_category_id == this.asset.asset_category_id))"
                                            :value="option.id"
                                            :key="option.id"
                                            :label="option.number+' '+option.name"
                                            >
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <AssetAddNumber
                                    parent_type='asset_categories'
                                    parent_key='asset_category_id'
                                    number_type='asset_brand'
                                    numbers_type='asset_brands'
                                    :item="{asset_category_id: asset.asset_category_id }"
                                    @reload="reloadNumbers"/>
                            </b-col>
                        </b-form-row>
        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Type" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.asset_type_id"
                                        @change="typeChanged"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="option in asset_types.filter(n => (!this.asset.asset_brand_id || n.asset_brand_id == this.asset.asset_brand_id))"
                                            :value="option.id"
                                            :key="option.id"
                                            :label="option.number+' '+option.name"
                                            >
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <AssetAddNumber
                                    parent_type='asset_brands'
                                    parent_key='asset_brand_id'
                                    number_type='asset_type'
                                    numbers_type='asset_types'
                                    :item="{asset_brand_id: asset.asset_brand_id }"
                                    @reload="reloadNumbers"/>
                            </b-col>
                        </b-form-row>
                        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Group" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.asset_group_id"
                                        @change="groupChanged"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="option in asset_groups.filter(n => (!this.asset.asset_type_id || n.asset_type_id == this.asset.asset_type_id))"
                                            :value="option.id"
                                            :key="option.id"
                                            :label="option.number+' '+option.name"
                                            >
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <AssetAddNumber
                                    parent_type='asset_types'
                                    parent_key='asset_type_id'
                                    number_type='asset_group'
                                    numbers_type='asset_groups'
                                    :item="{asset_type_id: asset.asset_type_id }"
                                    @reload="reloadNumbers"/>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Sub" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.asset_sub_id"
                                        @change="subChanged"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="option in asset_subs.filter(n => (!this.asset.asset_group_id || n.asset_group_id == this.asset.asset_group_id))"
                                            :value="option.id"
                                            :key="option.id"
                                            :label="option.number+' '+option.name"
                                            >
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <AssetAddNumber
                                    parent_type='asset_groups'
                                    parent_key='asset_group_id'
                                    number_type='asset_sub'
                                    numbers_type='asset_subs'
                                    :item="{asset_group_id: asset.asset_group_id }"
                                    @reload="reloadNumbers"/>
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Item" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.item_number"
                                        @change="save"
                                        :options="item_numbers"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="number in item_numbers"
                                            :value="number"
                                            :key="number"
                                            >
                                        </el-option>
                                    </el-select>
                                </b-form-group>
                            </b-col>
                        </b-form-row>

                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Asset Number" label-cols="4" label-align="right">
                                    {{ number_string }}                                
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
                                <b-form-group label="Purchase Cost" label-cols="4" label-align="right">
                                    <b-form-input
                                        v-model="asset.purchase_cost"
                                        @change="save"
                                        :formatter="currencyFormatter"
                                    >
                                    </b-form-input>
                                
                                </b-form-group>
                            </b-col>
                        </b-form-row>
                        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Location" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.asset_location_id"
                                        @change="save"
                                        :options="locations"
                                        value-field="id"
                                        text-field="name"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="option in locations"
                                            :value="option.id"
                                            :key="option.id"
                                            :label="option.name"
                                            >
                                        </el-option>
                                    </el-select>
                                
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <img src="@/assets/add.png" v-b-tooltip.hover title="Add Location" @click.stop="showAddLocation" alt="x" style="width:20px;float:left;" />
                                <b-modal ref="add-location-modal" title="Add Location" @ok="addLocation">
                                    <b-container>
                                        <b-row>
                                            <b-col>
                                                <b-form-group label="Name">
                                                    <b-form-input
                                                        type="text"
                                                        v-model="new_location.name"
                                                    >
                                                    </b-form-input>
                                                </b-form-group>
                                            </b-col>
                                            <b-col>
                                                <b-form-group label="Notes">
                                                    <b-form-input
                                                        type="text"
                                                        v-model="new_location.notes"
                                                    >
                                                    </b-form-input>
                                                </b-form-group>
                                            </b-col>
                                            <b-col>
                                                <b-form-group label="Sort">
                                                    <b-form-input
                                                        type="text"
                                                        v-model="new_location.sort_order"
                                                    >
                                                    </b-form-input>
                                                </b-form-group>
                                            </b-col>
                                        </b-row>
                                    </b-container>
                                </b-modal>
                            </b-col>
                        </b-form-row>
                        
                        <b-form-row>
                            <b-col md="6">
                                <b-form-group label="Parent Asset" label-cols="4" label-align="right">
                                    <el-select
                                        v-model="asset.parent_asset_id"
                                        @change="save"
                                        filterable
                                        clearable
                                        default-first-option
                                    >
                                        <el-option
                                            v-for="option in filtered_assets"
                                            :value="option.id"
                                            :key="option.id"
                                            :label="option.name"
                                            >
                                        </el-option>
                                    </el-select>
                                
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
                                <b-form-group label="Notes" label-cols="4" label-align="right">
                                    <b-form-textarea
                                        v-model="asset.notes"
                                        @change="save"
                                    >
                                    </b-form-textarea>
                                
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
                    <img src="@/assets/add.png" @click.stop="addAppraisal" fluid alt="+" style="width:20px;cursor:pointer;" />
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
                    <img src="@/assets/add.png" @click.stop="addImprovement" fluid alt="+" style="width:20px;cursor:pointer;" />
                </b-tab>
                <b-tab title="Pictures">
                    <div v-for="picture in pictures" :key="picture.filename">
                        <img :src="'/api/uploads/assets/pictures/' + picture.filename" style="width:600px;" :alt="picture.original_filename" />
                        {{ picture.original_filename }}
                    </div>
                    <img v-b-modal.upload-pictures src="@/assets/add.png" @click.stop="addImprovement" fluid alt="+" style="width:20px;cursor:pointer;" />
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
                </b-tab>
            </b-tabs>
            <b-button @click="resetForm">New</b-button>
            <b-button @click="$router.push('/assets')">Done</b-button>
        </main>
    </div>
</template>
<script>
import moment from 'moment'
import TopMenu from './TopMenu'
import AssetAddNumber from './AssetAddNumber'
export default {
    name: 'EditAsset',
    components: {
        TopMenu,
        AssetAddNumber
    },
    props: {
        asset_id: {default: null}
    },
    data () {
        return {
            asset: { id: null, asset_category_id: null, item_number: null },
            asset_categories: [],
            asset_brands: [],
            asset_types: [],
            asset_groups: [],
            asset_subs: [],
            asset_usage_types: [],
            assets: [],
            locations: [],
            appraisals: [],
            appraisal_fields: ['date','appraisal','delete'],
            improvements: [],
            improvement_fields: ['description','details','date','cost','delete'],
            new_pictures: [],
            pictures: [],
            new_location: {}
        };
    },
    created () {
        this.$http.get('/asset_categories').then(response => {
            this.asset_categories = response.data.data;
        });
        this.$http.get('/asset_brands').then(response => {
            this.asset_brands = response.data.data;
        });
        this.$http.get('/asset_types').then(response => {
            this.asset_types = response.data.data;
        });
        this.$http.get('/asset_groups').then(response => {
            this.asset_groups = response.data.data;
        });
        this.$http.get('/asset_subs').then(response => {
            this.asset_subs = response.data.data;
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
            this.getPictures();
        }
    },
    methods: {
        resetForm(){
            this.asset = { id: null, asset_category_id: null, item_number: null };
        },
        reloadNumbers(item){
            this.$http.get('/' + item.list).then(response => {
                this[item.list] = response.data.data;
                this.asset[item.key] = item.value;
            });
        },
        save() {
            if(!this.asset.name){
                return;
            }
            let asset = this.asset;
            if(asset.purchase_cost){
                asset.purchase_cost = asset.purchase_cost.replace(/[^\d.]/g,'');
            }
            if(this.asset.id === null){
                this.$http.post('/asset',asset)
                    .then((results) => {
                        this.asset.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset/' + this.asset.id, asset);
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
        },
        uploadPictures(){
            this.new_pictures.map(p => {
                let picture = new FormData();
                picture.append('picture', p);
                picture.append('asset_id', this.asset.id);
                this.$http.post('/asset_picture',picture,{headers: {'Content-Type': 'multipart/form-data'}}).then(() => {
                    this.getPictures();
                });
            });
        },
        getPictures(){
            this.$http.get('/asset_pictures?asset_id=' + this.asset_id).then(response => {
                this.pictures = response.data.data;
            });
        },
        getNumberString(numbers_type,number_key){
            if(!this.asset[number_key]){
                return '0';
            }
            let numbers = this[numbers_type].filter(x => (x.id == this.asset[number_key]));
            if(!numbers.length){
                return '0';
            }
            return numbers[0].number;
        },
        updateParent(list,my_key,parent_key){
            let selected = list.filter(i => (i.id == this.asset[my_key]));
            if(!selected.length){
                return;
            }
            this.asset[parent_key] = selected[0][parent_key];
        },
        brandChanged(){
            if(!this.asset.asset_category_id){
                this.updateParent(this.asset_brands,'asset_brand_id','asset_category_id');
            }
            this.save();
        },
        typeChanged(){
            if(!this.asset.asset_brand_id){
                this.updateParent(this.asset_types,'asset_type_id','asset_brand_id');
                this.brandChanged();
            }
            else{
                this.save();
            }
        },
        groupChanged(){
            if(!this.asset.asset_type_id){
                this.updateParent(this.asset_groups,'asset_group_id','asset_type_id');
                this.typeChanged();
            }
            else{
                this.save();
            }
        },
        subChanged(){
            if(!this.asset.asset_group_id){
                this.updateParent(this.asset_subs,'asset_sub_id','asset_group_id');
                this.groupChanged();
            }
            else{
                this.save();
            }
        },
        showAddLocation() {
            this.$refs['add-location-modal'].show();
        },
        addLocation(event) {
            event.preventDefault();
            if(!this.new_location.name){
                alert('Name required');
                return;
            }
            this.$http.post('/asset_location',this.new_location).then(() => {
                this.new_location = {};
                this.$refs['add-location-modal'].hide();
                this.$http.get('/asset_locations').then(response => {
                    this.locations = response.data.data;
                });     
            });
        },
        currencyFormatter(value){
            const valid_chars = /[^\d$,.]/g;
            value = value.replace(valid_chars, '');
            //const dollar_sign = /^\$?/;
            //value = value.replace(dollar_sign, '$');
            return value;
        }
    },
    computed: {
        filtered_assets(){
            let assets = this.assets.filter(a => (a.id !== this.asset.id));
            if(!this.asset.asset_type_id){
                return assets;
            }
            return assets.filter(a => (a.asset_type_id === this.asset.asset_type_id));
        },
        number_string(){
            let number = '';
            number += this.getNumberString('asset_categories','asset_category_id');
            number += this.getNumberString('asset_brands','asset_brand_id');
            number += this.getNumberString('asset_types','asset_type_id');
            number += this.getNumberString('asset_groups','asset_group_id');
            number += this.getNumberString('asset_subs','asset_sub_id');
            number += this.asset.item_number ? this.asset.item_number : '0';
            return number;
        },
        item_numbers(){
            let free_numbers = [];
            let all_numbers = [];
            for(let x=0;x<10;x++){
                all_numbers.push(x + '');
            }
            for(let x=65;x<91;x++){
                all_numbers.push(String.fromCharCode(x));
            }
            all_numbers.map(x => {
                if(!this.assets.filter(a => (a.item_number == x && a.asset_sub_id == this.asset.asset_sub_id && a.id != this.asset.id )).length){
                    free_numbers.push(x+'');
                }
            });
            return free_numbers;
        }
    }
};
</script>

