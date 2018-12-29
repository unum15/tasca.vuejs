<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Clients
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
            <b-table small striped hover :filter="filter" :items="clients" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'#/client/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewClients',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            clients: [],
            filter: null,
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