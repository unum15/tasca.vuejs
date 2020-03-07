<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Projects
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
            <b-table small striped hover :filter="filter" :items="projects" :fields="fields">
                <template v-slot:cell(name)="data">
                    <a :href="'/client/'+ data.item.client_id +'/project/' + data.item.id"> {{ data.value }} </a>
                </template>
            </b-table>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'ViewProjects',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            projects: [],
            filter: null,
            fields: [
                {
                    key: 'client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'contact.name',
                    label: 'Contact Name',
                    sortable: true
                },
                {
                    key: 'name',
                    label: 'Project Name',
                    sortable: true
                },
                {
                    key: 'open_date',
                    label: 'Open Date',
                    sortable: true,
                },
                {
                    key: 'close_date',
                    label: 'Close Date',
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
        this.$http.get('/projects').then((results) => {
            this.projects = results.data;
        });
    }
}
</script>