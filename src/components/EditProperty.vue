<template>
    <div>
        <b-container fluid>
            <b-row>
                <b-col cols="8">
                    <b-container fluid>
                        <b-row>
                            <b-col>
                                <b-form-group label="Property Name">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.name"
                                    required
                                    :state="my_property.name != null"
                                    placeholder="Home">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="1">
                                <b-form-group label="Abbreviation">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.abbreviation"
                                    >
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Activity Level">
                                  <b-form-select
                                    @change="save"
                                    :options="activity_levels"
                                    value-field="id"
                                    text-field="name"
                                    required
                                    :state="my_property.activity_level_id != null"
                                    v-model="my_property.activity_level_id">
                                  </b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Property Type">
                                  <b-form-select
                                    @change="save"
                                    :options="property_types"
                                    value-field="id"
                                    text-field="name"
                                    required
                                    :state="my_property.property_type_id != null"
                                    v-model="my_property.property_type_id">
                                  </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Work Property">
                                  <b-form-checkbox
                                    @change="save"
                                    v-model="my_property.work_property">
                                  </b-form-checkbox>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Billing Property">
                                  <b-form-checkbox
                                    @change="save"
                                    v-model="my_property.billing_property">
                                  </b-form-checkbox>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Phone Number">
                                  <b-form-input
                                    type="tel"
                                    @change="save"
                                    v-model="my_property.phone_number"
                                    placeholder="555-555-5555">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Address Line 1">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.address1"
                                    placeholder="123 Main Street">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Address Line 2">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.address2"
                                    placeholder="Suite 100">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="City">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.city"
                                    required
                                    :state="my_property.city != null"
                                    placeholder="Salt Lake City">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="State">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.state"
                                    required
                                    :state="my_property.state != null"
                                    placeholder="UT">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col>
                                <b-form-group label="Zip">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.zip"
                                    placeholder="84555">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Coordinates">
                                  <b-form-input
                                    type="text"
                                    @change="save"
                                    v-model="my_property.coordinates">
                                  </b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Contacts">
                                    <b-form-checkbox-group
                                        @input="save"
                                        v-model="my_property.contacts"
                                        :options="contacts"
                                        value-field="id"
                                        text-field="name"
                                        >
                                    </b-form-checkbox-group>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col>
                                <b-form-group label="Notes">
                                  <b-form-textarea
                                    v-model="my_property.notes"
                                    @input="save"
                                    :rows="3"
                                    :max-rows="6"
                                    placeholder="Notes about this contact.">
                                  </b-form-textarea>
                                </b-form-group>
                            </b-col>
                        </b-row>
                        <div v-for="unit in my_property.property_units" :key="unit.id">
                            <b-row>
                                <b-col>
                                    <b-form-group label="Name">
                                      <b-form-input
                                        type="text"
                                        @change="saveUnit(unit)"
                                        v-model="unit.name"
                                        required
                                        :state="unit.name != null"
                                        placeholder="A1">
                                      </b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="Address">
                                      <b-form-input
                                        type="text"
                                        @change="saveUnit(unit)"
                                        v-model="unit.number"
                                        placeholder="123">
                                      </b-form-input>
                                    </b-form-group>
                                </b-col>
                                <b-col>
                                    <b-form-group label="Phone">
                                      <b-form-input
                                        type="text"
                                        @change="saveUnit(unit)"
                                        v-model="unit.phone"
                                        placeholder="(801) 555-5555">
                                      </b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <b-form-group label="Coordinates">
                                      <b-form-input
                                        type="text"
                                        @change="saveUnit(unit)"
                                        v-model="unit.coordinates">
                                      </b-form-input>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col>
                                    <b-form-group label="Unit Notes">
                                      <b-form-textarea
                                        v-model="unit.notes"
                                        @input="saveUnit(unit)"
                                        :rows="3"
                                        :max-rows="6"
                                        placeholder="Notes about this unit.">
                                      </b-form-textarea>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </div>
                        <b-row>
                            <b-col>
                                <b-button @click="addUnit" :disabled="my_property == null || my_property.id == null">Add Unit</b-button>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-button variant="danger" size="sm" @click="deleteProperty" >Delete Property</b-button>
                        </b-row>
                    </b-container>
                </b-col>
                <b-col style="text-align:left;" v-if="settings.help_show == 'true'">
                    {{ settings.help_property }}
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
export default {
    name: 'EditProperty',
    props: {
        settings: {required: true},
        property: {required: true},
        activity_levels: {required: true},
        property_types: {required: true},
        contacts: {required: true}
        
    },
    data() {
        return {
            my_property: []
        }
    },
    created() {
        this.my_property = this.property;
        var contacts = [];
        this.my_property.contacts.map( c => {
            if(c){
                contacts.push(c.id);
            }
        });
        this.my_property.contacts = contacts;
    },
    methods: {
        deleteProperty() {
            this.$http.delete('/property/' + this.my_property.id);
            this.$emit('remove-property', this.my_property);
        },
        save() {
            if((this.my_property.name === null) || (this.my_property.activity_level_id === null) || (this.my_property.property_type_id === null)){
              return;
            }
            if(this.my_property.id === null){
              this.$http.post('/property',this.my_property)
                .then((results) => {
                  this.my_property.id = results.data.id;
                })
            }
            else{
                this.$http.patch('/property/' + this.my_property.id,this.my_property);
            }
        },
        addUnit(){
            this.my_property.property_units.push(
                {
                    id: null,
                    property_id: this.my_property.id,
                    name: null,
                    number: null,
                    phone: null,
                    notes: null
                }
            );
        },
        saveUnit(unit) {
            if(unit.name === null){
              return;
            }
            if(unit.id === null){
              this.$http.post('/property_unit',unit)
                .then((results) => {
                  unit.id = results.data.data.id;
                })
            }
            else{
                this.$http.patch('/property_unit/' + unit.id,unit);
            }
        },
    }
}
</script>