<template>
  <div>
    <TopMenu></TopMenu>
    <header>
      {{ title }}
    </header>
    <main>
      <b-table :items="items" :fields="fields"   footer>
        <template slot="sort_order" slot-scope="data">
          <b-form-select
            :options="sort_options"
						@input="save(data.item)"
            v-model="data.item.sort_order"
          >
          </b-form-select>
        </template>
        <template slot="name" slot-scope="data">
          <b-form-input
            type="text"
						@change="save(data.item)"
            v-model="data.item.name"
          >
          </b-form-input>
        </template>
        <template slot="relation" slot-scope="data">
          <b-form-select
            multiple
            :options="relations"
            value-field="id"
            text-field="name"
            v-model="data.item.order_statuses"
          >
          </b-form-select>
        </template>
        <template slot="notes" slot-scope="data">
          <b-form-input
            type="text"
						@change="save(data.item)"
            v-model="data.item.notes"
          >
          </b-form-input>
        </template>
        <template slot="default" slot-scope="data">
          <input type="radio"
            name="default_item"
            @change="saveDefault"
            :value="data.item.id"
            v-model="default_item"
            />
            
        </template>
        <template slot="delete" slot-scope="data">
          <img src="@/assets/delete.png" @click.stop="deleteItem(data.item)" fluid alt="-" style="width:20px;cursor:pointer;"/>
        </template>
      </b-table>
      <img src="@/assets/add.png" @click.stop="addItem" fluid alt="-" style="width:20px;cursor:pointer;" />
    </main>
  </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
  name: 'Edit',
  components: {
    'TopMenu': TopMenu,
  },
  data () {
    return {
      resource : 'Loading...',
      default_item: null,
      settings: {},
      items: [],
      relations: [],
      fields: [
        {
          key: 'sort_order',
          label: 'Sort Order'
        },
        {
          key: 'name',
          label: 'Name'
        },
        {
          key: 'notes',
          label: 'Notes'
        },
        {
          key: 'default',
          label: 'Default'
        },
        {
          key: 'delete',
          label: 'Delete'
        }
      ]
    }
  },
  created () {
    this.$http.get('/settings').then(response => {
      this.settings = response.data
      this.load();
    })
  },
  methods: {
    load (){
      this.resource = this.$route.path;
      if(this.resource == '/order_actions'){
        this.$http.get('/order_statuses').then(response => {
          this.relations = response.data
        })
        this.fields.push({
          key: 'relation',
          label: 'Statuses'
        })
      }
      this.$http.get(this.resource).then(response => {
        this.items = response.data
        if(this.resource == '/order_actions'){
          for(var i = 0; i < this.items.length; i++){
            var statuses = [];
            for(var s = 0; s < this.items[i].order_statuses.length; s++){
              statuses.push(this.items[i].order_statuses[s].id);
            }
            this.items[i].order_statuses = statuses;
          }
        }
      })
      this.default_item = this.settings['default_' + this.singular + '_id'];
    },
    save (item) {
      if(item.name == null){
        return;
      }
      if(item.id == null){
        this.$http.post('/'+this.singular, item).then( response => {
          item.id = response.data.id;
        })
      }
      else{
        this.$http.patch('/'+this.singular + '/' + item.id, item);
      }
    },
    saveDefault() {
      var settings = {};
      settings['default_' + this.singular + '_id'] = this.default_item
      this.$http.patch('/settings', settings)
    },
    addItem(){
      var item = {
        id: null,
        sort_order: null,
        name: null
      }
      this.items.push(item);
    },
    deleteItem(item){
      this.$http.delete('/'+this.singular + '/' + item.id);
      this.items = this.items.filter(i => i.id !== item.id);
    }
  },
  computed: {
    singular(){
        if(this.resource.substr(this.resource.length-3) == 'ies'){
          return this.resource.substr(1,this.resource.length-4) + 'y'; 
        }
        else{
          if(this.resource.substr(this.resource.length-3) == 'ses'){
            return this.resource.substr(1,this.resource.length-3);
          }
          else{
            return this.resource.substr(1,this.resource.length-2);
          }
        }
    },
    title(){
      var title = this.resource.replace(/_/, ' ');
      title = title.replace(/\//, '');
      title = title.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
      return title
    },
    sort_options() {
			var options = [];
			for(var x=1;x<=this.items.length;x++){
				options.push(x);
			}
			return options;
		}
  },
  watch:{
    $route (to, from){
        this.load()
    }
} 
}
</script>