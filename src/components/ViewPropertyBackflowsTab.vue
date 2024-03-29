<template>
  <div>
    <b-tabs>
      <b-tab title="Backflow Assemblies">
          <b-table
              small
              striped
              hover
              :items="backflow_assemblies"
              :fields="fields"
              selectable
              @row-clicked="rowClicked"
          >
              <template v-slot:cell(placement)="data">
                <span v-b-popover.hover.top="(data.item.backflow_water_system ? data.item.backflow_water_system.name : '') + (data.item.contact ? '-' + data.item.contact.name : '')">
                  {{ data.value }}
                </span>
              </template>
              <template v-slot:cell(backflow_manufacturer_id)="data">
                <span v-b-popover.hover.top="data.item.created_at + '-' + data.item.updated_at">
                  {{ data.value }}
                </span>
              </template>
              <template v-slot:cell(serial_number)="data">
                  <a :href="'/backflow_assembly/' + data.item.id"> {{ data.value ?  data.value : data.item.id }} </a>
              </template>
              <template v-slot:cell(include)="data">
                <b-form-checkbox @change="include(data.item)" v-if="data.item.backflow_test_reports.length" />
              </template>
              <template v-slot:row-details="data">
                <ViewBackflowsReportsTab v-if="data.item.backflow_test_reports.length && !data.item.show_all_reports" :backflow_test_reports="[data.item.backflow_test_reports[0]]">
                </ViewBackflowsReportsTab>
                <ViewBackflowsReportsTab v-if="data.item.backflow_test_reports.length && data.item.show_all_reports" :backflow_test_reports="data.item.backflow_test_reports">
                </ViewBackflowsReportsTab>
                <img src="@/assets/expand.png" v-if="data.item.backflow_test_reports.length && !data.item.show_all_reports" v-b-tooltip.hover title="Show All Reports" @click.stop="showReports(data.item.id)" fluid alt="+" style="width:20px;" />
                <img src="@/assets/collapse.png" v-if="data.item.backflow_test_reports.length && data.item.show_all_reports" v-b-tooltip.hover title="Show All Reports" @click.stop="hideReports(data.item.id)" fluid alt="x" style="width:20px;" />
              </template>
          </b-table>
      </b-tab>
      <b-tab title="Accounts">
        <b-tabs vertical pills v-model="current_tab" :key="accounts.length">
          <b-tab
            v-for="(account, index) in accounts"
            :key="account.id"
            :active="accountIsActive(index)"
            >
            <template slot="title" style="text-align:left">
              <div style="text-align:left">
                {{ account.number }}
              </div>
            </template>
            <b-container>
              <b-row>
                <b-col>
                  Number
                </b-col>
                <b-col>
                  <b-input
                    type="text"
                    v-model="account.number"
                    @change="saveAccount(account)"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  Name
                </b-col>
                <b-col>
                  <b-input
                    type="text"
                    v-model="account.name"
                    @change="saveAccount(account)"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  Address
                </b-col>
                <b-col>
                  <b-input
                    type="text"
                    v-model="account.address"
                    @change="saveAccount(account)"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  City
                </b-col>
                <b-col>
                  <b-input
                    type="text"
                    v-model="account.city"
                    @change="saveAccount(account)"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  Access Code
                </b-col>
                <b-col>
                  <b-input
                    type="text"
                    v-model="account.access_code"
                    @change="saveAccount(account)"
                  />
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  Notes
                </b-col>
                <b-col>
                  <b-input
                    type="text"
                    v-model="account.notes"
                    @change="saveAccount(account)"
                  />
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <img src="@/assets/add.png" v-b-tooltip.hover title="Add Account" @click.stop="addAccount()" fluid alt="x" style="width:20px;" />
        </b-tabs>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import ViewBackflowsReportsTab from './ViewBackflowsReportsTab';
export default {
  name: 'ViewPropertyBackflowsTab',
  components: {
    'ViewBackflowsReportsTab': ViewBackflowsReportsTab
  },
  props: {
    property_id: {required: true}
  },
  data() {
    return {
        backflow_assemblies: [],
        accounts: [],
        current_tab: 0,
        change_tab: false,
        account_change_tab: false,
        fields: [
          {
              key: 'use',
              label: 'Use',
              sortable: true
          },
          {
              key: 'placement',
              label: 'Placement',
              sortable: true
          },
          {
              key: 'backflow_type.name',
              label: 'Type',
              sortable: true
          },
          {
              key: 'backflow_manufacturer.name',
              label: 'Manufacturer',
              sortable: true
          },
          {
              key: 'backflow_size.name',
              label: 'Size',
              sortable: true
          },
          {
              key: 'backflow_model.name',
              label: 'Model',
              sortable: true
          },
          {
              key: 'serial_number',
              label: 'Serial',
              sortable: true
          },
          {
              key: 'notes',
              label: 'Notes',
              sortable: true
          },
          {
              key: 'include',
              label: 'Include',
              sortable: false
          }
      ],
      test_fields: [
          {
              key: 'report_date',
              label: 'Report Date',
              sortable: true
          },
          {
              key: 'submitted_date',
              label: 'Submit Date',
              sortable: true
          },
          {
              key: 'test_1',
              label: 'Test #1',
              sortable: false
          },
          {
              key: 'test_2',
              label: 'Test #2',
              sortable: false
          },
          {
              key: 'repairs',
              label: 'Repairs',
              sortable: false
          },
          {
              key: 'tester',
              label: 'Tester',
              sortable: true
          }
      ]
    }
  },
  created() {
    this.$http.get('/backflow_assemblies?includes=backflow_manufacturer,backflow_type,backflow_size,backflow_model,backflow_water_system,contact,backflow_tests,backflow_test_reports,backflow_test_reports.backflow_tests,backflow_test_reports.backflow_tests.contact,backflow_test_reports.backflow_repairs,backflow_test_reports.backflow_repairs.backflow_valve_part&property_id=' + this.property_id).then(response => {
      this.backflow_assemblies = response.data.data
    });
    
    this.$http.get('/property_accounts?property_id='+this.property_id).then(response => {
      this.accounts = response.data.data;
    });
  },
  methods: {
    isActive(index) {
      if((this.change_tab)&&(index == this.properties.length -1)){
        return true;
      }
      return false;
    },
    accountIsActive(index) {
      if((this.account_change_tab)&&(index == this.accounts.length -1)){
        return true;
      }
      return false;
    },
    rowClicked(item){
      item._showDetails = !item._showDetails;
    },
    showReports(id){
      let a = this.backflow_assemblies.filter(a => (a.id == id));
      a[0].show_all_reports = true;
      let b = this.backflow_assemblies;
      this.backflow_assemblies = [];
      this.backflow_assemblies = b;
    },
    hideReports(id){
      let a = this.backflow_assemblies.filter(a => (a.id == id));
      a[0].show_all_reports = false;
      let b = this.backflow_assemblies;
      this.backflow_assemblies = [];
      this.backflow_assemblies = b;
    },
    include(backflow){
      this.$emit('include-backflow',backflow);
    },
    addAccount(){
      this.accounts.push({id: null, property_id: this.property_id});
      this.account_change_tab = true;
    },
    saveAccount(account){
      if(account.number === null){
        return;
      }
      if(account.id === null){
        this.$http.post('/property_account',account)
          .then((results) => {
            account.id = results.data.data.id;
          });
      }
      else{
        this.$http.patch('/property_account/' + account.id,account)
      }
    }
  },
}

</script>
