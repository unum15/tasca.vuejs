<template>
  <div>
  <b-tabs>
    <b-tab title="General">
      <b-container fluid>
                <b-row>
                <b-col cols="8">
        <b-container fluid>
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
                        :state="my_contact.contact_method_id != null"
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
              <b-button variant="danger" size="sm" @click="deleteContact" v-if="Number.isInteger(my_contact.id)">Delete Contact</b-button>
            </b-row>
        </b-container>
        </b-col>
        <b-col style="text-align:left;" v-if="settings.help_show == 'true'">
          {{ settings.help_contact }}
        </b-col>
        </b-row>
        </b-container>
      </b-tab>
      <b-tab title="Account">
        <b-container v-if="my_contact.login">
          <b-row>
            <b-col>
              <b-form-group label="Login">
                <b-form-input
                  type="text"
                  @change="save"
                  v-model="my_contact.login"
                  >
                </b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-form-checkbox-group
              v-model="selected_roles"
              :options="roles"
              value-field="id"
              text-field="display_name"
              @change="saveRoles"
              >
            </b-form-checkbox-group>
          </b-row>
          <b-row>
              <b-button variant="danger" size="sm" @click="resetPassword">Reset Password</b-button>
            </b-row>
        </b-container>
        <div v-else>
          <b-button variant="success" @click="showCreateAccount">Create Account</b-button>
            <b-modal ref="new-account-modal" title="New Account"  @ok="createAccount">
              <b-container>
                <b-row>
                  <b-col>
                    <b-form-group label="Login">
                      <b-form-select
                        :options="new_account.emails"
                        value-field="email"
                        text-field="email"
                        v-model="new_account.login"
                        >
                      </b-form-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-form-checkbox-group
                    v-model="new_account.roles"
                    :options="roles"
                    value-field="id"
                    text-field="display_name"
                    >
                  </b-form-checkbox-group>
                </b-row>
              </b-container>
            </b-modal>
        </div>
      </b-tab>
    </b-tabs>
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
    contact_types: {default: []},
    roles: {required: true}
  },
  data: function () {
    return {
        my_contact: {},
        selected_roles: [],
        new_account: { login: null, roles: [], emails: []}
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
    });
    this.my_contact.properties = properties;
    this.my_contact.roles.forEach( r => {
      this.selected_roles.push(r.id);
    });
  },
  methods: {
    removeContact () {
      this.$emit('remove-contact', this.my_contact);
    },
    deleteContact () {
      this.$http.delete('/contact/' + this.my_contact.id);
      this.$emit('remove-contact', this.my_contact);
    },
    save() {
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
    },
    saveRoles() {
        this.$http.put('/contact/' + this.my_contact.id + '/roles', {roles: this.selected_roles})
    },
    resetPassword(){
      this.$http.post('/auth/password/email', {'login' : this.contact.login}).then((response) => {
        alert(response.data.message);
      });
    },
    showCreateAccount(){
      this.$http.get('/emails?contact_id=' + this.my_contact.id).then( results => {
        if(!results.data.length){
          alert('Please add contac email first.');
          return;
        }
        this.new_account.emails = results.data
        this.new_account.login = results.data[0].email;
      });
      this.$refs['new-account-modal'].show();
    },
    createAccount(e){
      e.preventDefault();
      this.$http.post('/contact/' + this.my_contact.id + '/account',this.new_account).then(() => {
        this.my_contact.login = this.new_account.login;
        this.$refs['new-account-modal'].hide();
      });
    },
  },
  mounted () {
    if(this.my_contact.id === null){
      this.$emit('new-contact-mounted');
    }
  }
}

</script>