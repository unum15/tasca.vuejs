<template>
    <div>
        <TopMenu></TopMenu>
        <h1>
            {{ part.name }}
        </h1>
        <main>
            <b-container>
                <b-row>
                    <b-col>
                        <b-form-group label="Name">
                            <b-form-input
                                v-model="part.name"
                                @change="save"
                                type="text"
                                :state="part.name != null"
                                required
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="On Hand">
                            <b-form-input
                                v-model="part.on_hand"
                                @change="save"
                                type="number"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Notes">
                            <b-form-input
                                v-model="part.notes"
                                @change="save"
                                type="text"
                            >
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>               <b-row>
                    <b-col>
                        <b-button @click="$router.push('/parts')">Done</b-button>
                    </b-col>
                </b-row>
            </b-container>
        </main>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
export default {
    name: 'EditPart',
    components: {
        'TopMenu': TopMenu
    },
    props: {
        part_id: {default: null}
    },
    data () {
        return {
            part: { id: null },
        };
    },
    created () {
        if(this.part_id !== null) {
            this.$http.get('/part/' + this.part_id).then(response => {
                this.part = response.data.data;
            });
        }
    },
    methods: {
        save () {
            if((!this.part.name)){
                return;
            }
            if(this.part.id === null){
                this.$http.post('/part',this.part)
                    .then((results) => {
                        this.part.id = results.data.data.id;
                    });
            }
            else{
                this.$http.patch('/part/' + this.part.id, this.part);
            }
        }
    }
};
</script>

