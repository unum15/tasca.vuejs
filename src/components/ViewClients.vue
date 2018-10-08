<template>
    <div>
        <head>
            Clients
        </head>
        <main>
            <b-table small striped hover :items="clients" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'#/client/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
export default {
    name: 'ViewClients',
    data() {
        return {
            clients: [],
            fields: [
                {
                    key: 'name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'client_type.name',
                    label: 'Client Type',
                    sortable: true,
                },
                {
                    key: 'activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'billing_contact.name',
                    label: 'Billing Contact',
                    sortable: true,
                },
                {
                    key: 'billing_property.city',
                    label: 'Address',
                    sortable: false
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
        this.$http.get('/clients').then((results) => {
            this.clients = results.data;
        });
    }
}
</script>