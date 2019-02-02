<template>
  <div>
    <TopMenu></TopMenu>
    <b-alert variant="danger"
             dismissible
             max="5"
             @dismissed="showSaveFailed=false">
      Save Failed!
    </b-alert>
    <b-alert variant="success"
             dismissible
             :show="showSaveSuccess"
             @dismissed="showSaveSuccess=false">
      Saved!
    </b-alert>
    <header>
      {{ client.name }}
    </header>
    <main>
            <b-container :fluid="true">
            <b-row>
            <b-col cols="8">
            <b-container>
              <b-row>
                <b-col>
                  <b-form-group label="Client Type">
                    <b-form-select
                      @change="save"
                      :options="client_types"
                      :disabled="client_types_loading"
                      value-field="id"
                      text-field="name"
                      :state="client.client_type_id != null"
                      required
                      v-model="client.client_type_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Client Name">
                    <b-form-input
                      type="text"
                      @change="save"
                      v-model="client.name"
                      :state="client.name != null"
                      required
                      placeholder="Smith Household"
                      >
                    </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Activity Level">
                    <b-form-select
                      @change="save"
                      :options="activity_levels"
                      :disabled="activity_levels_loading"
                      value-field="id"
                      text-field="name"
                      v-model="client.activity_level_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Contact Method">
                    <b-form-select
                      @change="save"
                      :options="contact_methods"
                      :disabled="contact_methods_loading"
                      value-field="id"
                      text-field="name"
                      v-model="client.contact_method_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <b-form-group label="Referred By">
                    <b-form-input
                      @change="save"
                      type="text"
                      v-model="client.referred_by"
                      placeholder="John Doe">
                    </b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                <b-form-group label="Notes">
                  <b-form-textarea
                    @input="save"
                    v-model="client.notes"
                    :rows="3"
                    :max-rows="6"
                    placeholder="Notes about this client.">
                  </b-form-textarea>
                </b-form-group>
                </b-col>
              </b-row>
              <b-row>
            <b-col>
                <b-form-group label="Contact Name">
                    <b-form-input
                      type="text"
                      @change="save"
                      v-model="contact.name"
                      required
                      :state="contact.name != null"
                      placeholder="John Smith">
                    </b-form-input>
                </b-form-group>
            </b-col>
            <b-col v-if="client.client_id">
                <b-form-group label="Contact Type">
                  <b-form-select
                    @change="save"
                    :options="contact_types"
                    value-field="id"
                    text-field="name"
                    required
                    :state="contact.contact_type_id != null"
                    v-model="contact.contact_type_id">
                  </b-form-select>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row v-if='contact.contact_id'>
            <b-col>
                  <EditEmail
                    :contact_id="contact.id"
                    :settings="settings"
                  ></EditEmail>
                
            </b-col>
            <b-col>
                <EditPhoneNumber
                    :contact_id="contact.id"
                    :settings="settings"
                  ></EditPhoneNumber>
            </b-col>
        </b-row>
            </b-container>
            </b-col>
            <b-col v-if="settings.help_show == 'true'">
              {{ settings.help_client }}
            </b-col>
            </b-row>
            
            </b-container>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
import EditEmail from './EditEmail'
import EditPhoneNumber from './EditPhoneNumber'
export default {
  name: 'QuickClient',
  components: {
    'TopMenu': TopMenu,
    'EditEmail': EditEmail,
    'EditPhoneNumber': EditPhoneNumber
  },
  data () {
    return {
      client_types: [],
      contact_methods: [],
      activity_levels: [],
      contact_methods_loading: true,
      activity_levels_loading: true,
      client_types_loading: true,
      tab_index: 0,
      settings: {},
      showSaveFailed: false,
      showSaveSuccess: false,
      contacts: [],
      properties: [],
      first_update: true,
      client: {
        id: null,
        client_type_id: null,
        name: null,
        contact_method_id: null,
        billing_property_id: null,
        billing_contact_id: null,
        referred_by: '',
        notes: '',
        contacts: [],
        properties: []
      },
      contact: {}
    }
  },
  created () {
    this.$http.get('/settings').then(response => {
      this.settings = response.data
      this.client.client_type_id = this.settings.default_client_type_id
      this.client.activity_level_id = this.settings.default_activity_level_id
      this.client.contact_method_id = this.settings.default_contact_method_id
    })
    this.$http.get('/client_types').then(response => {
      this.client_types = response.data
      this.client_types_loading = false
    })
    this.$http.get('/contact_methods').then(response => {
      this.contact_methods = response.data
      this.contact_methods_loading = false
    })
    this.$http.get('/activity_levels').then(response => {
      this.activity_levels = response.data
      this.activity_levels_loading = false
    })
  },
  methods: {
    save () {
      if(this.client.name === null){
        return;
      }
      if(this.client.id === null){
        this.$http.post('/client',this.client)
          .then((results) => {
            this.client.id = results.data.id;
          })
      }
      else{
        this.$http.patch('/client/' + this.client.id,this.client)
      }
    }
  },
  updated() {
    if(!this.first_update){
      return;
    }
  }
}

</script>