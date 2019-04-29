<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Contacts
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
            <b-table small striped hover :filter="filter" :items="contacts" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'/contact/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'PhreeBooksContacts',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            contacts: [],
            filter: null,
            fields: [
                {
                    key: 'type',
                    label: 'Type',
                    sortable: true
                },
                {
                    key: 'contacts_level',
                    label: 'Level',
                    sortable: true
                },
                {
                    key: 'short_name',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: 'inactive',
                    label: 'ia',
                    sortable: true
                },
                {
                    key: 'contact_first',
                    label: 'First',
                    sortable: true
                },
                {
                    key: 'contact_middle',
                    label: 'Middle',
                    sortable: true
                },
                {
                    key: 'contact_last',
                    label: 'Last',
                    sortable: true
                },
                {
                    key: 'first_date',
                    label: 'created',
                    sortable: true
                },
                {
                    key: 'last_update',
                    label: 'updated',
                    sortable: true
                },
                {
                    key: 'tasca.name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'tasca.activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'tasca.contact_method.name',
                    label: 'Contact Method',
                    sortable: true,
                },
                {
                    key: 'tasca.login',
                    label: 'Login',
                    sortable: false
                },
                {
                    key: 'tasca.notes',
                    label: 'Notes',
                    sortable: false
                },
                {
                    key: 'tasca.created_at',
                    label: 'Created',
                    sortable: false
                },
                {
                    key: 'tasca.updated_at',
                    label: 'Updated',
                    sortable: false
                }
            ]
        }
    },
    created() {
        this.$http.get('/phree_books/contacts').then((results) => {
            this.contacts = results.data;
        });
    }
}
</script>