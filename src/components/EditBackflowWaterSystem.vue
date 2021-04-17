<template>
    <div>
        <TopMenu></TopMenu>
        <EditBackflowWaterSystemForm :backflow_water_system_id="backflow_water_system_id"></EditBackflowWaterSystemForm>
        <b-button @click="$router.push('/backflow_water_systems')">Done</b-button>
    </div>
</template>
<script>
import TopMenu from './TopMenu'
import EditBackflowWaterSystemForm from './EditBackflowWaterSystemForm'
export default {
    name: 'EditBackflowWaterSystem',
    components: {
       TopMenu,
       EditBackflowWaterSystemForm
    },
    props: {
        backflow_water_system_id: {default: null}
    },
};
</script>

