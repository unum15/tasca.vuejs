<template>
    <b-card title="Email" class="mb-2">
        <div v-for="email in emails" :key="email.id">
            <EditEmail
                :settings="settings"
                :email_types="email_types"
                :email="email"
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
    })
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