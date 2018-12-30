<template>
  <div>
  <b-container>
            <b-row>
            <b-col cols="8">
    <b-container>
        <b-row>
            <b-col>
                <b-form-group label="Contact Name">
                    <b-form-input
                      type="text"
                      @change="save"
                      v-model="my_contact.name"
                      required
                      :state="my_contact.name != null"
                      placeholder="John Smith">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col v-if="client_id">
                <b-form-group label="Contact Type">
                  <b-form-select
                    @change="save"
                    :options="contact_types"
                    value-field="id"
                    text-field="name"
                    required
                    :state="my_contact.contact_type_id != null"
                    v-model="my_contact.contact_type_id">
                  </b-form-select>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Activity Level">
                  <b-form-select
                    @change="save"
                    :options="activity_levels"
                    value-field="id"
                    text-field="name"
                    v-model="my_contact.activity_level_id">
                  </b-form-select>
                </b-form-group>
            </b-col>
            <b-col>
                <b-form-group label="Contact Method">
                  <b-form-select
                    @change="save"
                    :options="contact_methods"
                    value-field="id"
                    text-field="name"
                    v-model="my_contact.contact_method_id">
                  </b-form-select>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                
                  <EditEmails
                    :contact_id="my_contact.id"
                    :settings="settings"
                  ></EditEmails>
                
            </b-col>
            <b-col>
                <EditPhoneNumbers
                    :contact_id="my_contact.id"
                    :settings="settings"
                  ></EditPhoneNumbers>
            </b-col>
        </b-row>
        <b-row>
          <b-col>
              <b-form-group label="Properties">
                  <b-form-checkbox-group
                      @input="save"
                      v-model="my_contact.properties"
                      :options="properties"
                      value-field="id"
                      text-field="name"
                  >
                  </b-form-checkbox-group>
              </b-form-group>
          </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Notes">
                  <b-form-textarea
                    @input="save"
                    v-model="my_contact.notes"
                    :rows="3"
                    :max-rows="6"
                    placeholder="Notes about this contact.">
                  </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
                <b-button variant="danger" size="sm" @click="removeContact">Remove Contact</b-button>
                <b-button variant="danger" size="sm" @click="deleteContact" v-if="Number.isInteger(contact.id)">Delete Contact</b-button>
        </b-row>
    </b-container>
    </b-col>
    <b-col v-if="settings.help_show == 'true'">
      {{ settings.help_contact }}
    </b-col>
    </b-row>
    </b-container>
  </div>
</template>
<script>
import EditEmails from './EditEmails';
import EditPhoneNumbers from './EditPhoneNumbers';
export default {
  name: 'EditContact',
  components: {
    'EditEmails': EditEmails,
    'EditPhoneNumbers': EditPhoneNumbers
  },
  props: {
    client_id: {default: null},
    contact: {},
    contact_methods: {required: true},
    activity_levels: {required: true},
    properties: {required: true},
    settings: {required: true},
    contact_types: {default: []}
  },
  data: function () {
    return {
        my_contact: {},
    }
  },
  created () {
    var contact = this.contact;
    if(this.client_id !== null){
        contact.client_id = this.client_id;
        if(this.contact.pivot != null){
          contact.contact_type_id = this.contact.pivot.contact_type_id;
        }
    }
    this.my_contact = this.contact;
    var properties = [];
    this.my_contact.properties.forEach( p => {
      properties.push(p.id);
    })
    this.my_contact.properties = properties;
  },
  methods: {
    removeContact () {
      this.$emit('remove-contact', this.my_contact);
    },
    deleteContact () {
      this.$http.delete('/contact/' + this.my_contact.id);
      this.$emit('remove-contact', this.my_contact);
    },
    save () {
      if((this.my_contact.name === null) || (this.my_contact.contact_type_id === null)){
          return;
        }
        if(this.my_contact.id === null){
          this.$http.post('/contact',this.my_contact)
            .then((results) => {
              this.my_contact.id = results.data.id;
            })
        }
        else{
          this.$http.patch('/contact/' + this.my_contact.id,this.my_contact)
        }
    }
  },
  mounted () {
    if(this.my_contact.id === null){
      this.$emit('new-contact-mounted');
    }
  }
}

</script>