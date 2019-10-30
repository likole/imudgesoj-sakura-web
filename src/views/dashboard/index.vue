<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import userDashboard from './user'

export default {
  name: 'Dashboard',
  components: { userDashboard },
  data() {
    return {
      currentRole: 'userDashboard'
    }
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>
