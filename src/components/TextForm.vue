<template>
    <div>
        <b-alert
            :show="sms_status_countdown"
            dismissible
            @dismissed="sms_status_countdown=0"
            @dismiss-count-down="countDownChanged"
        >
            {{ sms_status }}
        </b-alert>
        <b-modal size="sm" scrollable ref="modalSMS" id="modalSMS" title="Send Text Message" @ok="sendSMS">
            <b-form>
                <b-form-row>
                    <b-col>
                        <b-form-group label="Send Text To">
                            <b-form-radio-group
                                v-model="sms.to"
                                :options="sms_numbers"
                                stacked
                            >
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col>
                        <b-button v-b-modal.modalSMSMessages>Select Message</b-button>
                    </b-col>
                </b-form-row>
                <b-modal size="sm" scrollable ref="modalSMSMessages" id="modalSMSMessages" title="Select Message" :hide-footer="true">
                    <b-form-radio-group v-model="message_type_id" :options="filtered_message_types" value-field="id" text-field="name">
                    </b-form-radio-group>
                    <div v-for="message in filtered_sms_messages" :key="message.id" class="select-message" @click="selectMessage(message.id)">
                        <b-form-row style="border-bottom: 1px solid gray">
                            <b-col>
                                {{ message.name}} 
                            </b-col>
                        </b-form-row>
                        <b-form-row>
                            <b-col>
                                {{ message.message}} 
                            </b-col>
                        </b-form-row>
                    </div>
                </b-modal>
                <b-form-row>
                    <b-col >
                        <b-form-group label="Message">
                            <b-form-textarea
                                v-model="sms.message"
                            >                        
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col>
                        <b-button @click="copyNumber()">Copy Number</b-button>
                        <b-button @click="copyMessage()">Copy Message</b-button>
                    </b-col>
                </b-form-row>
            </b-form>
        </b-modal>
</div>
</template>
<script>
import { mapState } from 'vuex';
import moment from 'moment';
export default {
    name: 'TextForm',
    props: {
        sms_messages: {required: true},
        sms_task: {required: true},
        message_types: {required: true},
    },
    data() {
        return {
            sms_status_countdown: 0,
            sms_status: 'N/A',
            sms_numbers: [],
            sms: {},
            sms_message_id: null,
            message_type_id: null,
            contacts: [],
        }
    },
    created() {
        const has_date = !!this.sms_task.date;
        this.message_type_id = has_date ? this.default_date_sms_message_type_id : this.default_nondate_sms_message_type_id;
    },
    methods: {
        copyNumber(){
            navigator.clipboard.writeText(this.sms.to);
        },
        copyMessage(){
            navigator.clipboard.writeText(this.sms.message);
        },
        sendSMS(){
            let sms = this.sms;
            const regex = /\D/g;
            sms.to = sms.to.replace(regex,'');
            if(sms.to[0] != '1'){
                sms.to = '1' + sms.to;
            }
            this.$http.post('/did/send', this.sms).then(response => {
                this.sms_status = response.data.sms_status;
                this.sms_status_countdown = 5;
            });
        },
        selectMessage(message_id){
            let message = this.sms_messages.filter(m => m.id == message_id);
            if(message.length){
                this.sms_message_id = message_id;
                this.sms.message = message[0].message;
                this.replaceMessage()
                if(this.$refs['modalSMSMessages']){
                    this.$refs['modalSMSMessages'].hide();
                }
            }
        },
        replaceMessage(){
            if(!this.sms.message){
                return
            }
            for (const [key, value] of Object.entries(this.sms_task)) {
                let replace = value;
                if(replace){
                    switch(key){
                        case 'time':
                            replace = moment(this.sms_task.date+ ' ' + value).format('LT')
                            break;
                        case 'date':
                            replace = moment(value).format('ddd MM-DD')
                            break;
                            
                    }
                }
                else{
                    replace = 'N/A'
                }
                this.sms.message = this.sms.message.replace(`{${key}}`,replace);
            }
            let contacts = this.contacts.filter(c => c.phone_numbers.filter(n => n.phone_number == this.sms.to).length);
            if(contacts.length){
                const names = contacts[0].name.split(' ')
                this.sms.message = this.sms.message.replace(`{contact.name}`,names[0]);
            }
        },
        showSMSModal(){
            this.$refs['modalSMS'].show();
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown;
        },
    },
    computed:{
        ...mapState({
          default_date_sms_message_type_id: state => state.settings.default_date_sms_message_type_id,
          default_nondate_sms_message_type_id: state => state.settings.default_nondate_sms_message_type_id,
        }),
        filtered_sms_messages(){
            return this.sms_messages.filter(m => m.message_type_id==this.message_type_id)
        },
        filtered_message_types(){
            const has_date = !!this.sms_task.date;
            return this.message_types.filter(m => m.uses_date==has_date)
        },
    },
    watch:{
        filtered_message_types(){
            const has_date = !!this.sms_task.date;
            this.message_type_id = has_date ? this.default_date_sms_message_type_id : this.default_nondate_sms_message_type_id;
        },
        sms_task:{
            deep: true,
            handler(){
                this.sms_numbers = [];
                this.sms = { to: null, message: null};
                this.selectMessage(this.sms_message_id);
                if(!this.sms_task.client_id){
                    return;
                }
                this.$http.get('/contacts?client_id=' + this.sms_task.client_id).then(response => {
                    this.contacts = response.data;
                    this.contacts.forEach(contact => {
                        contact.phone_numbers.forEach(number => {
                            this.sms_numbers.push({
                                value: number.phone_number,
                                text: contact.name + " - " + number.phone_number_type.name + " - " + number.phone_number
                            });
                            if(!this.sms.to){
                                this.sms.to = number.phone_number;
                                this.replaceMessage()
                            }
                        });
                    });
                });
            }
        }
    }

}
</script>