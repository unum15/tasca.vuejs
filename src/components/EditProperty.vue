<template>
    <div>
        <b-container>
            <b-row>
                <b-col>
                    <b-form-group label="Property Name">
                      <b-form-input
                        type="text"
                        v-model="my_property.name"
                        required
                        :class="my_property.name == null ? 'invalid' : ''"
                        placeholder="Home">
                      </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Activity Level">
                      <b-form-select
                        :options="activity_levels"
                        value-field="id"
                        text-field="name"
                        required
                        :class="my_property.activity_level_id == null ? 'invalid' : ''"
                        v-model="my_property.activity_level_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Property Type">
                      <b-form-select
                        :options="property_types"
                        value-field="id"
                        text-field="name"
                        required
                        :class="my_property.property_type_id == null ? 'invalid' : ''"
                        v-model="my_property.property_type_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Primary Contact">
                      <b-form-select
                        :options="contacts"
                        value-field="id"
                        text-field="name"
                        v-model="my_property.primary_contact_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Work Property">
                      <b-form-checkbox
                        v-model="my_property.work_property">
                      </b-form-checkbox>
                    </b-form-group>
                </b-col>
                </b-col>
                    <b-form-group label="Phone_number">
                      <b-form-input
                        type="text"
                        v-model="my_property.phone_number"
                        placeholder="555 555-5555">
                      </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Address Line 1">
                      <b-form-input
                        type="text"
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
                        v-model="my_property.address2"
                        required
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
                        v-model="my_property.city"
                        required
                        placeholder="Salt Lake City">
                      </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="State">
                      <b-form-input
                        type="text"
                        v-model="my_property.state"
                        required
                        placeholder="UT">
                      </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Zip">
                      <b-form-input
                        type="text"
                        v-model="my_property.zip"
                        required
                        placeholder="84555">
                      </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-form-group label="Notes">
                      <b-form-textarea
                        v-model="my_property.notes"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Notes about this contact.">
                      </b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-button variant="danger" size="sm" @click="deleteProperty" >Delete Property</b-button>
            </b-row>
        </b-container>
    </div>
</template>
<script>
export default {
    name: 'EditProperty',
    props: {
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
    },
    methods: {
        deleteProperty() {
            this.$http.delete('/property/' + this.my_property.id);
        }
    },
    watch: {
        my_property:{
          handler(new_property, old_property) {
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
                if(old_property.id === undefined){
                    return;
                }
                this.$http.patch('/property/' + this.my_property.id,this.my_property);
            }
          },
          deep: true
        }
    }
}
</script>