<template>
  <div>
      <b-container style="text-align:left;" fluid>
        <b-row>
          <b-col md="3" offset-md="4">
            <Treeselect :options="assignments" :normalizer="treeNormalizer" v-model="assignment.id" @input="assignmentSelected"/>
          </b-col>
          <b-col md="3">
            <b-button @click="editAssignment" v-if="assignment.id">Edit</b-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="2" offset-md="4">
            <b-button @click="showAddActivity()">Add Activity</b-button>
          </b-col>
          <b-col>
            <b-button @click="showAddAssignment">Add Assignment</b-button>
          </b-col>
        </b-row>
        <b-row v-if="assignment.id && labor_type.assigned">
          <b-col style="text-align:center">
            <b-form-group label="Assigned Project">
                    <b-form-select
                      @change="getOrders();"
                      :options="operator_projects"
                      value-field="id"
                      text-field="name"
                      v-model="project_id"
                    >
                  </b-form-select>
              </b-form-group>
          </b-col>
          <b-col style="text-align:center">
            <b-form-group label="Assigned Order">
                    <b-form-select
                      @change="saveOrderId()"
                      :options="orders"
                      value-field="id"
                      text-field="name"
                      v-model="assignment.order_id"
                    >
                  </b-form-select>
              </b-form-group>
          </b-col>
        </b-row>
        <b-form-checkbox-group v-model="selected_activities" v-if="assignment.id" @input="saveActivities">
          <b-row v-for="activity in activities" :key="activity.id">
            <b-col  md="3" offset-md="4">
              <img src="@/assets/expand.png" v-b-tooltip.hover title="Expand" @click.stop="activity.collapsed = false" alt="+" style="width:20px;verticle-align:top"  v-show="activity.collapsed" />
              <img src="@/assets/collapse.png" v-b-tooltip.hover title="Collapse" @click.stop="activity.collapsed = true" alt="" style="width:20px;verticle-align:top"  v-show="!activity.collapsed" />
              <span :class="childrenSelected(activity.children) ? 'children-selected' : ''" style="padding-left:10px;"></span>
              <b-form-checkbox :value="activity.id"><b-button variant="link" @click="editActivity(activity.id,activity.name,activity.parent_id)">{{ activity.name }}</b-button></b-form-checkbox>
              <b-container v-show="!activity.collapsed" fluid>
                <b-row v-for="subactivity in activity.children" :key="subactivity.id">
                  <b-col offset-md="1">
                    <b-form-checkbox :value="subactivity.id"><b-button variant="link" @click="editActivity(subactivity.id,subactivity.name,subactivity.parent_id)">{{ subactivity.name }}</b-button></b-form-checkbox>
                  </b-col>
                </b-row>
              </b-container>
            </b-col>
          </b-row>
        </b-form-checkbox-group>
    </b-container>
  
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
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'EditLaborTab',
  props: {
    labor_type: {required: true},
    operator_projects: {required: true}
  },
  components: {
    Treeselect
  },
  data () {
    return {
      new_assignment: {id: null, name: null, parent_id: null},
      new_activity: {id: null, name: null, parent_id: null},
      assignment: {id: null, name: null, parent_id: null, order_id: null},
      project_id: null,
      assignments: [],
      activities: [],
      selected_activities: [],
      orders: []
    }
  },
  created () {
    this.getAssignments();
    this.getActivities();
  },
  methods: {
    getAssignments(){
      this.$http.get('/labor_assignments?labor_type_id=' + this.labor_type.id).then(response => {
        this.assignments = response.data.data;
      });
    },
    getActivities(){
      this.$http.get('/labor_activities').then(response => {
        let activities = response.data.data;
        activities.map(a => {
          a.collapsed = true;
        });
        this.activities = activities;
      });
    },
    getOrders(){
      if(!this.project_id){
        return;
      }
      this.$http.get('/orders?project_id=' + this.project_id).then(response => {
        this.orders = response.data;
        if(this.orders.length == 1){
          this.order_id = this.orders[0].id;
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
      this.new_assignment = {
        id : null,
        name : null,
        parent_id : null,
        labor_type_id: this.labor_type.id
      }
      this.$refs['modal-assignment'].show();
    },
    addAssignment(){
      if(!this.new_assignment.name){
        return;
      }
      if(!this.new_assignment.id){
        this.$http.post('/labor_assignment', this.new_assignment).then(response => {
          this.getAssignments();
          this.assignment = response.data.data;
          this.$refs['modal-assignment'].hide();
        });
      }
      else{
        this.$http.patch('/labor_assignment/' + this.assignment.id, this.new_assignment).then(() => {
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
      let tmpassignment = this.findAssignment(this.assignments);
      if(!tmpassignment){
        return;
      }
      this.assignment = tmpassignment;
      this.assignment.labor_activities.map(c => {
        this.selected_activities.push(c.id);
      });
      if(this.assignment.order){
        this.project_id = this.assignment.order.project_id;
        this.getOrders();
      }
    },
    saveActivities(){
      this.$http.put('/labor_assignment/' + this.assignment.id + '/labor_activities', {labor_activities: this.selected_activities}).then(() => {
        this.getAssignments();
      });
    },
    saveOrderId(){
      this.$http.patch('/labor_assignment/' + this.assignment.id, {order_id: this.assignment.order_id}).then(() => {
        this.getAssignments();
      });
    },
    findAssignment(assignments){
      let assignment = null;
      assignments.map(a => {
        if(a.id == this.assignment.id){
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
      this.new_assignment = this.assignment;
      this.$refs['modal-assignment'].show()
    },
    editActivity(id,name,parent_id){
      this.new_activity.id = id;
      this.new_activity.name = name;
      this.new_activity.parent_id = parent_id;
      this.$refs['modal-activity'].show()
    },
    childrenSelected(children){
      let selected = children.filter(c => this.selected_activities.indexOf(c.id) > 0);
      return selected.length;
    }
  }
}
</script>
<style>
.children-selected{
  background-color: #AAFFAA;
}
</style>