<template>
    <div>
        <b-row>
            <b-col class="header">Sign In</b-col>
            <b-col class="header">Sign Out</b-col>
            <b-col class="header">Hours</b-col>
            <b-col class="header">Labor Category</b-col>
        </b-row>
        <div v-for="sign_in in sign_ins" :key="sign_in.id">
            <b-row>
                <b-col @click="editSignIn(sign_in, 'sign_in')" style="cursor:pointer;">{{ formatTime(sign_in.sign_in) }}</b-col>
                <b-col @click="editSignIn(sign_in, 'sign_out')" style="cursor:pointer;">{{ sign_in.sign_out ? formatTime(sign_in.sign_out) : 'Click to add.' }}</b-col>
                <b-col>{{ timeDiff(sign_in.sign_in, sign_in.sign_out) }}</b-col>
                <b-col></b-col>
            </b-row>
            <b-row>
                <b-col class="label">Notes For The Day</b-col>
                <b-col  @click="editSignIn(sign_in, 'notes')" style="cursor:pointer;" class="data" cols="9">{{ sign_in.notes ? sign_in.notes : 'Click to add.' }}</b-col>
            </b-row>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'ViewSignIns',
    props: {
        contact_id : { required:true },
        id : { required:true },
        type: {required:true}
    },
    data() {
        return {
            sign_ins: [],
        };
    },
    created() {
        this.getSignIns();
    },
    methods: {
        getSignIns() {
            this.$http.get('/sign_ins?' + this.type + '_id=' + this.id + '&contact_id=' + this.contact_id).then((results) => {
                this.sign_ins = results.data;
                this.sign_ins.sort((a, b) => {
                    if(a.contact.name != b.contact.name){
                        return a.contact.name > b.contact.name;
                    }
                    return a.sign_in > b.sign_in;
                });
            });
        },
        timeDiff(start_time, stop_time){
            var start = moment(start_time)
            var stop = moment();
            if(stop_time){
                stop = moment(stop_time)
            }
            var diff = Math.round(stop.diff(start)/36000)/100
            
            return diff
        },
        formatTime(time){
            if(time == null){
                return "";
            }
            return moment(time).format('MM-DD hh:mm')
        },
        editSignIn(sign_in,field){
            var new_value = null;
            var old_value = !sign_in[field] ? '' : sign_in[field];
            new_value = prompt('Change ' + field, old_value);
            if(new_value != null){
                sign_in[field] = new_value;
                this.$http.patch('/sign_in/' + sign_in.id, sign_in);
            }
        }
    }
}
</script>
<style scoped>
.label {
    text-align: right;
    font-weight: bold;
}

.header {
    font-weight: bold;
}

.data {
    text-align: left;
}
</style>