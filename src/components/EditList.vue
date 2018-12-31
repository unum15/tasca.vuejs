<template>
  <div>
    <TopMenu></TopMenu>
    <header>
    </header>
    <main>
      <b-table :items="items" :fields="fields">
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
						@input="save(data.item)"
            v-model="data.item.name"
          >
          </b-form-input>
        </template>
        <template slot="notes" slot-scope="data">
          <b-form-input
            type="text"
						@input="save(data.item)"
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
      </b-table>
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
      resource : null,
      default_item: null,
      settings: {},
      items: [],
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
      this.$http.get(this.resource).then(response => {
        this.items = response.data
      })
      this.default_item = this.settings['default_' + this.singular + '_id'];
    },
    save (item) {
      this.$http.patch('/'+this.singular + '/' + item.id, item);
    },
    saveDefault() {
      var settings = {};
      settings['default_' + this.singular + '_id'] = this.default_item
      this.$http.patch('/settings', settings)
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