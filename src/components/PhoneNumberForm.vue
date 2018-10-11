                    <div class="col">
                      <b-form-group label="Phone Number Type">
                        <b-form-select
                          :options="phone_number_types"
                          value-field="id"
                          text-field="name"
                          v-model="phone_number.phone_number_type_id">
                        </b-form-select>
                      </b-form-group>
                    </div>
                    <div class="col">
                      <b-form-group label="Phone Number">
                        <b-form-input
                          type="text"
                          v-model="phone_number.phone_number"
                          required
                          placeholder="555 555-5555">
                        </b-form-input>
                      </b-form-group>
                    </div>