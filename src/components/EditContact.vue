<template>
  <div>
    <b-alert variant="danger"
             dismissible
             :show="showSaveFailed"
             @dismissed="showSaveFailed=false">
      Save Failed!
    </b-alert>
    <b-alert variant="success"
             dismissible
             :show="showSaveSuccess"
             @dismissed="showSaveSuccess=false">
      Saved!
    </b-alert>
    <b-container>
        <b-row>
            <b-col>
                <b-form-group label="Contact Name">
                    <b-form-input
                      type="text"
                      v-model="my_contact.name"
                      required
                      placeholder="John Smith">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col v-if="client_id">
                <b-form-group label="Contact Type">
                  <b-form-select
                    :options="contact_types"
                    value-field="id"
                    text-field="name"
                    v-model="my_contact.contact_type_id">
                  </b-form-select>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-form-group label="Activity Level">
                  <b-form-select
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
                <b-card title="Email" class="mb-2">
                  <div v-for="email in contact.emails" :key="email.id" class="row">
                    <div class="col">
                      <b-form-group label="Email Type">
                        <b-form-select
                          :options="email_types"
                          value-field="id"
                          text-field="name"
                          v-model="email.email_type_id">
                        </b-form-select>
                      </b-form-group>
                    </div>
                    <div class="col">
                      <b-form-group label="Email">
                        <b-form-input
                          type="text"
                          v-model="email.email"
                          required
                          placeholder="admin@truecomputing.biz">
                        </b-form-input>
                      </b-form-group>
                    </div>
                   </div>
                  <b-button variant="secondary" @click="newEmail(contact)">Add Email</b-button>
                </b-card>
            </b-col>
            <b-col>
                <b-card title="Phone Number" class="mb-2">
                <div v-for="phone_number in contact.phone_numbers" :key="phone_number.id" class="row">
                    <div class="col">
                      <b-form-group label="Phone Number Type">
                        <b-form-select
                          :options="phone_number_types"
                          value-field="id"
                          text-field="name"
                          v-model="phone_number.phone_number_type_id">
                        </b-form-select>
                      </b-form-group>
                    </div>
                    <div class="col">
                      <b-form-group label="Phone Number">
                        <b-form-input
                          type="text"
                          v-model="phone_number.phone_number"
                          required
                          placeholder="555 555-5555">
                        </b-form-input>
                      </b-form-group>
                    </div>
                   </div>
                  <b-button variant="secondary" @click="newPhoneNumber(contact)">Add Phone Number</b-button>
                </b-card>
            </b-col>
        </b-row>
            <b-col>
                <b-form-group label="Notes">
                  <b-form-textarea
                    v-model="my_contact.notes"
                    :rows="3"
                    :max-rows="6"
                    placeholder="Notes about this contact.">
                  </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
                <b-button variant="danger" size="sm" @click="removeContact(contact)">Remove Contact</b-button>
                <b-button variant="danger" size="sm" v-if="Number.isInteger(contact.id)">Delete Contact</b-button>
        </b-row>
    </b-container>
  </div>
</template>
<script>
export default {
  name: 'EditContact',
  components: {
  },
  props: {
    client_id: {default: null},
    contact: {},
    contact_methods: {required: true},
    activity_levels: {required: true},
    settings: {required: true},
    email_types: {required: true},
    phone_number_types: {required: true},
    contact_types: {default: []}
  },
  data: function () {
    return {
        my_contact: {},
        showSaveFailed: false,
        showSaveSuccess: false
    }
  },
  created () {
    var contact = this.contact;
    if(this.client_id !== null){
        contact.client_id = this.client_id;
        contact.contact_type_id = this.contact.clients[0].pivot.contact_type_id;
    }
    this.my_contact = this.contact;
  },
  methods: {
    newEmail: function(contact){
      var email = {
        email_type_id : null,
        email : null
      };
      contact.emails.push(email);
    },
    newPhoneNumber: function(contact){
      var phone_number = {
        phone_number_type_id : null,
        phone_number : null
      };
      contact.phone_numbers.push(phone_number);
    },
    removeContact () {
      
    },
  },
  watch: {
    my_contact:{
      handler:function(){
        if(this.my_contact.name === null){
          return;
        }
        if(this.my_contact.id === null){
          console.log('post contact');
          this.$http.post('/contact',this.my_contact)
            .then((results) => {
              this.showSaveFailed = false;
              this.showSaveSuccess = true;
              this.my_contact.id = results.data.id;
            })
            .catch(error => {
              this.showSaveFailed = true;
              this.showSaveSuccess = false;
            });
        }
        else{
          console.log('patch contact');
          this.$http.patch('/contact/' + this.my_contact.id,this.my_contact)
            .catch(error => {
              this.showSaveSuccess = false;
              this.showSaveFailed = true;
            });
        }
      },
      deep: true
    }
  }
}

</script>