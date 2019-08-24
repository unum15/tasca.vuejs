<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ fueling.name }}
        </h1>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Vehicle Id">
                            <b-form-select
                                v-model="fueling.vehicle_id"
                                @change="save"
                                :options="vehicles"
                                value-field="id"
                                text-field="name"
                                :state="fueling.vehicle_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Beginning Reading">
                            <b-form-input
                                v-model="fueling.beginning_reading"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Ending Reading">
                            <b-form-input
                                v-model="fueling.ending_reading"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Date">
                            <b-form-input
                                v-model="fueling.date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Gallons">
                            <b-form-input
                                v-model="fueling.gallons"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Amount">
                            <b-form-input
                                v-model="fueling.amount"
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
                                v-model="fueling.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>               <b-row>
                    <b-col>
                        <b-button @click="$router.push('/fuelings')">Done</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditFueling',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        fueling_id: {default: null}
    },
    data () {
        return {
            fueling: { id: null },
            vehicles: [],
        };
    },
    created () {
        this.$http.get('/vehicles').then(response => {
            this.vehicles = response.data.data;
        });
        if(this.fueling_id !== null) {
            this.$http.get('/fueling/' + this.fueling_id).then(response => {
                this.fueling = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.fueling.vehicle_id)){
                return;
            }
            if(this.fueling.id === null){
                this.$http.post('/fueling',this.fueling)
                    .then((results) => {
                        this.fueling.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/fueling/' + this.fueling.id, this.fueling);
            }
        }
    }
};
</script>

