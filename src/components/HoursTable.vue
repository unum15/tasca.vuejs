<template>
    <div> 	
			<h3>{{ group.id }}</h3>
			<b-table 
				:fields="fields" 
				:items="group.data"
				:filter="filter"
        @filtered="onFiltered"
        small
        striped
			>
        <template v-slot:cell(clock_in)="data">
          <span @click.stop="edit('clock_in',data.item)">
            <span v-if="data.item.clock_in">
              {{ formatTimeStampToTime(data.item.clock_in) }}
            </span>
            <span v-else>
              add
            </span>
          </span>
        </template>
        <template v-slot:cell(clock_out)="data">
          <span @click.stop="edit('clock_out',data.item)">
            <span v-if="data.item.clock_out">
              {{ formatTimeStampToTime(data.item.clock_out) }}
            </span>
            <span v-else>
              add
            </span>
          </span>
        </template>
				<template v-slot:cell(hours)="data">
          {{ timeStampDiff(data.item.clock_in, data.item.clock_out) }}
        </template>
        <template v-slot:cell(notes)="data">
          <span @click.stop="editNotes(data.item)">
            <span v-if="data.item.notes">
              {{ data.item.notes }}
            </span>
            <span v-else>
              add
            </span>
          </span>
        </template>
			</b-table>
			<h4>SubTotal: {{ subtotal }} </h4>
      <b-modal ref="editModal" title="Edit Time" @ok="updateClockIn" @shown="focusTimeInput">
        <p class="my-4">Enter new time:</p>
        <b-form-input ref="editTimeInput" type="time" v-model="editValue"></b-form-input>
      </b-modal>
      <b-modal ref="editNotesModal" title="Edit Notes" @ok="updateClockIn" @shown="focusNotesInput">
        <p class="my-4">Notes:</p>
        <b-form-textarea ref="editNotesInput" v-model="editValue"></b-form-textarea>
      </b-modal>
    </div>
</template>
<script>
import moment from 'moment';
export default {
  name: 'HoursTable',
  props: {
		group: {
			required: true
		},
		filter: {
			required: true
		}
  },
  data () {
    return {
			subtotal: 0,
      fields: [
				{
					label: "Name",
					key: "contact.name"
				},
				{
					label: "Work Order",
					key: "task_date.task.order.id"
				},
				{
					label: "Client Name",
					key: "task_date.task.order.project.client.name"
				},
				{
					label: "Date",
					key: "task_date.date"
				},
				{
					label: "Start",
					key: "clock_in"
				},
				{
					label: "End",
					key: "clock_out"
				},
				{
					label: "Total",
					key: "hours"
				},
				{
					label: "Notes",
					key: "notes"
				}
      ],
      editValue: null,
      editItem: null
    };
  },
  computed: {		
  },
  mounted () {  
  },
  methods: {	
		onFiltered(items) {
			this.subtotal = 0;
			for(var x=0; x<items.length; x++){
				var hours = this.timeStampDiff(items[x].clock_in, items[x].clock_out)
				if(!isNaN(Number.parseFloat(hours))){
					this.subtotal += Number.parseFloat(hours);
				}
			}
			this.subtotal = (Math.round(this.subtotal * 100))/100;
			this.$emit('filtered',this.group.id,this.subtotal);
		},
    edit(field,item) {
      this.editValue = item[field];
      this.editItem = item;
      this.editField = field;
      this.$refs.editModal.show();
      this.$refs.editTimeInput.focus();
    },
		formatTimeStampToTime(value){
			return moment(value).format('hh:mm A')
		},
		timeStampDiff(clock_in, clock_out){
			var mclock_in = moment(clock_in);
			var mclock_out = moment(clock_out);
			var hours = mclock_out.diff(mclock_in)/3600000;
			return hours.toFixed(1);
		},
    focusTimeInput(){
      this.$refs.editTimeInput.focus();
    },
    editNotes(item) {
      this.editValue = item.notes;
      this.editItem = item;
      this.editField = "notes";
      this.$refs.editNotesModal.show();
      this.$refs.editNotesInput.focus();
    },
    focusNotesInput(){
      this.$refs.editNotesInput.focus();
    },
    updateClockIn() {
      var clock_in = { clock_in_index: this.editItem.clock_in_index };
      if(this.editField == "notes"){
        clock_in[this.editField] = this.editValue;
      }
      else{
        clock_in[this.editField] = this.editItem.date + " " + this.editValue;
      }
      this.$http.patch('/clock_in/'+clock_in.id, clock_in).then(() =>
        {
          this.$emit('update');
        });
    }
  },
  watch: {	
  }
}
</script>
