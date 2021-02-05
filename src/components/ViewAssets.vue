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
                :items="assets"
                :fields="fields"
            >
                <template v-slot:cell(id)="data">
                    <a :href="'/asset/' + data.value"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(asset_category)="data">
                    {{ data.value.number }} {{ data.value.name }}
                </template>
                <template v-slot:cell(asset_brand)="data">
                    {{ data.value.number }} {{ data.value.name }}
                </template>
                <template v-slot:cell(asset_type)="data">
                    {{ data.value.number }} {{ data.value.name }}
                </template>
                <template v-slot:cell(asset_group)="data">
                    {{ data.value.number }} {{ data.value.name }}
                </template>
                <template v-slot:cell(asset_sub)="data">
                    {{ data.value.number }} {{ data.value.name }}
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewAssets',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            assets: [],
            filter: null,
            fields: [
                    {
                        key: 'id',
                        label: 'Id',
                        sortable: true
                    },
                    {
                        key: 'name',
                        label: 'Name',
                        sortable: true
                    },
                    {
                        key: 'asset_category',
                        label: 'Category',
                        sortable: true
                    },
                    {
                        key: 'asset_brand',
                        label: 'Brand',
                        sortable: true
                    },
                    {
                        key: 'asset_type',
                        label: 'Type',
                        sortable: true
                    },
                    {
                        key: 'asset_group',
                        label: 'Group',
                        sortable: true
                    },
                    {
                        key: 'asset_sub',
                        label: 'Sub',
                        sortable: true
                    },
                    {
                        key: 'asset_usage_type.name',
                        label: 'Asset Usage Type',
                        sortable: true
                    },
                    {
                        key: 'year',
                        label: 'Year',
                        sortable: true
                    },
                    {
                        key: 'make',
                        label: 'Make',
                        sortable: true
                    },
                    {
                        key: 'model',
                        label: 'Model',
                        sortable: true
                    },
                    {
                        key: 'trim',
                        label: 'Trim',
                        sortable: true
                    },
                    {
                        key: 'vin',
                        label: 'Vin',
                        sortable: true
                    },
                    {
                        key: 'parent_asset.name',
                        label: 'Parent',
                        sortable: true
                    },
                    {
                        key: 'notes',
                        label: 'Notes',
                        sortable: true
                    },
                    {
                        key: 'created_at',
                        label: 'Created At',
                        sortable: true
                    },
                    {
                        key: 'updated_at',
                        label: 'Updated At',
                        sortable: true
                    },
            ]
        }
    },
    created() {
        this.$http.get('/assets?includes=asset_usage_type,asset_category,asset_brand,asset_type,asset_group,asset_sub,parent_asset').then(response => {
            this.assets = response.data.data;
        });
    }
}
</script>

