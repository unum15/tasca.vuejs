<template>
  <div>
    <b-tabs vertical pills v-model="current_tab">
      <b-tab v-for="contact in my_contacts" :key="contact.id" :title="contact.name===null?'New Contact':contact.name">
        <EditContact
          :client_id="client_id"
          :contact_methods="contact_methods"
          :activity_levels="activity_levels"
          :settings="settings"
          :contact="contact"
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
    settings: {required: true},
    contacts: {required: true}
  },
  data () {
    return {
      my_contacts: [],
      all_contacts: [],
      contact_types: [],
      existing_contact_id: null,
      current_tab: 0
    }
  },
  created () {
    this.$http.get('/contacts').then(response => {
      this.all_contacts = response.data
    })
    this.$http.get('/contact_types').then(response => {
      this.contact_types = response.data
    })
    this.my_contacts = this.contacts;
  },
  methods: {
    newContact () {
      var contact = {
        id: null,
        client_id: this.client_id,
        contact_type_id: null,
        name: null,
        active_level_id: null,
        contact_method_id: null,
        emails: [],
        phone_numbers: [],
        notes: null
      };
      this.my_contacts.push(contact);
      this.current_tab = this.my_contacts.length;
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
      this.my_contacts.push(contact);
    },
    removeContact: function(contact){
      this.my_contacts = this.my_contacts.filter(c => c !== contact);
    },
  },
  updated: function() {
    if((this.my_contacts.length>0) && (this.my_contacts[this.my_contacts.length-1].name === null)){
      this.current_tab = this.my_contacts.length-1;
    }
  },
  watch: {
  }
}

</script>