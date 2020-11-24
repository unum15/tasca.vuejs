<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset_fueling.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_fueling.asset_id"
                                @change="save"
                                :options="assets"
                                value-field="id"
                                text-field="name"
                                :state="asset_fueling.asset_id != null"
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
                                v-model="asset_fueling.usage"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Date" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_fueling.date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Gallons" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_fueling.gallons"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Amount" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="asset_fueling.amount"
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
                                v-model="asset_fueling.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>
               <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/asset_fuelings')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditAssetFueling',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        asset_fueling_id: {default: null}
    },
    data () {
        return {
            asset_fueling: { id: null },
            assets: [],
        };
    },
    created () {
        this.$http.get('/assets').then(response => {
            this.assets = response.data.data;
        });
        if(this.asset_fueling_id !== null) {
            this.$http.get('/asset_fueling/' + this.asset_fueling_id).then(response => {
                this.asset_fueling = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.asset_fueling.asset_id)){
                return;
            }
            if(this.asset_fueling.id === null){
                this.$http.post('/asset_fueling',this.asset_fueling)
                    .then((results) => {
                        this.asset_fueling.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_fueling/' + this.asset_fueling.id, this.asset_fueling);
            }
        }
    }
};
</script>

