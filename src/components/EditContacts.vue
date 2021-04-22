<template>
  <div>
    <b-tabs vertical pills v-model="current_tab" :key="my_contacts.length">
      <b-tab
        v-for="(contact, index) in my_contacts"
        :key="contact.id"
        :active="isActive(index)"
      >
        <template slot="title" style="text-align:left">
          <div style="text-align:left">
            {{ contact.name===null?'New Contact':contact.name }}
          </div>
        </template>
        <EditContact
          :client_id="client_id"
          :contact_methods="contact_methods"
          :activity_levels="activity_levels"
          :properties="properties"
          :settings="settings"
          :contact="contact"
          :contact_types="contact_types"
          :roles="roles"
          :crews="crews"
          @remove-contact="removeContact"
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
    properties: {required: true},
    settings: {required: true},
    contacts: {required: true}
  },
  data () {
    return {
      my_contacts: [],
      all_contacts: [],
      contact_types: [],
      roles: [],
      existing_contact_id: null,
      current_tab: 0,
      change_tab: false,
      crews: []
    }
  },
  created () {
    this.$http.get('/contacts').then(response => {
      this.all_contacts = response.data;
    });
    this.$http.get('/contact_types').then(response => {
      this.contact_types = response.data;
    });
    this.$http.get('/roles').then(response => {
      this.roles = response.data.data;
    });
    this.$http.get('/crews').then(response => {
      this.crews = response.data;
    });
    this.my_contacts = this.contacts;
  },
  methods: {
    newContact () {
      var contact = {
        id: null,
        client_id: this.client_id,
        contact_type_id: null,
        name: null,
        activity_level_id: 1,
        contact_method_id: null,
        emails: [],
        phone_numbers: [],
        notes: null,
        properties: []
      };
      this.change_tab = true;
      this.my_contacts.push(contact);
      
    },
    existingContact () {
      var id = this.existing_contact_id;
      var contacts = this.all_contacts.filter(contacts => contacts.id == id);
      var contact = contacts[0];
      contact.emails = [];
      contact.phone_numbers = [];
      contact.key = contact.id;
      contact.client_id = this.client_id;
      this.my_contacts.push(contact);
    },
    removeContact (contact) {
      this.my_contacts = this.my_contacts.filter(c => c.id !== contact.id);
    },
    isActive (index) {
      if((this.change_tab)&&(index == this.contacts.length -1)){
        return true
      }
      return false
    },
  },
}

</script>