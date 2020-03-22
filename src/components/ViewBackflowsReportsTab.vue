<template>
  <div>
    <b-table
      small
      striped
      hover
      :items="backflow_test_reports"
      :fields="fields"
    >
      <template v-slot:cell(report_date)="row">
        <a :href="'/backflow_test_report/' + row.item.id"> {{ row.value }} </a>
      </template>
      <template v-slot:cell(test_1)="row">
        <span v-if="row.item.backflow_tests.length">
          {{ row.item.backflow_tests[row.item.backflow_tests.length-1].reading_1 }}
        </span>
      </template>
      <template v-slot:cell(test_2)="row">
        <span v-if="row.item.backflow_tests.length">
          {{ row.item.backflow_tests[row.item.backflow_tests.length-1].reading_2 }}
        </span>
      </template>
      <template v-slot:cell(repairs)="row">
        <span :id="'repairs-' + row.item.id">
          {{ row.item.backflow_repairs.length ? 'Yes' : 'No' }}
        </span>
        <b-popover :target="'repairs-' + row.item.id" title="Repairs" triggers="hover" v-if="row.item.backflow_repairs.length">
          <ul>
            <li v-for="repair in row.item.backflow_repairs" :key="repair.id">
              {{ repair.backflow_valve_part.name }}
            </li>
          </ul>
        </b-popover>
      </template>
      <template v-slot:cell(tester)="row">
        <span v-if="row.item.backflow_tests.length && row.item.backflow_tests[row.item.backflow_tests.length-1].contact">
          {{ row.item.backflow_tests[row.item.backflow_tests.length-1].contact.name }}
        </span>
      </template>
    </b-table>
  </div>
</template>
<script>
export default {
  name: 'ViewBackflowsReportsTab',
  components: {
  },
  props: {
    backflow_test_reports: {required: true}
  },
  data() {
    return {
      fields: [
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
  },
  methods: {
    rowClicked(items){
      items._showDetails = !items._showDetails;
    }
  }
}

</script>