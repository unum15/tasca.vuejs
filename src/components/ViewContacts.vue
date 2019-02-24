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
    name: 'ViewContacts',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            contacts: [],
            filter: null,
            fields: [
                {
                    key: 'name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'contact_method.name',
                    label: 'Contact Method',
                    sortable: true,
                },
                {
                    key: 'login',
                    label: 'Login',
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
        this.$http.get('/contacts').then((results) => {
            this.contacts = results.data;
        });
    }
}
</script>