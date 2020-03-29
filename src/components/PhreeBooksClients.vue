<template>
    <div>
        <TopMenu></TopMenu>
        <head>
            Clients
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
                  <b-col>
                    <b-form-group  label="Active" class="mb-0">
                      <b-input-group>
                        <b-form-select
                            v-model="activity"
                            :options="activity_types"
                            @change="getClients"
                        />
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group  label="Location" class="mb-0">
                      <b-input-group>
                        <b-form-select
                            v-model="location"
                            :options="location_types"
                            @change="getClients"
                        />
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group  label="Synced" class="mb-0">
                      <b-input-group>
                        <b-form-select
                            v-model="synced"
                            :options="synced_types"
                            @change="getClients"
                        />
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
            </b-container>
            <b-table small striped hover :filter="filter" :items="clients" :fields="fields">
                <template v-slot:cell(phreebooks_id)="data">
                    <a v-if="data.item.phreebooks_id" :href="'/phreebooks/client/' + data.item.phreebooks_id"> Phree </a>
                    <div v-else>
                        <b-button @click="findPhreebooksClient(data.item.id)">
                            Find
                        </b-button>
                        <b-button @click="addPhreebooksClient(data.item.id)" >
                            Add
                        </b-button>
                    </div>
                </template>
                <template v-slot:cell(id)="data">
                    <a v-if="data.item.id" :href="'/client/' + data.item.id"> Tasca </a>
                    <div v-else>
                        <b-button @click="findTascaClient(data.item.phreebooks_id)" >
                            Find
                        </b-button>
                        <b-button @click="addTascaClient(data.item.phreebooks_id)" >
                            Add
                        </b-button>
                    </div>
                </template>
            </b-table>
        </main>
        <b-modal
            id="find-tasca-modal"
            @hidden="resetFindTascaModal"
            @ok="handleTascaModalOk"
            >
            <template v-slot:modal-title>
              Find Tasca Client
            </template>
            <div>
                <b-form-group  label="Select Tasca Client" class="mb-0">
                      <b-input-group>
                        <el-select
                            v-model="tasca_client"
                            filterable
                            placeholder="Select Tasca Client"
                        >
                        <el-option
                              v-for="client in tasca_clients"
                              :key="client.id"
                              :label="client.name"
                              :value="client.id">
                            </el-option>
                        </el-select>
                      </b-input-group>
                    </b-form-group>
            </div>
         </b-modal>
         <b-modal
            id="find-phree-modal"
            @hidden="resetFindPhreeModal"
            @ok="handlePhreeModalOk"
            >
            <template v-slot:modal-title>
              Find Phree Books Client
            </template>
            <div>
                <b-form-group  label="Select Phree Books Client" class="mb-0">
                      <b-input-group>
                        <el-select
                            v-model="phree_client"
                            filterable
                            placeholder="Select Phree Client"
                        >
                        <el-option
                              v-for="client in phree_clients"
                              :key="client.phree_books.id"
                              :label="client.phree_books.short_name + '-' + client.phree_books.primary_name"
                              :value="client.phree_books.id">
                            </el-option>
                        </el-select>
                      </b-input-group>
                    </b-form-group>
            </div>
         </b-modal>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
export default {
    name: 'PhreeBooksClients',
    components: {
        'TopMenu': TopMenu,
    },
    data() {
        return {
            clients: [],
            filter: null,
            activity: 'Active',
            activity_types: ['Active','Inactive','Both'],
            location: 'Both',
            location_types: ['Tasca','Phree Books','Both'],
            synced: 'Not Synced',
            synced_types: ['Synced','Not Synced','Both'],
            find_phree_show: false,
            tasca_client: null,
            tasca_clients: [],
            phree_client: null,
            phree_clients: [],
            fields: [
                {
                    key: 'name',
                    label: 'Client Name',
                    sortable: true
                },
                {
                    key: 'billing_property.name',
                    label: 'Mailing Property',
                    sortable: true
                },
                {
                    key: 'phree_books.short_name',
                    label: 'Customer Id',
                    sortable: true
                },
                {
                    key: 'phree_books.primary_name',
                    label: 'Name/Company',
                    sortable: true
                },
                {
                    key: 'phreebooks_id',
                    label: 'Phree',
                    sortable: true
                },
                {
                    key: 'id',
                    label: 'Tasca',
                    sortable: true
                },
            ]
        }
    },
    created() {
        this.getClients();
        this.$http.get('/phree_books/clients?location=Tasca&synced=Not Synced').then((results) => {
            this.tasca_clients = results.data;
        });
        this.$http.get('/phree_books/clients?location=Phree Books&synced=Not Synced').then((results) => {
            this.phree_clients = results.data;
        });
    },
    methods: {
        getClients(){
            this.$http.get('/phree_books/clients?active='+this.active+'&location='+this.location+'&synced='+this.synced).then((results) => {
                this.clients = results.data;
            });
        },
        findPhreebooksClient(id){
            this.tasca_client=id;
            this.$bvModal.show('find-phree-modal');
        },
        addPhreebooksClient(id){
            this.$http.post('/phree_books/client/'+id).then(() => {
                this.getClients();
            });
        },
        resetFindPhreeModal(){
            this.tasca_client=null;
            this.phree_client=null;
        },
        handlePhreeModalOk(){
            this.$http.patch('/phree_books/client/'+this.tasca_client+'/match', {'phreebooks_id': this.phree_client}).then(() => {
                this.getClients();
            });
        },
        findTascaClient(id){
            this.phree_client=id;
            this.$bvModal.show('find-tasca-modal');
        },
        addTascaClient(id){
            alert("I told you this didn't work!!!" + id);
        },
        resetFindTascaModal(){
            this.tasca_client=null;
            this.phree_client=null;
        },
        handleTascaModalOk(){
            this.$http.patch('/phree_books/client/'+this.tasca_client+'/match', {'phreebooks_id': this.phree_client}).then(() => {
                this.getClients();
            });
        }
    }
}
</script>