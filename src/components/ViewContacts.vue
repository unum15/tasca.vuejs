<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Contacts
        </head>
        <main>
            <b-table small striped hover :items="contacts" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'#/contact/' + data.item.id"> {{ data.value }} </a>
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