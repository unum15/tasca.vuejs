<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ service.name }}
        </h1>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Vehicle Id">
                            <b-form-select
                                v-model="service.vehicle_id"
                                @change="save"
                                :options="vehicles"
                                value-field="id"
                                text-field="name"
                                :state="service.vehicle_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Service Type Id">
                            <b-form-select
                                v-model="service.service_type_id"
                                @change="save"
                                :options="service_types"
                                value-field="id"
                                text-field="name"
                                :state="service.service_type_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Description">
                            <b-form-input
                                v-model="service.description"
                                @change="save"
                                type="text"
                                :state="service.description != null"
                                required
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Quantity">
                            <b-form-input
                                v-model="service.quantity"
                                @change="save"
                                type="number"
                                :state="service.quantity != null"
                                required
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Usage Type Id">
                            <b-form-select
                                v-model="service.usage_type_id"
                                @change="save"
                                :options="usage_types"
                                value-field="id"
                                text-field="name"
                                :state="service.usage_type_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Usage Interval">
                            <b-form-input
                                v-model="service.usage_interval"
                                @change="save"
                                type="number"
                                :state="service.usage_interval != null"
                                required
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Part Number">
                            <b-form-input
                                v-model="service.part_number"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Notes">
                            <b-form-input
                                v-model="service.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Time Interval">
                            <b-form-input
                                v-model="service.time_interval"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>               <b-row>
                    <b-col>
                        <b-button @click="$router.push('/services')">Done</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditService',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        service_id: {default: null}
    },
    data () {
        return {
            service: { id: null },
            vehicles: [],
            service_types: [],
            usage_types: [],
        };
    },
    created () {
        this.$http.get('/vehicles').then(response => {
            this.vehicles = response.data.data;
        });
        this.$http.get('/service_types').then(response => {
            this.service_types = response.data.data;
        });
        this.$http.get('/usage_types').then(response => {
            this.usage_types = response.data.data;
        });
        if(this.service_id !== null) {
            this.$http.get('/service/' + this.service_id).then(response => {
                this.service = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.service.vehicle_id)||(!this.service.service_type_id)||(!this.service.description)||(!this.service.quantity)||(!this.service.usage_type_id)||(!this.service.usage_interval)){
                return;
            }
            if(this.service.id === null){
                this.$http.post('/service',this.service)
                    .then((results) => {
                        this.service.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/service/' + this.service.id, this.service);
            }
        }
    }
};
</script>

