<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ repair.name }}
        </h1>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Vehicle Id">
                            <b-form-select
                                v-model="repair.vehicle_id"
                                @change="save"
                                :options="vehicles"
                                value-field="id"
                                text-field="name"
                                :state="repair.vehicle_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Repair">
                            <b-form-input
                                v-model="repair.repair"
                                @change="save"
                                type="text"
                                :state="repair.repair != null"
                                required
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Ending Reading">
                            <b-form-input
                                v-model="repair.ending_reading"
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
                                v-model="repair.date"
                                @change="save"
                                type="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Amount">
                            <b-form-input
                                v-model="repair.amount"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Where">
                            <b-form-input
                                v-model="repair.where"
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
                                v-model="repair.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>               <b-row>
                    <b-col>
                        <b-button @click="$router.push('/repairs')">Done</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditRepair',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        repair_id: {default: null}
    },
    data () {
        return {
            repair: { id: null },
            vehicles: [],
        };
    },
    created () {
        this.$http.get('/vehicles').then(response => {
            this.vehicles = response.data.data;
        });
        if(this.repair_id !== null) {
            this.$http.get('/repair/' + this.repair_id).then(response => {
                this.repair = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.repair.vehicle_id)||(!this.repair.repair)){
                return;
            }
            if(this.repair.id === null){
                this.$http.post('/repair',this.repair)
                    .then((results) => {
                        this.repair.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/repair/' + this.repair.id, this.repair);
            }
        }
    }
};
</script>

