<template>
    <b-card title="Email" class="mb-2">
        <div v-for="email in emails" :key="email.id">
            <EditEmail
                :settings="settings"
                :email_types="email_types"
                :email="email"
                @remove-email="removeEmail"
                :contact_id="contact_id"
            >
            </EditEmail>
        </div>
        <b-button variant="secondary" @click="newEmail()">Add Email</b-button>
    </b-card>
</template>
<script>
import EditEmail from './EditEmail';
export default {
  name: 'EditEmails',
  components: {
    'EditEmail': EditEmail
  },
  props: {
    contact_id: {default: null},
    settings: {required: true}
  },
  data() {
    return {
        emails: [],
    }
  },
  created() {
    this.$http.get('/email_types').then(response => {
        this.email_types = response.data
        if(this.contact_id !== null){
          this.$http.get('/emails?contact_id=' + this.contact_id).
          then( results => { this.emails = results.data })
        }
        else{
          this.newEmail()
        }
    })
  },
  methods: {
    newEmail(){
      var email = {
        id: null,
        email_type_id: null,
        email: null,
        contact_id: this.contact_id
      };
      this.emails.push(email);
    },
    removeEmail (email) {
      this.emails = this.emails.filter(e => e.id !== email.id);
    },
  },
  watch: {
    contact_id(){
      if(this.contact_id === null){
        this.emails = [];
        this.newEmail();
      }
    }
  }
}

</script>