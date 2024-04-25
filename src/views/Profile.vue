<template>
    <div v-if="!authenticated.id">
        <div
            class="container mx-auto max-w-prose flex flex-col my-50 items-center p-2 min-h-screen gap-4"
        >
            <div class="text-4xl">Login</div>
            <div>
                <label for="username" class="text-3xl flex mt-2"
                    >Username</label
                >
                <input
                    id="username"
                    v-model="authenticated.username"
                    class="rounded-lg"
                    type="text"
                    name="username"
                />
                <label for="password" class="text-3xl flex mt-1"
                    >Password</label
                >
                <input
                    id="password"
                    v-model="authenticated.password"
                    class="rounded-lg"
                    type="password"
                    name="password"
                />
                <button
                    class="items-center justify-center mt-4 flex bg-blue-600 hover:shadow-lg focus:shadow-lg hover:brightness-90 rounded-lg w-50 text-xl text-white p-2"
                    @click="login"
                >
                    Login
                </button>
            </div>
            <RouterLink
                to="/Signup"
                class="text-xl bg-blue-600 rounded-lg text-white hover:shadow-lg focus:shadow-lg hover:brightness-90 items-center justify-center flex w-50 p-2"
                >Sign-up</RouterLink
            >
        </div>
    </div>
    <div v-else>Profile Page</div>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { ref, onMounted } from 'vue'

interface User {
    id: string
    name: string
    username: string
    password: string
    scope: string[]
}

const user = ref({
    scope: [] as string[]
} as User)
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
        name: td.name,
        username: td.username,
        password: '',
        scope: td.scope
    }
})

const login = async () => {
    console.log('logging in')
    try {
        const response = await fetch('/api/v1/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authenticated.value)
        })
        const data = await response.json()
        token = data.token
        sessionStorage.setItem('token', token)
        const td = jwtDecode(token) as User
        authenticated.value = {
            id: td.id,
            name: td.name,
            username: td.username,
            password: '',
            scope: td.scope
        }
        console.log('logged in', authenticated.value)
        user.value = {
            name: '',
            username: '',
            password: '',
            scope: [] as string[]
        } as User
    } catch (error) {
        console.error('error logging in', error)
        alert('Invalid credentials')
    }
}
</script>
