<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Service Orders
        </head>
        <main>
            <b-table small striped hover :items="service_orders" :fields="fields">
                <template slot="id" slot-scope="data">
                    <a :href="'#/client/'+ data.item.project.property.client_id +'/service_order/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewServiceOrders',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            service_orders: [],
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
        this.$http.get('/service_orders').then((results) => {
            this.service_orders = results.data;
        });
    }
}
</script>