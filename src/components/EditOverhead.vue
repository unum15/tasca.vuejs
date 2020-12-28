<template>
  <div>
    <TopMenu></TopMenu>
    <header>
        Overhead Assignments and Categories
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
            <b-form-checkbox-group v-model="selected_categories" v-if="assignment_id" @input="saveCategories">
              <b-row v-for="category in categories" :key="category.id">
                <b-col  md="3" offset-md="4">
                   <b-form-checkbox :value="category.id"><b-button variant="link" @click="editCategory(category.id,category.name,category.parent_id)">{{ category.name }}</b-button></b-form-checkbox>
                  <b-container>
                    <b-row v-for="subcategory in category.children" :key="subcategory.id">
                      <b-col md="3" offset-md="5">
                        <b-form-checkbox :value="subcategory.id"><b-button variant="link" @click="editCategory(subcategory.id,subcategory.name,subcategory.parent_id)">{{ subcategory.name }}</b-button></b-form-checkbox>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </b-row>
            </b-form-checkbox-group>
            <b-row>
              <b-col md="3" offset-md="4">
                <b-button @click="showAddCategory()">Add Category</b-button>
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
    <b-modal ref="modal-category" @ok="addCategory" title="New Category">
      <b-container fluid>
        <b-row>
          <b-col>
            <b-form-group label="New Category">
              <b-form-input type="text" v-model="new_category.name" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Parent Category">
              <b-form-select
                  :options="categories"
                  value-field="id"
                  text-field="name"
                  v-model="new_category.parent_id"
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
export default {
  name: 'EditOverhead',
  components: {
    TopMenu,
    Treeselect
  },
  data () {
    return {
      new_assignment: {name: null, parent_id: null},
      new_category: {name: null, parent_id: null},
      assignment_id: null,
      assignments: [],
      categories: [],
      selected_categories: []
    }
  },
  created () {
    this.getAssignments();
    this.getCategories();
  },
  methods: {
    getAssignments(){
      this.$http.get('/overhead_assignments').then(response => {
        this.assignments = response.data.data;
      });
    },
    getCategories(){
      this.$http.get('/overhead_categories').then(response => {
        this.categories = response.data.data;
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
      if(!this.new_assignment.id){
        this.$http.post('/overhead_assignment', this.new_assignment).then(response => {
          this.getAssignments();
          this.assignment_id = response.data.data.id;
          this.$refs['modal-assignment'].hide();
        });
      }
      else{
        this.$http.patch('/overhead_assignment/' + this.assignment_id, this.new_assignment).then(() => {
          this.getAssignments();
          this.$refs['modal-assignment'].hide();
        });
      }
    },
    showAddCategory(){
      this.new_category.id = null;
      this.new_category.name = null;
      this.new_category.parent_id = null;
      this.$refs['modal-category'].show();
    },
    addCategory(){
      if(!this.new_category.id){
        this.$http.post('/overhead_category', this.new_category).then(response => {
          this.getCategories();
          this.category_id = response.data.data.id;
          this.$refs['modal-category'].hide();
        });
      }
      else{
        this.$http.patch('/overhead_category/' + this.new_category.id, this.new_category).then(() => {
          this.getCategories();
          this.$refs['modal-category'].hide();
        });
      }
    },
    assignmentSelected(){
      this.selected_categories = [];
      let assignment = this.findAssignment(this.assignments);
      if(!assignment){
        return;
      }
      assignment.overhead_categories.map(c => {
        this.selected_categories.push(c.id);
      });
    },
    saveCategories(){
      this.$http.put('/overhead_assignment/' + this.assignment_id + '/overhead_categories', {categories: this.selected_categories}).then(() => {
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
          if(a.children.length){
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
    editCategory(id,name,parent_id){
      this.new_category.id = id;
      this.new_category.name = name;
      this.new_category.parent_id = parent_id;
      this.$refs['modal-category'].show()
    }
  }
}
</script>
