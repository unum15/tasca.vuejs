<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset.name }}
        </h1>
        <b-container>
            <b-row v-for="(value,field) in asset" :key="field" v-if="field.substr(-2) !== 'id'">
                <b-col style="text-align:right;">
                    {{ field }}
                </b-col>
                <b-col style="text-align:left;">
                    {{ value === null ? '' : typeof value === 'object' ? value.name : value }}
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'ViewAsset',
    components: {
        TopMenu
    },
    props: {
        asset_number: {required: true}
    },
    data () {
        return {
            asset: {},
        };
    },
    created () {
        this.$http.get('/asset/number/' + this.asset_number +'?includes=asset_usage_type,asset_category,asset_brand,asset_type,asset_group,asset_sub,parent_asset,asset_location,asset_exports').then(response => {
            this.asset = response.data.data;
        });
    }
};
</script>

