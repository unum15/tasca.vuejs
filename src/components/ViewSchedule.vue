<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Scheduler
        </head>
        <main>
             <el-table
                :data="tasks"
                :span-method="arraySpanMethod"
                border
                style="width: 100%">
                
                App DateD 	AWO#D 	ACD 	AClientD 	APropertyD 	Description 	APriD 	ATypeD 	AStatusD 	AActionD 	ADayD 	ADateD 	AOrderD 	ATime
                
                <el-table-column
                  prop="approval_date"
                  sortable
                  label="App Date">
                </el-table-column>
                <el-table-column
                  prop="work_order_id"
                  sortable
                  label="S/WO#">
                </el-table-column>
                <el-table-column
                  prop="category.name"
                  sortable
                  label="C">
                </el-table-column>
                <el-table-column
                  prop="client.name"
                  sortable
                  label="Client">
                </el-table-column>
                <el-table-column
                  prop="property.name"
                  sortable
                  label="Property">
                </el-table-column>
                <el-table-column
                  prop="description"
                  sortable
                  label="Description">
                </el-table-column>
                <el-table-column
                  prop="priority"
                  sortable
                  label="Pri">
                </el-table-column>
                <el-table-column
                  prop="category.name"
                  sortable
                  label="Category">
                </el-table-column>
                <el-table-column
                  prop="status.name"
                  sortable
                  label="Status">
                </el-table-column>
                <el-table-column
                  prop="action.name"
                  sortable
                  label="Action">
                </el-table-column>
                <el-table-column
                  prop="day"
                  sortable
                  label="Day">
                </el-table-column>
                <el-table-column
                  prop="date"
                  sortable
                  label="Date">
                </el-table-column>
                <el-table-column
                  prop="sort_order"
                  sortable
                  label="Order">
                </el-table-column>
                <el-table-column
                  prop="time"
                  sortable
                  label="Time">
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
            fields: [
                    {
                    key: 'id',
                    label: '#',
                    sortable: true
                },
                {
                    key: 'service_order.project.property.client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'service_order.project.name',
                    label: 'Project Name',
                    sortable: true
                },
                {
                    key: 'service_order.project.property.name',
                    label: 'Property Name',
                    sortable: true
                },
                {
                    key: 'service_order.project.contact.name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'description',
                    label: 'Description',
                    sortable: true
                },
                {
                    key: 'date',
                    label: 'Date',
                    sortable: true
                },
                {
                    key: 'notes',
                    label: 'Notes',
                    sortable: false
                }
            ]
        }
    },
    created() {
        this.$http.get('/tasks').then((results) => {
            this.tasks = results.data;
        });
    }
}
</script>