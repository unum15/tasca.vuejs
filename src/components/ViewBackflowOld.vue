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
                    <el-select
                        v-model="data.item.property_id"
                        filterable
                        default-first-option
                        placeholder="Select Property"
                    >
                        <el-option
                          v-for="property in properties"
                          :key="property.id"
                          :label="property.name + '-' + property.address"
                          :value="property.id">
                        </el-option>
                    </el-select>
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

