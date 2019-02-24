<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Orders
        </head>
        <main>
            <b-container fluid>
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group horizontal label="Filter" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Type to Search" />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container fluid>
            <b-table small striped hover :filter="filter" :items="orders" :fields="fields">
                <template slot="id" slot-scope="data">
                    <a :href="'/client/'+ data.item.project.client_id + '/project/'+ data.item.project_id +'/order/' + data.item.id"> {{ data.value }} </a>
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
            orders: [],
            filter: null,
            fields: [
                {
                    key: 'id',
                    label: '#',
                    sortable: true
                },
                {
                    key: 'project.client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'project.name',
                    label: 'Project Name',
                    sortable: true
                },
                {
                    key: 'property.name',
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
        this.$http.get('/orders').then((results) => {
            this.orders = results.data;
        });
    }
}
</script>