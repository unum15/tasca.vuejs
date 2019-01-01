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
        <b-tabs v-model="tab_index">
          <b-tab title="General">
            <b-container :fluid="false">
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
                  <b-form-group label="Main Mailing Property">
                    <b-form-select
                      @change="save"
                      :options="client.properties"
                      value-field="id"
                      text-field="name"
                      v-model="client.main_mailing_property_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Billing Contact">
                    <b-form-select
                      @change="save"
                      :options="client.contacts"
                      value-field="id"
                      text-field="name"
                      v-model="client.billing_contact_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
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
            </b-container>
            </b-col>
            <b-col v-if="settings.help_show == 'true'">
              {{ settings.help_client }}
            </b-col>
            </b-row>
            </b-container>
          </b-tab>
          <b-tab v-if="client.id" title="Contacts">
            <EditContacts
              :contacts="client.contacts"
              :properties="client.properties"
              :client_id="client.id"
              :contact_methods="contact_methods"
              :activity_levels="activity_levels"
              :settings="settings"
            >
            </EditContacts>
          </b-tab>
          <b-tab v-if="client.id" title="Properties">
            <EditProperties :properties="client.properties" :contacts="client.contacts" :client_id="client.id" :contact_methods="contact_methods" :activity_levels="activity_levels" :settings="settings"></EditProperties>
          </b-tab>
          <b-tab v-if="client.id" title="Projects">
            <EditProjects :client_id="client.id" :contacts="client.contacts" :properties="client.properties" :settings="settings"></EditProjects>
          </b-tab>
        </b-tabs>
    </main>
  </div>
</template>
<script>
import EditContacts from './EditContacts'
import EditProperties from './EditProperties'
import EditProjects from './EditProjects'
import TopMenu from './TopMenu'
export default {
  name: 'EditClient',
  components: {
    'TopMenu': TopMenu,
    'EditContacts': EditContacts,
    'EditProperties': EditProperties,
    'EditProjects': EditProjects
  },
  props: {
    client_id: {default: null},
    contact_id: {default: null},
    property_id: {default: null},
    project_id: {default: null},
    order_id: {default: null},
    task_id: {default: null},
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
      }
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
    if (this.client_id !== null) {
      this.$http.get('/client/' + this.client_id).then(response => {
        this.client = response.data
      })
    }    
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
    if((this.client.id) && (this.order_id != null)){
      this.tab_index = 3;
      this.first_update = false;
    }
  }
}

</script>