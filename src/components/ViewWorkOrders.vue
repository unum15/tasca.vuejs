<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Work Orders
        </head>
        <main>
            <b-table small striped hover :items="work_orders" :fields="fields">
                <template slot="id" slot-scope="data">
                    <a :href="'#/work_order/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewWorkOrders',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            work_orders: [],
            fields: [
                {
                    key: 'id',
                    label: '#',
                    sortable: true
                },
                {
                    key: 'project.property.client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'project.name',
                    label: 'Project Name',
                    sortable: true
                },
                {
                    key: 'project.property.name',
                    label: 'Property Name',
                    sortable: true
                },
                {
                    key: 'project.contact.name',
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
                    key: 'expiration_date',
                    label: 'Expires',
                    sortable: true,
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
        this.$http.get('/work_orders').then((results) => {
            this.work_orders = results.data;
        });
    }
}
</script>