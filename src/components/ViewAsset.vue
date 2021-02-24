<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset.name }}
        </h1>
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
        this.$http.get('/asset/number/' + this.asset_number).then(response => {
            this.asset = response.data.data;
        });
    }
};
</script>

