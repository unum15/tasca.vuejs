<template>
    <div>
        <TopMenu></TopMenu>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Date">
                            <b-form-input
                              type="date"
                              @change="getBackflowAssemblies()"
                              v-model="date"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col />
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
import moment from 'moment';
import CreateBackflowTestReport from './CreateBackflowTestReport';
export default {
    name: 'CreateBackflowTestReportDate',
    components: {
        'TopMenu': TopMenu,
        'CreateBackflowTestReport': CreateBackflowTestReport
    },
    props: {
    },
    data () {
        return {
            date: null,
            backflow_assemblies: []
        };
    },
    created () {
        this.date=this.today;
        this.getBackflowAssemblies();
    },
    methods: {
        getBackflowAssemblies(){
            if(this.date){
                this.$http.get('/backflow_assemblies?includes=backflow_size,backflow_type,backflow_manufacturer,backflow_model,backflow_super_type,backflow_type.backflow_super_type.backflow_valves,backflow_test_reports,backflow_test_reports.backflow_tests&test_date=' + this.date).then(response => {
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
    },
    computed:{
        today() {
            return moment().format('YYYY-MM-DD');
        },
    },
};
</script>

