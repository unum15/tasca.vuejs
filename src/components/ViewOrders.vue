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
                    <b-form-group  label="Filter" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter" placeholder="Type to Search" />
                        <b-input-group-append>
                          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table small striped hover :filter="filter" :items="orders" :fields="fields">
                <template v-slot:cell(id)="data">
                    <a :href="'/client/' + data.item.project.client_id + '/project/' + data.item.project_id +'/order/' + data.item.id" v-if="data.item.project"> {{ data.value }} </a>
                </template>
                <template v-slot:cell(property)="data">
                    {{ data.item.properties.length ? data.item.properties[0].name : ''}}
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
                    key: 'property',
                    label: 'Property Name',
                    sortable: true
                },
                {
                    key: 'project.contact.name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'name',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: 'description',
                    label: 'Description',
                    sortable: true
                },
                {
                    key: 'date',
                    label: 'Order Date',
                    sortable: true
                },
                {
                    key: 'completion_date',
                    label: 'Closed Date',
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
        this.$http.get('/orders?includes=project,property,project.client,project.contact').then((results) => {
            this.orders = results.data;
        });
    }
}
</script>