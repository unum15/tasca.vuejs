<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset_part.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Name" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_part.name"
                                @change="save"
                                type="text"
                                :state="asset_part.name != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="On Hand" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_part.on_hand"
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
                                v-model="asset_part.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>
               <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/asset_parts')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditAssetPart',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        asset_part_id: {default: null}
    },
    data () {
        return {
            asset_part: { id: null },
        };
    },
    created () {
        if(this.asset_part_id !== null) {
            this.$http.get('/asset_part/' + this.asset_part_id).then(response => {
                this.asset_part = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.asset_part.name)){
                return;
            }
            if(this.asset_part.id === null){
                this.$http.post('/asset_part',this.asset_part)
                    .then((results) => {
                        this.asset_part.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_part/' + this.asset_part.id, this.asset_part);
            }
        }
    }
};
</script>

