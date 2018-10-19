<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Properties
        </head>
        <main>
            <b-table small striped hover :items="properties" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'#/property/' + data.item.id"> {{ data.value }} </a>
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
            properties: [],
            fields: [
                {
                    key: 'client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'name',
                    label: 'Property Name',
                    sortable: true
                },
                {
                    key: 'contact.name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'activity_level.name',
                    label: 'Activity Level',
                    sortable: true
                },
                {
                    key: 'property_type.name',
                    label: 'Type',
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
        this.$http.get('/properties').then((results) => {
            this.properties = results.data;
        });
    }
}
</script>