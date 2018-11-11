<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Tasks
        </head>
        <main>
            <b-table small striped hover :items="tasks" :fields="fields">
                <template slot="id" slot-scope="data">
                    <a :href="'#/task/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
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