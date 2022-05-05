export default {
    data () {
        return {
                filters: {},
                filters_name: null,            
        };
    },
    methods: {
        filtersInit(name,filters){
            this.filters_name = name;
            filters.forEach(f => (this.filters[f] = ''));
            this.$store.dispatch('getFilters',{name:this.filters_name}).then((filters) => this.filtersLoad(filters));
        },
        filterColumns(items){
            let filtered_items = items;
            Object.entries(this.filters).forEach(([key,expression]) => {
                if(expression){
                    let formatter = null;
                    if (this.fields) {
                        let fields = this.fields.filter(f => (f.key == key));
                        if (fields.length) {
                            formatter = fields[0].formatter;
                        }
                    }

                    var regex = new RegExp(expression, "i");
                    filtered_items = filtered_items.filter(item => {
                        let keys = key.split('.');
                        let value = item;
                        for(var key_num = 0; key_num < keys.length; key_num++){
                            if(value){
                                value = value[keys[key_num]];
                            }
                        }
                        if(typeof(value) == 'boolean'){
                            if(((expression == "yes")&&(value == false))||((expression == "no")&&(value == true))){
                                return false;
                            }
                            return true;
                        }
                        if (formatter) {
                            value = this[formatter](value,key,item);
                        }
                        if(!value){
                            value = "";
                        }
                        if(typeof value === 'number'){
                           value = value.toString();
                        }
                        return value.match(regex) !== null;
                    });
                }
            });
            this.filtersSave();
            return filtered_items;
        },
        filtersClear(){
            Object.entries(this.filters).forEach(([k]) => (this.filters[k] = ''));
            this.filtersUpdated();
        },
        filtersSave(){
            this.$store.dispatch('saveFilters',{filters: this.filters,name: this.filters_name});
        },
        filtersLoad(filters){
            if(filters){
                Object.entries(this.filters).forEach(([k]) => (this.filters[k] = filters[k] ? filters[k] : ''));
            }
            this.filtersUpdated();
        },
  }
};