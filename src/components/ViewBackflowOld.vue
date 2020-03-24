<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            View Backflow Old
        </head>
        <main>
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="backflow_old"
                :fields="fields"
            >
                <template v-slot:cell(property_id)="data">
                    <b-form-select
                            v-model="data.item.property_id"
                            :options="properties"
                            value-field="id"
                            text-field="name"
                            @change="save"
                        />
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewBackflowOld',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            backflow_old: [],
            filter: null,
            fields: [
                    {
                        key: 'active',
                        label: 'Active',
                        sortable: true
                    },
                    {
                        key: 'prt',
                        label: 'Prt',
                        sortable: true
                    },
                    {
                        key: 'owner',
                        label: 'Owner',
                        sortable: true
                    },
                    {
                        key: 'contact',
                        label: 'Contact',
                        sortable: true
                    },
                    {
                        key: 'location',
                        label: 'Location',
                        sortable: true
                    },
                    {
                        key: 'laddress',
                        label: 'Laddress',
                        sortable: true
                    },
                    {
                        key: 'lcity',
                        label: 'Lcity',
                        sortable: true
                    },
                    {
                        key: 'lstate',
                        label: 'Lstate',
                        sortable: true
                    },
                    {
                        key: 'lzip',
                        label: 'Lzip',
                        sortable: true
                    },
                    {
                        key: 'property_id',
                        label: 'Property',
                        sortable: false
                    }
            ],
            properties: []
        }
    },
    created() {
        this.getProperties();
        this.$http.get('/backflow_old').then(response => {
            this.backflow_old = response.data.data;
        });
    },
    methods: {
        getProperties(){
            this.$http.get('/properties').then((results) => {
                this.properties = results.data;
            });
        },
        save(){
        
        }
    }
}
</script>

