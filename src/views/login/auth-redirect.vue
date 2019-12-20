<script>
export default {
  name: 'AuthRedirect',
  created() {
    const query = this.$route.query
    if (query) {
      this.$store.dispatch('user/oauthLogin', query.token)
        .then(() => {
          this.$router.push({ path: '/' })
        })
    }
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
