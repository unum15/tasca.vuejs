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
                    <b-col>
                        <div v-for="message_type in filtered_partial_text_message_types" :key="message_type.id">
                        <b-form-group :label="message_type.name">
                            <b-form-select
                                v-model="partials[message_type.id]"
                                :options="getPartialMessages(message_type.id)"
                                value-field="id"
                                text-field="message"
                                @change="replaceMessage"
                            >
                            </b-form-select>
                        </b-form-group>
                        </div>
                    </b-col>
                </b-form-row>
                <b-form-row>
                    <b-col>
                        <b-button v-b-modal.modalSMSMessages>Select Message</b-button>
                    </b-col>
                </b-form-row>
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
        </b-modal>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import moment from 'moment';
export default {
    name: 'TextForm',
    props: {
        sms_task: {required: true},
    },
    data() {
        return {
            sms_messages: [],
            message_types: [],            
            sms_status_countdown: 0,
            sms_status: 'N/A',
            sms_numbers: [],
            sms: { message: null, to: null, stock: null},
            sms_message_id: null,
            message_type_id: null,
            contacts: [],
            partial_message_types: [],
            partials: [],
            partial_messages: []
        }
    },
    created() {
        this.$http.get('/sms_message_types').then(response => {
            this.message_types = response.data.data;
        });
        this.$http.get('/stock_text_messages').then(response => {
            this.sms_messages = response.data.data;
        });
        this.$http.get('/partial_text_message_types').then(response => {
            this.partial_message_types = response.data.data;
        });
        this.$http.get('/partial_text_messages').then(response => {
            this.partial_messages = response.data.data;
        });
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
                this.sms.stock_message = message[0].message;
                this.sms.message = message[0].message;
                if(this.$refs['modalSMSMessages']){
                    this.$refs['modalSMSMessages'].hide();
                }
                const partial_types = this.filtered_partial_text_message_types;
                for(let x=0;x<partial_types.length;x++){
                    const replace = this.getPartialMessages(partial_types[x].id);
                    if(replace.length){
                        this.partials[partial_types[x].id] = replace[0].id;
                    }
                }
                this.replaceMessage();
            }
        },
        replaceMessage(){
            if(!this.sms.stock_message){
                return
            }
            let message  = this.sms.stock_message;
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
                message = message.replace(`{${key}}`,replace);
            }
            let contacts = this.contacts.filter(c => c.phone_numbers.filter(n => n.phone_number == this.sms.to).length);
            if(contacts.length){
                const names = contacts[0].name.split(' ')
                message = message.replace(`{contact.name}`,names[0]);
            }
            const partial_types = this.filtered_partial_text_message_types;
            for(let x=0;x<partial_types.length;x++){
                if(this.partials[partial_types[x].id]){
                    const replace = this.partial_messages.filter(m => (m.id == this.partials[partial_types[x].id]));
                    if(replace.length){
                        message = message.replace(`{partials.${partial_types[x].name}}`,replace[0].message);
                    }
                }
            }
            this.sms.message = message;
        },
        showSMSModal(){
            this.$refs['modalSMS'].show();
        },
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown;
        },
        getPartialMessages(message_type_id){
            return this.partial_messages.filter(m => m.partial_text_message_type_id == message_type_id);
        }
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
        filtered_partial_text_message_types(){
            if(!this.sms.stock_message){
                return [];
            }
            const partialMatch = /{partials\.(.*?)}/gi;
            let matches, partials = [];
            matches = partialMatch.exec(this.sms.stock_message);
            while (matches){
                partials.push(matches[1]);
                matches = partialMatch.exec(this.sms.stock_message);
            }
            return this.partial_message_types.filter(m => (partials.includes(m.name)));
        }
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
                this.sms = { to: null, message: null, stock_message: null};
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