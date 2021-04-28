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
                        <b-form-group label="Activity">
                            <Treeselect :options="filtered_labor_activities" :normalizer="treeNormalizer" v-model="clock_in.labor_activity_id"/>
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
import TopMenu from './TopMenu';
import { mapState } from 'vuex';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import treeNormalizer from '../common/TreeNormalizer.js';
import treeFilter from '../common/TreeFilter.js';
export default {
    name: 'EditClockIn',
    components: {
        TopMenu,
        Treeselect
    },
    props: {
        clock_in_id: {default: null}
    },
    data () {
        return {
            clock_in: { id: null, appointment: { task: { labor_activity_id: null } } },
            contacts: [],
            labor_activities: [],
            appointments: [],
        };
    },
    created () {
        this.getContacts();
        this.$http.get('/labor_activities').then(response => {
            this.labor_activities = response.data.data;
        });
        if(this.clock_in_id !== null) {
            this.$http.get('/clock_in/' + this.clock_in_id).then(response => {
                this.clock_in = response.data;
            });
        }
    },
    methods: {
        treeNormalizer,
        treeFilter,
        getContacts(){
            if(this.operator_id){
                this.$http.get('/contacts?client_id=' + this.operator_id).then(response => {
                    this.contacts = response.data;
                });
            }
        },
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
    },
    computed:{
        ...mapState({
            operator_id: state => state.settings.operating_company_client_id
        }),
        filtered_labor_activities(){
            if(this.clock_in.appointment.task.labor_assignment_id){
                return this.treeFilter(this.clock_in.appointment.task.labor_assignment_id,this.labor_activities);
            }
            return [];
        },
    },
    watch:{
        operator_id(){
            this.getContacts();
        }
    }
};
</script>

