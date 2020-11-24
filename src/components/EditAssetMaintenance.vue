<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ asset_maintenance.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset Service" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_maintenance.asset_service_id"
                                @change="save"
                                :options="asset_services"
                                value-field="id"
                                text-field="description"
                                :state="asset_maintenance.asset_service_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Asset Usage Type" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="asset_maintenance.asset_usage_type_id"
                                @change="save"
                                :options="asset_usage_types"
                                value-field="id"
                                text-field="name"
                                :state="asset_maintenance.asset_usage_type_id != null"
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
                                v-model="asset_maintenance.usage"
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
                                v-model="asset_maintenance.date"
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
                                v-model="asset_maintenance.amount"
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
                            <b-form-input
                                v-model="asset_maintenance.where"
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
                                v-model="asset_maintenance.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/asset_maintenances')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditAssetMaintenance',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        asset_maintenance_id: {default: null}
    },
    data () {
        return {
            asset_maintenance: { id: null },
            asset_services: [],
            asset_usage_types: [],
        };
    },
    created () {
        this.$http.get('/asset_services').then(response => {
            this.asset_services = response.data.data;
        });
        this.$http.get('/asset_usage_types').then(response => {
            this.asset_usage_types = response.data.data;
        });
        if(this.asset_maintenance_id !== null) {
            this.$http.get('/asset_maintenance/' + this.asset_maintenance_id).then(response => {
                this.asset_maintenance = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.asset_maintenance.asset_service_id)||(!this.asset_maintenance.asset_usage_type_id)){
                return;
            }
            if(this.asset_maintenance.id === null){
                this.$http.post('/asset_maintenance',this.asset_maintenance)
                    .then((results) => {
                        this.asset_maintenance.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/asset_maintenance/' + this.asset_maintenance.id, this.asset_maintenance);
            }
        }
    }
};
</script>

