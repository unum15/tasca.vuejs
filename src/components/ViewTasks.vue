<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Tasks
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
            <b-table
                small
                striped
                hover
                :filter="filter"
                :items="tasks"
                :fields="fields"
                :per-page="perPage"
                :current-page="currentPage"
                @filtered="onFiltered"
            >
                <template slot="id" slot-scope="data">
                    <a :href="'#/client/'+ data.item.order.project.client_id +'/task/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
            <b-row>
                <b-col md="6" class="my-1">
                  <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
                </b-col>
            </b-row>

        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewTasks',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            tasks: [],
            filter: null,
            totalRows: 0,
            currentPage: 1,
            perPage: 20,
            fields: [
                    {
                    key: 'id',
                    label: '#',
                    sortable: true
                },
                {
                    key: 'order.project.client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'order.project.name',
                    label: 'Project Name',
                    sortable: true
                },
                {
                    key: 'order.property.name',
                    label: 'Property Name',
                    sortable: true
                },
                {
                    key: 'order.project.contact.name',
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
                    key: 'notes',
                    label: 'Notes',
                    sortable: false
                }
            ]
        }
    },
    created() {
        this.$http.get('/tasks').then((results) => {
            this.tasks = results.data;
            this.totalRows = this.tasks.length;
        });
    },
    methods: {
        onFiltered (filteredItems) {
          this.totalRows = filteredItems.length
          this.currentPage = 1
        }
    }
}
</script>