<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ maintenance.name }}
        </h1>
        <main>
            <b-container>
                <b-row>
                    <b-col cols="6">
                        <b-form-group 
							label="Service Id"
							label-cols="4"
						>
                            <b-form-select
                                v-model="maintenance.service_id"
                                @change="save"
                                :options="services"
                                value-field="id"
                                text-field="description"
                                :state="maintenance.service_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group 
							label="Ending Reading"
							label-cols="4"
						>
                            <b-form-input
                                v-model="maintenance.ending_reading"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group 
							label="Date"
							label-cols="4"
						>
                            <b-form-input
                                v-model="maintenance.date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group 
							label="Amount"
							label-cols="4"
						>
                            <b-form-input
                                v-model="maintenance.amount"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group 
							label="Where"
							label-cols="4"
						>
                            <b-form-input
                                v-model="maintenance.where"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group 
							label="Notes"
							label-cols="4"
						>
                            <b-form-input
                                v-model="maintenance.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>               <b-row>
                    <b-col cols="6">
                        <b-button @click="$router.push('/maintenances')">Done</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditMaintenance',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        maintenance_id: {default: null}
    },
    data () {
        return {
            maintenance: { id: null },
            services: [],
        };
    },
    created () {
        this.$http.get('/services').then(response => {
            this.services = response.data.data;
        });
        if(this.maintenance_id !== null) {
            this.$http.get('/maintenance/' + this.maintenance_id).then(response => {
                this.maintenance = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.maintenance.service_id)){
                return;
            }
            if(this.maintenance.id === null){
                this.$http.post('/maintenance',this.maintenance)
                    .then((results) => {
                        this.maintenance.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/maintenance/' + this.maintenance.id, this.maintenance);
            }
        }
    }
};
</script>

