<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ vehicle.name }}
        </h1>
        <main>
            <b-container>
                <b-row>
                    <b-col cols="6">
                        <b-form-group
                            label="Name"
                            label-cols="4"
                            >
                            <b-form-input
                                v-model="vehicle.name"
                                @change="save"
                                type="text"
                                :state="vehicle.name != null"
                                required
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group
                            label="Vehicle Type"
                            label-cols="4"
                            >
                            <b-form-select
                                v-model="vehicle.vehicle_type_id"
                                @change="save"
                                :options="vehicle_types"
                                value-field="id"
                                text-field="name"
                                :state="vehicle.vehicle_type_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group
                            label="Year"
                            label-cols="4"
                            >
                            <b-form-input
                                v-model="vehicle.year"
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
                            label="Make"
                            label-cols="4"
                            >
                            <b-form-input
                                v-model="vehicle.make"
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
                            label="Model"
                            label-cols="4"
                            >
                            <b-form-input
                                v-model="vehicle.model"
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
                            label="Trim"
                            label-cols="4"
                            >
                            <b-form-input
                                v-model="vehicle.trim"
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
                            label="Vin"
                            label-cols="4"
                            >
                            <b-form-input
                                v-model="vehicle.vin"
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
                                v-model="vehicle.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-button @click="$router.push('/vehicles')">Done</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditVehicle',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        vehicle_id: {default: null}
    },
    data () {
        return {
            vehicle: { id: null },
            vehicle_types: [],
        };
    },
    created () {
        this.$http.get('/vehicle_types').then(response => {
            this.vehicle_types = response.data.data;
        });
        if(this.vehicle_id !== null) {
            this.$http.get('/vehicle/' + this.vehicle_id).then(response => {
                this.vehicle = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.vehicle.name)||(!this.vehicle.vehicle_type_id)){
                return;
            }
            if(this.vehicle.id === null){
                this.$http.post('/vehicle',this.vehicle)
                    .then((results) => {
                        this.vehicle.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/vehicle/' + this.vehicle.id, this.vehicle);
            }
        }
    }
};
</script>

