<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Projects
        </head>
        <main>
            <b-table small striped hover :items="projects" :fields="fields">
                <template slot="name" slot-scope="data">
                    <a :href="'#/project/' + data.item.id"> {{ data.value }} </a>
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
            fields: [
                {
                    key: 'property.client.name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'property.name',
                    label: 'Property Name',
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