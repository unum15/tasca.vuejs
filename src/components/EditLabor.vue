<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        Labor Assignments and Activities
    </header>
    <main>
        <b-container style="text-align:left;">
            <b-row>
              <b-col md="3" offset-md="4">
                <b-button @click="showAddAssignment">Add Assignment</b-button>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="3" offset-md="4">
                <Treeselect :options="assignments" :normalizer="treeNormalizer" v-model="assignment_id" @input="assignmentSelected"/>
              </b-col>
              <b-col md="3">
                <b-button @click="editAssignment" v-if="assignment_id">Edit</b-button>
              </b-col>
            </b-row>
            <b-row v-if="assignment_id">
              <b-col style="text-align:center">
                <b-form-group label="Labor Type">
                        <b-form-checkbox-group
                          @change="saveLaborTypes();"
                          :options="labor_types"
                          value-field="id"
                          text-field="name"
                          v-model="selected_labor_types"
                        >
                      </b-form-checkbox-group>
                  </b-form-group>
              </b-col>
            </b-row>
            <div v-for="type in selected_labor_types" :key="type">
              <b-row v-if="typeAssigned(type)">
                <b-col style="text-align:center">
                  <b-form-group :label="typeName(type) + ' Project'">
                          <b-form-select
                            @change="getOverheadOrders(type);"
                            :options="overhead_projects"
                            value-field="id"
                            text-field="name"
                            v-model="type_project[type]"
                          >
                        </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col style="text-align:center">
                  <b-form-group :label="typeName(type) + ' Order'">
                          <b-form-select
                            @change="saveLaborTypes"
                            :options="type_orders[type]"
                            value-field="id"
                            text-field="name"
                            v-model="type_order[type]"
                          >
                        </b-form-select>
                    </b-form-group>
                </b-col>
              </b-row>
            </div>
            <b-form-checkbox-group v-model="selected_activities" v-if="assignment_id" @input="saveActivities">
              <b-row v-for="activity in activities" :key="activity.id">
                <b-col  md="3" offset-md="4">
                   <b-form-checkbox :value="activity.id"><b-button variant="link" @click="editActivity(activity.id,activity.name,activity.parent_id)">{{ activity.name }}</b-button></b-form-checkbox>
                  <b-container>
                    <b-row v-for="subactivity in activity.children" :key="subactivity.id">
                      <b-col md="3" offset-md="5">
                        <b-form-checkbox :value="subactivity.id"><b-button variant="link" @click="editActivity(subactivity.id,subactivity.name,subactivity.parent_id)">{{ subactivity.name }}</b-button></b-form-checkbox>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </b-row>
            </b-form-checkbox-group>
            <b-row>
              <b-col md="3" offset-md="4">
                <b-button @click="showAddActivity()">Add Activity</b-button>
              </b-col>
            </b-row>
        </b-container>
    </main>
    <b-modal ref="modal-assignment" @ok="addAssignment" title="New Assignment">
      <b-container fluid>
        <b-row>
          <b-col>
            <b-form-group label="New Assignment">
              <b-form-input type="text" v-model="new_assignment.name" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Parent Assignment">
              <b-form-select
                  :options="assignments"
                  value-field="id"
                  text-field="name"
                  v-model="new_assignment.parent_id"
              >
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
    <b-modal ref="modal-activity" @ok="addActivity" title="New Activity">
      <b-container fluid>
        <b-row>
          <b-col>
            <b-form-group label="New Activity">
              <b-form-input type="text" v-model="new_activity.name" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Parent Activity">
              <b-form-select
                  :options="activities"
                  value-field="id"
                  text-field="name"
                  v-model="new_activity.parent_id"
              >
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { mapState } from 'vuex';
export default {
  name: 'EditLabor',
  components: {
    TopMenu,
    Treeselect
  },
  data () {
    return {
      new_assignment: {id: null, name: null, parent_id: null},
      new_activity: {id: null, name: null, parent_id: null},
      assignment_id: null,
      assignments: [],
      activities: [],
      selected_activities: [],
      labor_types: [],
      selected_labor_types: [],
      overhead_projects: [],
      type_order: {},
      type_orders: {},
      type_project: {},
    }
  },
  created () {
    this.getAssignments();
    this.getActivities();
    this.getLaborTypes();
    this.getOverheadProjects();
  },
  methods: {
    getAssignments(){
      this.$http.get('/labor_assignments').then(response => {
        this.assignments = response.data.data;
      });
    },
    getActivities(){
      this.$http.get('/labor_activities').then(response => {
        this.activities = response.data.data;
      });
    },
    getLaborTypes(){
      this.$http.get('/labor_types').then(response => {
        this.labor_types = response.data.data;
      });
    },
    getOverheadProjects(){
      if(!this.operator_id){
        return;
      }
      this.$http.get('/projects?client_id=' + this.operator_id).then(response => {
        this.overhead_projects = response.data;
      });
    },
    getOverheadOrders(type){
      if(!this.type_project[type]){
        return;
      }
      this.$http.get('/orders?project_id=' + this.type_project[type]).then(response => {
        this.type_orders[type] = response.data;
        this.$forceUpdate();
        console.log(type);
        console.log(this.type_orders[type]);
        if(this.type_orders[type].length == 1){
          this.type_order[type] = this.overhead_orders[0].id;
          this.saveLaborType();
        }
      });
    },
    treeNormalizer(node){
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
    },
    showAddAssignment(){
      this.new_assignment.id = null;
      this.new_assignment.name = null;
      this.new_assignment.parent_id = null;
      this.$refs['modal-assignment'].show();
    },
    addAssignment(){
      if(!this.new_assignment.name){
        return;
      }
      if(!this.new_assignment.id){
        this.$http.post('/labor_assignment', this.new_assignment).then(response => {
          this.getAssignments();
          this.assignment_id = response.data.data.id;
          this.$refs['modal-assignment'].hide();
        });
      }
      else{
        this.$http.patch('/labor_assignment/' + this.assignment_id, this.new_assignment).then(() => {
          this.getAssignments();
          this.$refs['modal-assignment'].hide();
        });
      }
    },
    showAddActivity(){
      this.new_activity.id = null;
      this.new_activity.name = null;
      this.new_activity.parent_id = null;
      this.$refs['modal-activity'].show();
    },
    addActivity(){
      if(!this.new_activity.name){
        return;
      }
      if(!this.new_activity.id){
        this.$http.post('/labor_activity', this.new_activity).then(response => {
          this.getActivities();
          this.activity_id = response.data.data.id;
          this.$refs['modal-activity'].hide();
        });
      }
      else{
        this.$http.patch('/labor_activity/' + this.new_activity.id, this.new_activity).then(() => {
          this.getActivities();
          this.$refs['modal-activity'].hide();
        });
      }
    },
    assignmentSelected(){
      this.selected_activities = [];
      this.selected_labor_types = [];
      let assignment = this.findAssignment(this.assignments);
      if(!assignment){
        return;
      }
      assignment.labor_activities.map(c => {
        this.selected_activities.push(c.id);
      });
      assignment.labor_types.map(c => {
        this.selected_labor_types.push(c.id);
      });
      assignment.orders.map(o => {
        this.type_project[o.pivot.labor_type_id] = o.project_id;
        this.getOverheadOrders(o.pivot.labor_type_id);
        this.type_order[o.pivot.labor_type_id] = o.id;
      });
    },
    saveActivities(){
      this.$http.put('/labor_assignment/' + this.assignment_id + '/labor_activities', {labor_activities: this.selected_activities}).then(() => {
        this.getAssignments();
      });
    },
    saveLaborTypes(){
      let mapped_types = {};
      this.selected_labor_types.map(t => {
        if(this.type_order[t]){
          mapped_types[t]={order_id: this.type_order[t]};
        }
        else{
          mapped_types[t]={};
        }
      });
      this.$http.put('/labor_assignment/' + this.assignment_id + '/labor_types', {labor_types: mapped_types}).then(() => {
        this.getAssignments();
      });
    },
    findAssignment(assignments){
      let assignment = null;
      assignments.map(a => {
        if(a.id == this.assignment_id){
          assignment = a;
        }
        else{
          if(a.children && a.children.length){
            let child_assignment = this.findAssignment(a.children);
            if(child_assignment){
              assignment = child_assignment;
            }
          }
        }
      });
      return assignment;
    },
    editAssignment(){
      let assignment = this.findAssignment(this.assignments);
      if(!assignment){
        return;
      }
      this.new_assignment.id = assignment.id;
      this.new_assignment.name = assignment.name;
      this.new_assignment.parent_id = assignment.parent_id;
      this.$refs['modal-assignment'].show()
    },
    editActivity(id,name,parent_id){
      this.new_activity.id = id;
      this.new_activity.name = name;
      this.new_activity.parent_id = parent_id;
      this.$refs['modal-activity'].show()
    },
    typeName(type){
      let types = this.labor_types.filter(t => (t.id == type));
      if(!types.length){
        return;
      }
      return types[0].name;
    },
    typeAssigned(type){
      let types = this.labor_types.filter(t => (t.id == type));
      if(!types.length){
        return false;
      }
      return types[0].assigned;
    }
  },
  computed:{
    overhead_type_selected(){
      let selected = false;
      this.labor_types.map(t => {
        if(t.name == 'Overhead'){
          selected = this.selected_labor_types.includes(t.id);
        }
      });
      return selected;
    },
    ...mapState({
      operator_id: state => state.settings.operating_company_client_id
    }),
  },
  watch:{
    operator_id (){
      this.getOverheadProjects();
    }
  }
}
</script>
