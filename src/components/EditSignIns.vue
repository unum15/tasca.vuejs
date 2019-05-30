<template>
    <b-card title="Sign Ins" class="mb-2">
        <div v-for="sign_in in sign_ins" :key="sign_in.id">
            <EditSignIn
                :sign_in="sign_in"
                @remove-sign-in="removeSignIn"
            >
            </EditSignIn>
        </div>
        <b-button variant="secondary" @click="newSignIn()" v-if="false">Add Sign In</b-button>
    </b-card>
</template>
<script>
import EditSignIn from './EditSignIn';
export default {
  name: 'EditSignIns',
  components: {
    'EditSignIn': EditSignIn
  },
  props: {
    task_date_id: {required: true}
  },
  data() {
    return {
        sign_ins: [],
    }
  },
  created() {
    this.$http.get('/sign_ins?task_date_id=' + this.task_date_id).then(response => {
      this.sign_ins = response.data
    })
  },
  methods: {
    newSignIn: function(){
      var sign_in = {
        id: null,
        sign_in: null,
        sign_out: null,
        notes: null,
        task_date_id: this.task_date_id
      };
      this.sign_ins.push(sign_in);
    },
    removeSignIn (sign_in) {
      this.sign_ins = this.sign_ins.filter(d => d.id !== sign_in.id);
    },
  }
}

</script>