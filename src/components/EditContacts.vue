<template>
  <div>
    <b-tabs vertical pills v-model="contact_tab_index">
      <b-tab v-for="contact in contacts" :key="contact.id" :title="contact.name==''?'New Contact':contact.name">
        <EditContact
          :client_id="client_id"
          :contact_methods="contact_methods"
          :activity_levels="activity_levels"
          :settings="settings"
          :contact="contact"
          :email_types="email_types"
          :phone_number_types="phone_number_types"
          :contact_types="contact_types"
          ></EditContact>
      </b-tab>
    </b-tabs>
    <b-button variant="secondary" @click="newContact">Add New Contact</b-button>
    <b-button variant="secondary" v-b-modal.existing-contacts >Add Existing Contact</b-button>
    <b-modal id="existing-contacts" title="Select Contact" @ok="existingContact">
      <b-form-group label="New Contact">
          <b-form-select
            :options="all_contacts"
            value-field="id"
            text-field="name"
            v-model="existing_contact_id">
          </b-form-select>
        </b-form-group>
    </b-modal>
  </div>
</template>
<script>
import EditContact from './EditContact';
export default {
  name: 'EditContacts',
  components: {
    'EditContact': EditContact,
  },
  props: {
    client_id: {required: true},
    contact_methods: {required: true},
    activity_levels: {required: true},
    settings: {required: true}
  },
  data () {
    return {
      contacts: [],
      all_contacts: [],
      email_types: [],
      phone_number_types: [],
      contact_types: [],
      existing_contact_id: null,
      contact_tab_index: 0
    }
  },
  created () {
    this.$http.get('/contacts').then(response => {
      this.all_contacts = response.data
    })
    this.$http.get('/email_types').then(response => {
      this.email_types = response.data
    })
    this.$http.get('/phone_number_types').then(response => {
      this.phone_number_types = response.data
    })
    this.$http.get('/contact_types').then(response => {
      this.contact_types = response.data
    })
    this.$http.get('/contacts?client_id=' + this.client_id).then(response => {
      this.contacts = response.data
    })
  },
  methods: {
    newContact () {
      var contact = {
        id: null,
        name: null,
        active_level_id: null,
        contact_method_id: null,
        emails: [],
        phone_numbers: [],
        notes: null
      };
      this.contacts.push(contact);
    },
    existingContact () {
      var id = this.existing_contact_id;
      var contacts = this.all_contacts.filter(function(contacts) {
        return contacts.id == id;
      });
      var contact = contacts[0];
      contact.emails = [];
      contact.phone_numbers = [];
      contact.key = contact.id;
      this.contacts.push(contact);
    },
    removeContact: function(contact){
      this.contacts = this.contacts.filter(c => c !== contact);
    },
  },
  watch: {
  }
}

</script>