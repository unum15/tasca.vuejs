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
        <b-tabs>
          <b-tab title="General">
            <b-container>
              <b-row>
                <b-col>
                  <b-form-group label="Client Type">
                    <b-form-select
                      :options="client_types"
                      :disabled="client_types_loading"
                      value-field="id"
                      text-field="name"
                      required
                      v-model="client.client_type_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Client Name">
                    <b-form-input
                      type="text"
                      v-model="client.name"
                      required
                      placeholder="Smith Household">
                    </b-form-input>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Activity Level">
                    <b-form-select
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
                  <b-form-group label="Billing Property">
                    <b-form-select
                      :options="client.properties"
                      value-field="id"
                      text-field="name"
                      v-model="client.billing_property_id">
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Billing Contact">
                    <b-form-select
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
                    v-model="client.notes"
                    :rows="3"
                    :max-rows="6"
                    placeholder="Notes about this client.">
                  </b-form-textarea>
                </b-form-group>
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <b-tab v-if="client.id" title="Contacts">
            <EditContacts :client_id="client.id" :contact_methods="contact_methods" :activity_levels="activity_levels" :settings="settings"></EditContacts>
          </b-tab>
          <b-tab v-if="client.id" title="Properties">
            <EditProperties :client_id="client.id" :contact_methods="contact_methods" :activity_levels="activity_levels" :settings="settings"></EditProperties>
          </b-tab>
        </b-tabs>
    </main>
  </div>
</template>
<script>
import EditContacts from './EditContacts'
import EditProperties from './EditProperties'
import TopMenu from './TopMenu'
export default {
  name: 'EditClient',
  components: {
    'TopMenu': TopMenu,
    'EditContacts': EditContacts,
    'EditProperties': EditProperties,
  },
  props: {
    client_id: {default: null}
  },
  data () {
    return {
      client_types: [],
      contact_methods: [],
      activity_levels: [],
      contact_methods_loading: true,
      activity_levels_loading: true,
      client_types_loading: true,
      settings: {},
      showSaveFailed: false,
      showSaveSuccess: false,
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
      console.log('/client/' + this.client_id);
      this.$http.get('/client/' + this.client_id).then(response => {
        this.client = response.data
        console.log(this.client.name)
      })
    }
  },
  methods: {
  },
  watch: {
    client:{
      handler:function(){
        if(this.client.name === null){
          return;
        }
        if(this.client.id === null){
          console.log('post');
          this.$http.post('/client',this.client)
            .then((results) => {
              this.showSaveFailed = false;
              this.showSaveSuccess = true;
              this.client.id = results.data.id;
            })
            .catch(error => {
              this.showSaveFailed = true;
              this.showSaveSuccess = false;
            });
        }
        else{
          console.log('patch');
          this.$http.patch('/client/' + this.client.id,this.client)
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