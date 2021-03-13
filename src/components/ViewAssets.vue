<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Assets
        </head>
        <main>
            <b-container fluid>
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group label="Filter" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Type to Search" />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="filtered_assets"
                :fields="fields"
                style="text-align:left"
            >
                <template v-slot:cell(export)="data">
                    <b-form-checkbox v-model="data.item.export" />
                </template>
                <template #thead-top="data">
                    <b-tr>
                        <b-th v-for="field in fields" :key="field.key">
                            <b-form-input type="text" @input="filterColumns" v-model="field.filter" v-if="field.filter !== undefined "></b-form-input>
                        </b-th>  
                    </b-tr>
                </template>
                <template v-slot:cell(name)="data">
                    <a :href="'/asset/' + data.item.id"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(number)="data">
                    <a :href="'/asset/number/' + assetNumber(data.item)">{{ assetNumber(data.item) }}</a>
                </template>
                <template v-slot:cell(purchase_date)="data">
                    {{formatTime(data.value)}}
                </template>
                <template v-slot:cell(exported_at)="data">
                    {{data.item.asset_exports.length ? formatTime(data.item.asset_exports[0]) : 'N/A'}}
                </template>
                <template v-slot:cell(created_at)="data">
                    {{formatTime(data.value)}}
                </template>
                <template v-slot:cell(updated_at)="data">
                    {{formatTime(data.value)}}
                </template>
                <template v-slot:cell(actions)="data">
                    <img src="@/assets/details.png" v-b-tooltip.hover :title="data.item.notes" fluid alt="DTS" style="width:20px;" />
                    <img src="@/assets/delete.png" v-b-tooltip.hover title="Delete" fluid alt="Delete" style="width:20px;" @click="deleteAsset(data.item)"/>
                </template>
            </b-table>
            <b-container fluid style='text-align:left'>
                <b-row v-for="(column,cindex) in columns" :key="cindex">
                  <template v-for="(field,findex) in column">
                    <b-col :key="'label_'+findex">
                        <b-form-checkbox v-model="columns[cindex][findex].label" />
                    </b-col>
                    <b-col :key="'select_'+findex">
                        <b-form-select v-model="columns[cindex][findex].field" :options="export_fields" />
                    </b-col>
                    <b-col :key="'check_'+findex">
                        <b-form-checkbox v-model="columns[cindex][findex].new_line" />
                    </b-col>
                    <b-col :key="'delete_'+findex">
                        <img src="@/assets/delete.png" v-b-tooltip.hover title="delete field" fluid alt="delete field" style="width:20px;" @click="columns[cindex].splice(findex,1)"/>
                    </b-col>
                  </template>
                  <b-col>
                    <img src="@/assets/add.png" v-b-tooltip.hover title="add field to column" fluid alt="add field" style="width:20px;" @click="columns[cindex].push({field:'',new_line:false,label:false})" />
                    <img src="@/assets/delete.png" v-b-tooltip.hover title="delete column" fluid alt="delete column" style="width:20px;" @click="columns.splice(cindex,1)"/>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <img src="@/assets/add.png" v-b-tooltip.hover title="add column" fluid alt="add column" style="width:20px;" @click="columns.push([{field:'',new_line:false,label:false}])"/>
                  </b-col>
                  <b-col>
                    <b-button @click="exportAssets">Export</b-button>        
                  </b-col>
                </b-row>
            </b-container>
            
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import moment from 'moment';
import FileSaver from 'file-saver';
import { mapState } from 'vuex';
export default {
    name: 'ViewAssets',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            assets: [],
            filtered_assets: [],
            filter: null,
            fields: [
                    {
                        key: 'export',
                        label: 'Export',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'name',
                        label: 'Name',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'asset_category.name',
                        label: 'Category',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'asset_brand.name',
                        label: 'Brand',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'asset_type.name',
                        label: 'Type',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'asset_group.name',
                        label: 'Group',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'asset_sub.name',
                        label: 'Sub',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'number',
                        label: 'Number',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'year',
                        label: 'Year',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'make',
                        label: 'Make',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'model',
                        label: 'Model',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'trim',
                        label: 'Trim',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'vin',
                        label: 'Vin',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'purchase_cost',
                        label: 'Cost',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'purchase_date',
                        label: 'Purchase Date',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'asset_location.name',
                        label: 'Location',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'parent_asset.name',
                        label: 'Parent',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'exported_at',
                        label: 'Exported At',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'created_at',
                        label: 'Created At',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'updated_at',
                        label: 'Updated At',
                        sortable: true,
                        filter: null
                    },
                    {
                        key: 'actions',
                        label: '',
                        sortable: false
                    },
            ],
            columns: [
                [{field:'url',new_line:true,label:true},{field:'name',new_line:true,label:true},{field:'number',new_line:true,label:true},{field:'asset_location.name',new_line:false,label:true}],
                [{field:'name',new_line:false,label:false}],
                [{field:'number',new_line:false,label:false}],
                [{field:'asset_location.name',new_line:false,label:false}]
            ],
            export_fields: [
                {value: 'url', text: 'URL'},
                {value: 'name', text: 'Name'},
                {value: 'number', text: 'Number'},
                {value: 'asset_location.name', text: 'Location'},
                {value: 'asset_category.name', text: 'Category'},
                {value: 'asset_brand.name', text: 'Brand'},
                {value: 'asset_type.name', text: 'Type'},
                {value: 'asset_group.name', text: 'Group'},
                {value: 'asset_sub.name', text: 'Sub'},
                {value: 'year', text: 'Year'},
                {value: 'make', text: 'Make'},
                {value: 'model', text: 'Model'},
                {value: 'trim', text: 'Trim'},
                {value: 'vin', text: 'VIN'},
                {value: 'purchase_cost', text: 'Cost'},
                {value: 'parent_asset.name', text: 'Parent'},
                {value: 'created_at', text: 'Created At'},
                {value: 'updated_at', text: 'Updated At'}
            ]
        }
    },
    created() {
        this.getAssets();
    },
    methods: {
        getAssets(){
            this.$http.get('/assets?includes=asset_usage_type,asset_category,asset_brand,asset_type,asset_group,asset_sub,parent_asset,asset_location,asset_exports').then(response => {
                let assets = response.data.data;
                assets.map( a => {
                    a.export = false;
                });
                this.assets = assets;
                this.filterColumns();
            });
        },
        formatTime(time){
            if(!time){
                return '';
            }
            return moment(time).format('MM-YY');
        },
        filterColumns(store=true){
            this.filtered_assets = this.assets;
            let filters = {};
            for(var x = 0;x < this.fields.length; x++){
                filters[this.fields[x].key] = this.fields[x].filter;
                if(this.fields[x].filter){
                    var regex = new RegExp(this.fields[x].filter, "i");
                    this.filtered_assets = this.filtered_assets.filter(t => {
                        var keys = this.fields[x].key.split('.');
                        var value = t;
                        for(var key_num = 0; key_num < keys.length; key_num++){
                            if(value){
                                value = value[keys[key_num]];
                            }
                        }
                        if(!value){
                            value = "";
                        }
                        return value.match(regex) !== null
                    })
                }
            }
            if(store){
                this.$store.dispatch('saveFilters',{filters,name:'assets'});
            }
        },
        assetNumber(asset){
            return (asset.asset_category ? asset.asset_category.number : '0') + (asset.asset_brand ? asset.asset_brand.number : '0') + (asset.asset_type ? asset.asset_type.number : '0') + (asset.asset_group ? asset.asset_group.number : '0') + (asset.asset_sub ? asset.asset_sub.number : '0') + (asset.item_number ? asset.item_number : '0')
        },
        exportAssets(){
            let text='';
            this.assets.map( a => {
                if(a.export){
                    this.$http.post('/asset/' + a.id + '/export');
                    let column_count=0;
                    this.columns.map( c => {
                        let field_count = 0;
                        if(column_count>0){
                                text += ',';
                        }
                        if(c.length>1){
                            text+='"';
                        }
                        c.map( f => {
                            if(f.label){
                                let label = this.export_fields.filter(ef => (ef.value == f.field));
                                text += label[0].text + ': ';
                            }
                            let subs;
                            switch(f.field){
                                case 'url':
                                    text += 'https://' + location.host + '/asset/number/' + this.assetNumber(a);
                                    break;
                                case 'number':
                                    text += this.assetNumber(a);
                                    break;
                                case '':
                                    break;
                                default:
                                    if(f.field.indexOf('.')>0){
                                        subs = f.field.split('.');
                                        if(a[subs[0]]){
                                            text += a[subs[0]][subs[1]];
                                        }
                                    }
                                    else{
                                        text += a[f.field]
                                    }
                            }
                            field_count++;
                            if(f.new_line){
                                text += '\n';
                            }
                            else if(field_count < c.length){
                                text += ' ';
                            }
                        });
                        if(c.length>1){
                            text+='"';
                        }
                        column_count++;
                    });
                    text += "\n";
                }
            });
            var blob = new Blob([text], {type: "text/csv;charset=utf-8"});
            FileSaver.saveAs(blob, "assets.csv");
            this.getAssets();
        },
        deleteAsset(asset){
            if(confirm("Delete " + asset.name + "?")){
                this.$http.delete('/asset/' + asset.id).then(() => {
                    let index = this.assets.findIndex(a => (a.id = asset.id));
                    this.assets.splice(index,1);
                });
            }
        }
    },
    computed: {
        ...mapState({
            stored_filters: state => state.filters.assets
        }),
    },
    watch: {
        stored_filters(){
            for(var x = 0;x < this.fields.length; x++){
                this.fields[x].filter = this.stored_filters[this.fields[x].key];
            }
        }
    }
}
</script>

