<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ clock_in.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Contact" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="clock_in.contact_id"
                                @change="save"
                                :options="contacts"
                                value-field="id"
                                text-field="name"
                                :state="clock_in.contact_id != null"
                                required
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Clock In" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="clock_in.clock_in"
                                @change="save"
                                type="text"
                                :state="clock_in.clock_in != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Clock Out" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="clock_in.clock_out"
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
                                v-model="clock_in.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Creator Id" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="clock_in.creator_id"
                                @change="save"
                                type="number"
                                :state="clock_in.creator_id != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Updater Id" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="clock_in.updater_id"
                                @change="save"
                                type="number"
                                :state="clock_in.updater_id != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Task Date Id" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="clock_in.task_date_id"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Overhead Assignment" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="clock_in.overhead_assignment_id"
                                @change="save"
                                :options="overhead_assignments"
                                value-field="id"
                                text-field="name"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Overhead Category" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="clock_in.overhead_category_id"
                                @change="save"
                                :options="overhead_categories"
                                value-field="id"
                                text-field="name"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-button @click="$router.push('/clock_ins')">Done</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditClockIn',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        clock_in_id: {default: null}
    },
    data () {
        return {
            clock_in: { id: null },
            contacts: [],
            overhead_assignments: [],
            overhead_categories: [],
        };
    },
    created () {
        this.$http.get('/contacts').then(response => {
            this.contacts = response.data.data;
        });
        this.$http.get('/overhead_assignments').then(response => {
            this.overhead_assignments = response.data.data;
        });
        this.$http.get('/overhead_categories').then(response => {
            this.overhead_categories = response.data.data;
        });
        if(this.clock_in_id !== null) {
            this.$http.get('/clock_in/' + this.clock_in_id).then(response => {
                this.clock_in = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.clock_in.contact_id)||(!this.clock_in.clock_in)||(!this.clock_in.creator_id)||(!this.clock_in.updater_id)){
                return;
            }
            if(this.clock_in.id === null){
                this.$http.post('/clock_in',this.clock_in)
                    .then((results) => {
                        this.clock_in.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/clock_in/' + this.clock_in.id, this.clock_in);
            }
        }
    }
};
</script>

