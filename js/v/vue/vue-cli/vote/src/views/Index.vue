 <template>
    <div>
        <div v-if="user">
        <h2>欢迎, {{user.name}}, <button @click="logout">退出</button></h2>
        <router-link to="/create">创建投票</router-link>
        </div>

        <div v-else>
        <router-link to="/login">登陆</router-link>
        <router-link to="/register">注册</router-link>
        </div>
    </div>
</template>

<script>
export default {
     data() {
        return {
            user: null,
        }
    },
    methods: {
        async logout() {
            await api.get('/logout')
            this.user = null
        }
    },
    async mounted() {
        try {
            var response = await api.get('/userinfo')
            this.user = response.data
        } catch(e) {
            // this.$router.push('/login')
        }
    }   
}
</script>