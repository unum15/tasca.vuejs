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
    name: 'PhreeBooksAddresses',
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
                    key: 'primary_name',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: 'contact',
                    label: 'Contact',
                    sortable: true
                },
                {
                    key: 'address1',
                    label: 'Address 1',
                    sortable: true
                },
                {
                    key: 'address2',
                    label: 'Address 2',
                    sortable: true
                },
                {
                    key: 'city_town',
                    label: 'City',
                    sortable: true
                },
                {
                    key: 'state_province',
                    label: 'State',
                    sortable: true
                },
                {
                    key: 'postal_code',
                    label: 'Zip',
                    sortable: true
                },
                {
                    key: 'country_code',
                    label: 'Country',
                    sortable: true
                },
                {
                    key: 'telephone1',
                    label: 'Tele1',
                    sortable: true
                },
                {
                    key: 'telephone2',
                    label: 'Tele2',
                    sortable: true
                },
                {
                    key: 'telephone3',
                    label: 'Tele3',
                    sortable: true
                },
                {
                    key: 'telephone4',
                    label: 'Tele4',
                    sortable: true
                },
                {
                    key: 'email',
                    label: 'Email',
                    sortable: true
                },
                {
                    key: 'website',
                    label: 'Website',
                    sortable: true
                },
                {
                    key: 'notes',
                    label: 'Notes',
                    sortable: true
                },
                {
                    key: 'tasca.name',
                    label: 'Name',
                    sortable: true
                },
                {
                    key: 'tasca.activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'tasca.address1',
                    label: 'Address1',
                    sortable: true,
                },
                {
                    key: 'tasca.address2',
                    label: 'Address2',
                    sortable: true
                },
                {
                    key: 'tasca.city',
                    label: 'City',
                    sortable: true
                },
                {
                    key: 'tasca.state',
                    label: 'St',
                    sortable: true
                },
                {
                    key: 'tasca.zip',
                    label: 'Zip',
                    sortable: true
                },
                {
                    key: 'tasca.phone_number',
                    label: 'Phone',
                    sortable: true
                },
                {
                    key: 'tasca.notes',
                    label: 'Notes',
                    sortable: true
                },
                {
                    key: 'tasca.created_at',
                    label: 'Created',
                    sortable: true
                },
                {
                    key: 'tasca.updated_at',
                    label: 'Updated',
                    sortable: true
                }
            ]
        }
    },
    created() {
        this.$http.get('/phree_books/addresses').then((results) => {
            this.contacts = results.data;
        });
    }
}
</script>