<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ role.name }}
        </h1>
        <main>
            <b-container fluid="md">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Role" label-cols="4" label-align="right">
                            <b-form-select
                                v-model="role_id"
                                :options="roles"
                                value-field="id"
                                text-field="name"
                                @change="changeRole"
                            >
                            </b-form-select>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>
                <div v-if="role_id">
                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Name" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="role.name"
                                @change="save"
                                type="text"
                                :state="role.name != null"
                                required
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Display Name" label-cols="4" label-align="right">
                            <b-form-input
                                v-model="role.display_name"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col md="6">
                        <b-form-group label="Description" label-cols="4" label-align="right">
                            <b-form-textarea
                                v-model="role.description"
                                @change="save"
                                type="text"
                            >
                            </b-form-textarea>
                        
                        </b-form-group>
                    </b-col>
                </b-form-row>

                <b-form-row>
                    <b-col>
                        <b-form-group label="Permissions">
                            <b-form-checkbox-group
                                @input="savePermissions"
                                v-model="selected_permissions"
                                :options="permissions"
                                value-field="id"
                                text-field="name"
                            >
                          </b-form-checkbox-group>
                        </b-form-group>
                    </b-col>
                </b-form-row>
                </div>

                <b-form-row>
                    <b-col>
                        <b-button @click="addRole">Add Role</b-button>
                    </b-col>
                </b-form-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditRole',
    components: {
        'TopMenu': TopMenu
    },
    data () {
        return {
            role: { id: null },
            roles: [],
            role_id: null,
            permissions: [],
            selected_permissions: []
        };
    },
    created () {
        this.getRoles();
        this.$http.get('/permissions').then(response => {
            this.permissions = response.data.data;
        });
    },
    methods: {
        getRoles(){
            this.$http.get('/roles?includes=permissions').then(response => {
                this.roles = response.data.data;
            });
        },
        save () {
            this.$http.patch('/role/' + this.role.id, this.role);
        },
        savePermissions() {
            this.$http.put('/role/' + this.role.id + '/permissions', {'permissions': this.selected_permissions}).then(() => {this.getRoles();});
        },
        changeRole(){
            let roles = this.roles.filter(r => r.id == this.role_id);
            if(!roles.length){
                return;
            }
            this.role = roles[0];
            this.selected_permissions = [];
            this.role.permissions.forEach( p => {
                this.selected_permissions.push(p.id);
            });
        },
        addRole(){
            let name = prompt('Role Name?');
            if((!name)){
                return;
            }
            this.$http.post('/role',{name})
                .then(() => {
                    this.getRoles();
                });
        }
    }
};
</script>

