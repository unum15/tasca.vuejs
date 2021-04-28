<template>
    <div>
        <b-row>
            <b-col class="header">Clock In</b-col>
            <b-col class="header">Clock Out</b-col>
            <b-col class="header">Hours</b-col>
            <b-col class="header">Labor Activity</b-col>
        </b-row>
        <div v-for="clock_in in clock_ins" :key="clock_in.id">
            <b-row>
                <b-col @click="editClockIn(clock_in, 'clock_in')" style="cursor:pointer;">{{ formatTime(clock_in.clock_in) }}</b-col>
                <b-col @click="editClockIn(clock_in, 'clock_out')" style="cursor:pointer;">{{ clock_in.clock_out ? formatTime(clock_in.clock_out) : 'Click to add.' }}</b-col>
                <b-col>{{ timeDiff(clock_in.clock_in, clock_in.clock_out) }}</b-col>
                <b-col>{{ clock_in.labor_activity.name }}</b-col>
            </b-row>
            <b-row>
                <b-col  @click="editClockIn(clock_in, 'notes')" style="cursor:pointer;" class="data" cols="9">{{ clock_in.notes ? clock_in.notes : 'Click to add notes.' }}</b-col>
            </b-row>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'ViewClockInsPopup',
    props: {
        contact_id : { required:true },
        id : { required:true },
        type: {required:true}
    },
    data() {
        return {
            clock_ins: [],
        };
    },
    created() {
        this.getClockIns();
    },
    methods: {
        getClockIns() {
            this.$http.get('/clock_ins?' + this.type + '_id=' + this.id + '&contact_id=' + this.contact_id).then((results) => {
                this.clock_ins = results.data;
                this.clock_ins.sort((a, b) => {
                    if(a.contact.name != b.contact.name){
                        return a.contact.name > b.contact.name;
                    }
                    return a.clock_in > b.clock_in;
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
        editClockIn(clock_in,field){
            var new_value = null;
            var old_value = !clock_in[field] ? '' : clock_in[field];
            new_value = prompt('Change ' + field, old_value);
            if(new_value != null){
                clock_in[field] = new_value;
                this.$http.patch('/clock_in/' + clock_in.id, clock_in);
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