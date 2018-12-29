<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Scheduler
        </head>
        <main>
             <el-table
                :data="tasks"
                border
                style="width: 100%"
                empty-text="Loading..."
                >
                <el-table-column
                  prop="order.approval_date"
                  sortable
                  label="App Date"
                  :filters="getUniqueValues('approval_date')"
                  :filter-method="filterHandler"
                  >
                </el-table-column>
                <el-table-column
                  prop="order_id"
                  sortable
                  label="S/WO#">
                  <template slot-scope="scope">
                        <a :href="'#/client/'+ scope.row.order.project.property.client.id +'/order/' + scope.row.id"> {{ scope.row.order.id }} </a>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="order.order_category.name"
                  sortable
                  label="C">
                </el-table-column>
                <el-table-column
                    prop="client.name"
                    sortable
                    filter_method="textSearch"
                    label="Client">
                    <template slot-scope="scope">
                        <a :href="'#/client/' + scope.row.order.project.property.client.id"> {{ scope.row.order.project.property.client.name }} </a>  
                    </template>
                </el-table-column>
                <el-table-column
                  prop="order.project.property.name"
                  sortable
                  label="Property">
                </el-table-column>
                <el-table-column
                  prop="description"
                  sortable
                  label="Description">
                </el-table-column>
                <el-table-column
                  prop="order.order_priority.name"
                  sortable
                  label="Pri">
                </el-table-column>
                <el-table-column
                  prop="task_category_id"
                  sortable
                  label="Category"
                  :filters="task_categories"
                  :filter-method="filterHandler"
                  >
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.task_category_id" placeholder="Select Category">
                      <el-option
                        v-for="item in task_categories"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status.name"
                  sortable
                  label="Status">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.task_status_id" placeholder="Select Status">
                      <el-option
                        v-for="item in task_statuses"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="action.name"
                  sortable
                  label="Action">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.task_action_id" placeholder="Select Action">
                      <el-option
                        v-for="item in task_actions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="day"
                  sortable
                  label="Day">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.day"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="date"
                  sortable
                  label="Date">
                    <template slot-scope="scope">
                      <el-date-picker
                        v-model="scope.row.date"
                        type="date"
                        placeholder="Date">
                      </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="sort_order"
                  sortable
                  label="Order">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.sort_order" placeholder="Select Order">
                      <el-option
                        v-for="i of task_sort_options"
                        :key="i"
                        :label="i"
                        :value="i">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="time"
                  sortable
                  label="Time">
                  <template slot-scope="scope">
                    <el-time-picker
                      v-model="scope.row.time"
                      placeholder="Select Time">
                    </el-time-picker>
                  </template>
                </el-table-column>
              </el-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewTasks',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            tasks: [],
            task_categories: [],
			task_statuses: [],
			task_actions: []
        }
    },
    created() {
        this.$http.get('/task_categories').then(response => {
			this.task_categories = response.data;
		});
		this.$http.get('/task_statuses').then(response => {
			this.task_statuses = response.data;
		});
		this.$http.get('/task_actions').then(response => {
			this.task_actions = response.data;
		});
        this.$http.get('/tasks?active_only=true').then((results) => {
            this.tasks = results.data;
        });
    },
    methods: {
      filterHandler(value, row, column) {
        console.log(value);
        console.log(row);
        console.log(column);
        return value == row['order']['approval_date'];
      },
      getUniqueValues(column){
        var values = [];
        this.tasks.forEach( t => {
            values.push(t['order'][column]);
        });
        values = values.filter( (value, index, self) => self.indexOf(value) === index )
        var return_array = [];
        values.forEach( v => {
            return_array.push({ text: v, value: v });
        });
        return return_array;
      }
    },
    computed: {
		task_sort_options() {
			// Chrome can't handle this yet
			//return [for (i of Array(100).keys()) i+1];
			var options = Array();
			for(var x=1;x<=100;x++){
				options.push(x);
			}
			return options;
		},
    }
}
</script>