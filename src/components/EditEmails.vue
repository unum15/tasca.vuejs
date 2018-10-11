<template>
    <b-card title="Email" class="mb-2">
        <div v-for="email in emails" :key="email.id">
            <EmailForm
                :settings="settings"
                :email_types="email_types"
                :email="email"
            >
            </EmailForm>
        </div>
        <b-button variant="secondary" @click="newEmail()">Add Email</b-button>
    </b-card>
</template>
<script>
import EmailForm from './EmailForm';
export default {
  name: 'EditEmails',
  components: {
    'EmailForm': EmailForm
  },
  props: {
    contact_id: {default: null},
    settings: {required: true},
    email_types: {required: true},
  },
  data: function () {
    return {
        emails: [],
        showSaveFailed: false,
        showSaveSuccess: false
    }
  },
  created () {
    if(this.contact_id !== null){
        this.$http.get('/emails?contact_id=' + this.contact_id).
        then( results => { this.emails = results.data })
    }
  },
  methods: {
    newEmail: function(){
      var email = {
        id: null,
        email_type_id: null,
        email: null,
        contact_id: this.contact_id
      };
      this.emails.push(email);
    },
    removeEmail () {
      
    },
  },
  watch: {
  }
}

</script>