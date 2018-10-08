<template>
    <div>
        <b-container>
            <b-row>
                <b-col>
                    <b-form-group label="Property Name">
                      <b-form-input
                        type="text"
                        v-model="property.name"
                        required
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
                        v-model="property.activity_level_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Property Type">
                      <b-form-select
                        :options="property_types"
                        value-field="id"
                        text-field="name"
                        v-model="property.property_type_id">
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
                        v-model="property.primary_contact_id">
                      </b-form-select>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Work Property">
                      <b-form-checkbox
                        v-model="property.work_property">
                      </b-form-checkbox>
                    </b-form-group>
                </b-col>
                </b-col>
                    <b-form-group label="Phone_number">
                      <b-form-input
                        type="text"
                        v-model="property.phone_number"
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
                        v-model="property.address"
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
                        v-model="property.address2"
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
                        v-model="property.city"
                        required
                        placeholder="Salt Lake City">
                      </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="State">
                      <b-form-input
                        type="text"
                        v-model="property.state"
                        required
                        placeholder="UT">
                      </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group label="Zip">
                      <b-form-input
                        type="text"
                        v-model="property.zip"
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
                        v-model="property.notes"
                        :rows="3"
                        :max-rows="6"
                        placeholder="Notes about this contact.">
                      </b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-button variant="danger" size="sm" >Remove Property</b-button>
                <b-button variant="danger" size="sm" >Delete Property</b-button>
            </b-row>
        </b-container>
    </div>
</template>
<script>
export default {
    name: 'EditProperty',
    props: {
        property: {default: null},
        activity_levels: {required: true},
        property_types: {required: true}
    },
    data () {
        return {
            contacts: [],
            showSaveFailed: false,
            showSaveSuccess: false,
            properties: [],
            property_tab_index: 0
        }
    },
}
</script>