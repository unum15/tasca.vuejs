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
                <template v-slot:cell(created_at)="data">
                    {{formatTime(data.value)}}
                </template>
                <template v-slot:cell(updated_at)="data">
                    {{formatTime(data.value)}}
                </template>
                <template v-slot:cell(actions)="data">
                    <img src="@/assets/details.png" v-b-tooltip.hover :title="data.item.notes" fluid alt="DTS" style="width:20px;" />
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import moment from 'moment';
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
            ]
        }
    },
    created() {
        this.$http.get('/assets?includes=asset_usage_type,asset_category,asset_brand,asset_type,asset_group,asset_sub,parent_asset,asset_location').then(response => {
            this.assets = response.data.data;
            this.filterColumns();
        });
    },
    methods: {
        formatTime(time){
            return moment(time).format('MM-YY');
        },
        filterColumns(){
            this.filtered_assets = this.assets;
            for(var x = 0;x < this.fields.length; x++){
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
        },
        assetNumber(asset){
            return (asset.asset_category ? asset.asset_category.number : '0') + (asset.asset_brand ? asset.asset_brand.number : '0') + (asset.asset_type ? asset.asset_type.number : '0') + (asset.asset_group ? asset.asset_group.number : '0') + (asset.asset_sub ? asset.asset_sub.number : '0') + (asset.item_number ? asset.item_number : '0')
        }
    }
}
</script>

