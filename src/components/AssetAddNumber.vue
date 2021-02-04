<template>
    <div>
        <img src="@/assets/add.png" v-b-tooltip.hover title="Add" @click.stop="showAdd" alt="x" style="width:20px;float:left;" />
        <b-modal ref="add-modal" title="Add To Number" @ok="add">
            <b-container>
                <b-row>
                    <b-col v-if="parent_key">
                        <b-form-group label="Parent">
                            <b-form-select
                                v-model="my_item[parent_key]"
                                :options="parents"
                                value-field="id"
                                text-field="name"
                                @change="parentSelected"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Name">
                            <b-form-input
                                type="text"
                                v-model="my_item.name"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Number">
                            <b-form-select
                                :options="free_numbers"
                                v-model="my_item.number"
                            >
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Notes">
                            <b-form-input
                                type="text"
                                v-model="my_item.notes"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Sort">
                            <b-form-input
                                type="text"
                                v-model="my_item.sort_order"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-container>
        </b-modal>
    </div>
</template>
<script>
export default {
    name: 'AssetAddNumber',
    props: {
        number_type: {required: true},
        numbers_type: {required: true},
        parent_type: {default: null},
        parent_key: {default: null},
        item: {default: null}
    },
    data () {
        return {
            parents: [],
            numbers: [],
            my_item: [],
            free_numbers: []
        };
    },
    methods: {
        getLists() {
            if(this.parent_type){
                    this.$http.get('/' + this.parent_type).then(response => {
                    this.parents = response.data.data;
                    this.parentSelected();
                });
            }
            this.$http.get('/' + this.numbers_type).then(response => {
                this.numbers = response.data.data;
                this.parentSelected();
            });
        },
        showAdd() {
            this.getLists();
            this.my_item = {
                id: null,
                name: null,
                number: null,
                sort_order: null
            };
            if(this.item){
                this.my_item = {
                    ...this.item
                }
            }
            this.parentSelected();
            this.$refs['add-modal'].show()
        },
        add(event) {
            event.preventDefault();
            if(!this.my_item.name){
                alert('Name required');
                return;
            }
            if(!this.my_item.number){
                alert('Number required');
                return;
            }
            this.$http.post('/' + this.number_type,this.my_item).then((response) => {
                this.$emit('reload',{list: this.numbers_type, key: this.number_type+'_id', value: response.data.data.id});
                this.$refs['add-modal'].hide();
            });
        },
        parentSelected() {
            this.free_numbers = [];
            for(let x=1;x<10;x++){
                if(!this.parent_key){
                    if(!this.numbers.filter(n => (n.number == x)).length){
                        this.free_numbers.push(x+'');
                    }
                }
                else{
                    if(!this.numbers.filter(n => (n.number == x && n[this.parent_key] == this.item[this.parent_key])).length){
                        this.free_numbers.push(x+'');
                    }
                }
            }
        }
    }
};
</script>

