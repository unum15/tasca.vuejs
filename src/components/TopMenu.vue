<template>
    <div>
        <b-navbar toggleable="md" type="dark" variant="dark">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#">Tasca</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
                <b-nav-item href="#/Client">New Client</b-nav-item>
                <b-nav-item href="#/Clients">Clients</b-nav-item>
                <b-nav-item href="#/Contacts">Contacts</b-nav-item>
                <b-nav-item href="#/Properties">Properties</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown right>
                    <template slot="button-content">
                      <em>User</em>
                    </template>
                    <b-dropdown-item href="#">Profile</b-dropdown-item>
                    <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
</template>
<script>
    export default {
        name: 'TopMenu',
        methods: {
            signOut(){
				console.log("signout");
				this.$router.push('/');
				this.$http.post('/unauth')
				.then(request => {
					localStorage.clear();
				})
			},
        }
    };
</script>