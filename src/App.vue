<template>
    <div class="nav">
        <container class="grid grid-cols-6 formysanity">
            <RouterLink to="/" class="col-span-2"
                ><div>
                    <img
                        src="./pics/swau_logo.png"
                        alt="Southwestern Adventist
                University"
                        class="Title-text text-2xl text-black flex span text-center h-20"
                    /></div
            ></RouterLink>
            <div></div>
            <RouterLink
                v-if="authenticated.id"
                to="/Clockin"
                class="bg-gray-400 hover:bg-gray-500 text-3xl content-center text-center"
                >Clock-In</RouterLink
            >
            <div v-else></div>
            <RouterLink
                to="/Contact"
                class="bg-gray-400 hover:bg-gray-500 text-3xl content-center text-center"
                >Contact</RouterLink
            >
            <RouterLink
                to="/Profile"
                class="bg-gray-400 hover:bg-gray-500 text-3xl content-center text-center"
                >Profile</RouterLink
            >
        </container>
        <RouterView />
    </div>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { ref, onMounted } from 'vue'

interface User {
    id: string
    fname: string
    lname: string
    username: string
    password: string
    scope: string
}

const authenticated = ref({} as User)
let token = ''

onMounted(() => {
    token = sessionStorage.getItem('token') || ''
    if (!token) {
        return
    }
    const td = jwtDecode(token) as User
    authenticated.value = {
        id: td.id,
        fname: td.fname,
        lname: td.lname,
        username: td.username,
        password: '',
        scope: td.scope
    }
})
</script>
