<template>
    <div>
        <EditBackflowAssemblyForm :backflow_assembly_id="backflow_assembly_id"></EditBackflowAssemblyForm>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
import EditBackflowAssemblyForm from './EditBackflowAssemblyForm'
export default {
    name: 'EditBackflowAssembly',
    components: {
        EditBackflowAssemblyForm,
        TopMenu
    },
    props: {
        backflow_assembly_id: {default: null}
    },
    data () {
        return {
        };
    }
};
</script>

