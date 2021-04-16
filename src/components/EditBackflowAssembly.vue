<template>
    <div>
        <TopMenu></TopMenu>
        <EditBackflowAssemblyForm :backflow_assembly_id="backflow_assembly_id"></EditBackflowAssemblyForm>
    </div>
</template>
<script>
import TopMenu from './TopMenu';
import EditBackflowAssemblyForm from './EditBackflowAssemblyForm';
export default {
    name: 'EditBackflowAssembly',
    components: {
        TopMenu,
        EditBackflowAssemblyForm
    },
    props: {
        backflow_assembly_id: {default: null}
    },
};
</script>

