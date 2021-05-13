<template>
    <div>
        <TopMenu></TopMenu>
        <EditBackflowAssemblyForm :backflow_assembly_id="backflow_assembly_id"></EditBackflowAssemblyForm>
    </div>
</template>
<script>
import EditBackflowAssemblyForm from './EditBackflowAssemblyForm';
export default {
    name: 'EditBackflowAssembly',
    components: {
        EditBackflowAssemblyForm
    },
    props: {
        backflow_assembly_id: {default: null}
    },
};
</script>

