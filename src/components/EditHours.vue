<template>
  <div>
    <TopMenu></TopMenu>
    <header>
      Hours
    </header>
    <main>
        Date:
        <input type="date" v-model="start_date" />
        <input type="date" v-model="stop_date" />
      <br />
      Sort:
      <b-select v-model="group_by">
        <option>name</option>
        <option>job</option>
        <option>date</option>
      </b-select>
      <br />
      Filter
      <b-input type="text" v-model="filter"></b-input>
      <ul>
        <HoursTable v-for="group in groups" :key="group.id" :group="group" :filter="filter" @update="refresh"  @filtered="updateTotal"></HoursTable>
      </ul>
      <h4>Total: {{ total_hours }} </h4>
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
import HoursTable from './HoursTable'
export default {
  name: 'EditHours',
  components: {
    'TopMenu': TopMenu,
    'HoursTable': HoursTable
  },
  data () {
    return {
        start_date: null,
        stop_date: null,
        filter: null,
        groups: [],      
        sign_ins: [],
        group_by: "name",
        total_hours: 0
    }
  },
  mounted () {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.start_date = firstDay.toISOString().split('T')[0];
    this.stop_date = lastDay.toISOString().split('T')[0];
    //this.refresh();
  },
  methods: {
    updateGroups () {
      var groups = {};
      var group = [];
      var last = "";
      var parent = this;
      var total_hours = 0;
      this.sign_ins.sort(this.sign_in_compare(this.group_by));
      this.sign_ins.forEach(sign_in => {
        if(last!=sign_in[parent.group_by]){
          if(last!=""){            
            groups[last]=({id:last,total: Math.round(Number.parseFloat(total_hours)*100)/100 ,data:group, filter: null});
          }
          last=sign_in[parent.group_by];
          total_hours = 0;
          group=[];
        }
        if(sign_in.hours!=null){
          total_hours += Math.round(Number.parseFloat(sign_in.hours)*100)/100;
        }
        group.push(sign_in);
      });
      groups[last]=({id:last,total: Math.round(Number.parseFloat(total_hours)*100)/100 ,data:group, filter: null});      
      this.groups=groups;
      this.updateTotal(last,total_hours);
    },
    sign_in_compare(group_by) {
      return function (a,b){
        if (a[group_by] < b[group_by])
          return -1;
        if (a[group_by] > b[group_by])
          return 1;
        if (a.full_sign_in_time < b.full_sign_in_time)
          return -1;
        if (a.full_sign_in_time > b.full_sign_in_time)
          return 1;
        return 0;
      };
    },    
    refresh(){
      if((this.start_date !== null) && (this.stop_date !== null)){
        this.$http.get('sign_ins',{start_date: this.start_date, stop_date: this.stop_date}).then(request => {
              this.sign_ins = request.data;
              this.updateGroups();
          });
       }
    },
    updateTotal(group,subTotal){
      this.groups[group].total = subTotal;
      var total=0;
      console.log('subtotal:'+subTotal);
      for (var g in this.groups) {
         if (this.groups.hasOwnProperty(g)) {
          console.log(this.groups[g].total);
          total+=this.groups[g].total;
         }
      }
      this.total_hours=(Math.round(total * 100))/100;
    }

  },
  watch: {
    start_date(){
      this.refresh();
    },
    stop_date(){
      this.refresh();
    },
    group_by(){
      this.updateGroups();
    }
  }
}
</script>