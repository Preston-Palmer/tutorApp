<template>
    <div
        class="container mx-auto max-w-prose flex flex-col justify-center items-center p-2 min-h-screen gap-4"
    >
        <div class="text-6xl">Login</div>
        <fieldset class="flex border rounded-lg flex-col gap-0.5 text-xl">
            <legend class="text-4xl mx-20 my-1">Roles</legend>
            <label class="flex items-center mx-2"
                ><input
                    v-model="user.scope"
                    class="rounded-lg"
                    type="checkbox"
                    value="admin"
                />
                <span class="mx-1">Admin</span>
            </label>
            <label class="flex items-center mx-2">
                <input
                    v-model="user.scope"
                    class="rounded-lg"
                    type="checkbox"
                    value="tutor"
                /><span class="mx-1">Tutor</span>
            </label>
            <label class="flex items-center mx-2">
                <input
                    v-model="user.scope"
                    class="rounded-lg"
                    type="checkbox"
                    value="student"
                /><span class="mx-1">Student</span>
            </label>
        </fieldset>
    </div>
</template>
<!-- I want profile to be the login page if not authenticated. Should the login page be when you open it? I got it,
It will show the tutors and who is available. So if not authenticated it will take you to the page where the tutors are and basically be a lesser version
of a student view
Then we have the tutor view which I have documented. Then for the users that are of tutor or whatever is specified by the scope which will be a radio
they will send back to the database to create the same id of the tutor/admin/student. This will then create the same ID for the tutor and admin as the user
and the user will be none the wiser -->

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { nanoid } from 'nanoid'
import { ref, onMounted } from 'vue'

interface User {
    id: string
    name: string
    username: string
    password: string
    scope: string[]
}
const users = ref({} as User[])
const user = ref({ scope: [] as string[] } as User)
const authenticated = ref({} as User)
let token = ''

const login = async () => {
    console.log('login')
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
            password: td.password,
            scope: td.scope
        }
        fetchUsers()
        console.log('logged in', authenticated.value)
        user.value = {
            name: '',
            username: '',
            password: '',
            scope: [] as string[]
        } as User
    } catch (error) {
        console.error('login error', error)
    }
}
const fetchUsers = async () => {
    console.log('fetching users')
    const response = await fetch('/api/v1/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log('assigned users')
    users.value = await response.json()
    console.log('fetched users', users.value)
}
//Originally for a userDialog box, but now for an inset input
const addUser = async () => {
    console.log('adding user')
    user.value.id = nanoid()
    console.log('posting to /api/v1/users')
    const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user.value)
    })
    const data = await response.json()
    users.value.push(data)
    console.log('finished posting to /api/v1/users', users.value)
    user.value = {
        scope: [] as string[]
    } as User
}
const deleteUser = async (id: string) => {
    await fetch(`/api/v1/users/${id}`, {
        method: 'DELETE'
    })
    fetchUsers()
}
const logout = () => {
    sessionStorage.removeItem('token')
    authenticated.value = {
        id: '',
        name: '',
        username: '',
        password: '',
        scope: []
    }
    users.value = []
}
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
    fetchUsers()
})
</script>
