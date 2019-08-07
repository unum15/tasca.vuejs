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
        <template slot="sign_in" slot-scope="data">
          <span @click.stop="edit('sign_in',data.item)">
            <span v-if="data.item.sign_in">
              {{ formatTimeStampToTime(data.item.sign_in) }}
            </span>
            <span v-else>
              add
            </span>
          </span>
        </template>
        <template slot="sign_out" slot-scope="data">
          <span @click.stop="edit('sign_out',data.item)">
            <span v-if="data.item.sign_out">
              {{ formatTimeStampToTime(data.item.sign_out) }}
            </span>
            <span v-else>
              add
            </span>
          </span>
        </template>
				<template slot="hours" slot-scope="data">
          {{ timeStampDiff(data.item.sign_in, data.item.sign_out) }}
        </template>
        <template slot="notes" slot-scope="data">
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
      <b-modal ref="editModal" title="Edit Time" @ok="updateSignIn" @shown="focusTimeInput">
        <p class="my-4">Enter new time:</p>
        <b-form-input ref="editTimeInput" type="time" v-model="editValue"></b-form-input>
      </b-modal>
      <b-modal ref="editNotesModal" title="Edit Notes" @ok="updateSignIn" @shown="focusNotesInput">
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
					key: "sign_in"
				},
				{
					label: "End",
					key: "sign_out"
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
				if(!isNaN(Number.parseFloat(items[x].hours))){
					this.subtotal += Number.parseFloat(items[x].hours);
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
		timeStampDiff(sign_in, sign_out){
			var msign_in = moment(sign_in);
			var msign_out = moment(sign_out);
			var hours = msign_out.diff(msign_in)/3600;
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
    updateSignIn() {
      var sign_in = { sign_in_index: this.editItem.sign_in_index };
      if(this.editField == "notes"){
        sign_in[this.editField] = this.editValue;
      }
      else{
        sign_in[this.editField] = this.editItem.date + " " + this.editValue;
      }
      this.$http.patch('/sign_in/'+sign_in.id, sign_in).then(() =>
        {
          this.$emit('update');
        });
    }
  },
  watch: {	
  }
}
</script>
