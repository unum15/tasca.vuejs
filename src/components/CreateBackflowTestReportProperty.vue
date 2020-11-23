<template>
    <div>
        <TopMenu></TopMenu>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Client">
                         <el-select v-model="client_id" filterable placeholder="Select Client" @change="getProperties();">
                            <el-option
                              v-for="client in clients"
                              :key="client.id"
                              :label="client.name"
                              :value="client.id">
                            </el-option>
                          </el-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Property">
                            <b-form-select
                                v-model="property_id"
                                @change="getBackflowAssemblies()"
                                :options="properties"
                                value-field="id"
                                text-field="name"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
            <CreateBackflowTestReport
                :backflow_assemblies="backflow_assemblies"
            >
            </CreateBackflowTestReport>
            <b-button @click="$router.push('/backflow_test_reports')">Done</b-button>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import CreateBackflowTestReport from './CreateBackflowTestReport';
export default {
    name: 'CreateBackflowTestReportProperty',
    components: {
        'TopMenu': TopMenu,
        'CreateBackflowTestReport': CreateBackflowTestReport
    },
    props: {
    },
    data () {
        return {
            client_id: null,
            property_id: null,
            clients: [],
            contact_id: null,
            properties: [],
            backflow_assemblies: []
        };
    },
    created () {
        this.$http.get('/clients?backflow_only=true').then(response => {
            this.clients = response.data;
        });
    },
    methods: {
        getProperties() {
          this.backflow_assemblies = [];
          if(this.client_id){
            this.$http.get('/properties?client_id=' + this.client_id).then(response => {
              this.properties = response.data
              if(this.properties.length == 1){
                 this.property_id= this.properties[0].id;
                 this.getBackflowAssemblies();
              }
            })
          }
          else{
            this.properties = []
          }
        },
        getBackflowAssemblies(){
            if(this.property_id){
                this.$http.get('/backflow_assemblies?includes=backflow_size,backflow_type,backflow_manufacturer,backflow_model,backflow_super_type,backflow_type.backflow_super_type.backflow_valves,backflow_test_reports,backflow_test_reports.backflow_tests&active=1&property_id=' + this.property_id).then(response => {
                    let bas = response.data.data;
                    bas.map(ba => {
                        if(ba.backflow_test_reports.length){
                            if((ba.backflow_test_reports[0].submitted_date==null)&&(ba.backflow_test_reports[0].backflow_tests.length)){
                                let last_test = ba.backflow_test_reports[0].backflow_tests[ba.backflow_test_reports[0].backflow_tests.length-1];
                                ba.reading_1 = last_test.reading_1;
                                ba.reading_2 = last_test.reading_2;
                                ba.reading_notes = last_test.notes;
                                ba.backflow_test_report_id = ba.backflow_test_reports[0].id;
                            }
                        }
                    });
                    this.backflow_assemblies = bas;
                 });
            }
            else{
                this.backflow_assemblies = [];
            }
        },
    }
};
</script>

