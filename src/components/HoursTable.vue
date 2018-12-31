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
        <template slot="sign_in_time" slot-scope="data">
          <span @click.stop="edit('sign_in_time',data.item)">
            <span v-if="data.item.sign_in_time">
              {{ data.item.sign_in_time }}
            </span>
            <span v-else>
              add
            </span>
          </span>
        </template>
        <template slot="sign_out_time" slot-scope="data">
          <span @click.stop="edit('sign_out_time',data.item)">
            <span v-if="data.item.sign_out_time">
              {{ data.item.sign_out_time }}
            </span>
            <span v-else>
              add
            </span>
          </span>
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
					key: "name"
				},
				{
					label: "Work Order",
					key: "job"
				},
				{
					label: "Client Name",
					key: "client_name"
				},
				{
					label: "Date",
					key: "date"
				},
				{
					label: "Start",
					key: "sign_in_time"
				},
				{
					label: "End",
					key: "sign_out_time"
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
				//console.log(items[x].hours);
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
      console.log(sign_in);
      $.ajax({
          url: 'php/hours.php',
          type: 'PATCH',
          data: sign_in
        }).done(data =>
        {
          this.$emit('update');
        });
    }
  },
  watch: {	
  }
}
</script>
