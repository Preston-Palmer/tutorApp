<template>
    <form
        class="container mx-auto max-w-prose flex flex-col my-50 items-center p-2 min-h-screen gap-4"
    >
        <div>
            <div class="text-5xl gap-2 text-center">Sign-up</div>
            <label for="fname" class="text-3xl flex mt-5">First name</label>
            <input
                id="fname"
                v-model="user.fname"
                class="rounded-lg"
                type="text"
                name="fname"
                required
            />
            <label for="lname" class="text-3xl flex mt-2">Last name</label>
            <input
                id="lname"
                v-model="user.lname"
                class="rounded-lg"
                type="text"
                name="lname"
                required
            />
            <label for="username" class="text-3xl flex mt-2">Username</label>
            <input
                id="username"
                v-model="user.username"
                class="rounded-lg"
                type="text"
                name="username"
                required
            />
            <label for="password" class="text-3xl flex mt-2">Password</label>
            <input
                id="password"
                v-model="user.password"
                class="rounded-lg"
                type="password"
                name="password"
                required
            />
            <label for="subject" class="text-3xl flex mt-2">Subject</label>
            <input
                id="subject"
                v-model="tutor.subject"
                placeholder="use for tutors"
                class="rounded-lg"
                type="text"
                name="subject"
            />
            <label for="availability" class="text-3xl flex mt-2"
                >Availability</label
            >
            <input
                id="availability"
                v-model="tutor.availability"
                placeholder="use for tutors"
                class="rounded-lg"
                type="text"
                name="availability"
            />
        </div>
        <fieldset class="flex border rounded-lg flex-col gap-0.5 text-xl">
            <legend class="text-4xl mx-20 my-1">Roles</legend>
            <label class="flex items-center mx-2">
                <input
                    v-model="user.scope"
                    class="rounded-lg"
                    type="radio"
                    value="admin"
                    name="roles"
                    required
                />
                <span class="mx-1">Admin</span>
            </label>
            <label class="flex items-center mx-2">
                <input
                    v-model="user.scope"
                    class="rounded-lg"
                    type="radio"
                    value="tutor"
                    name="roles"
                />
                <span class="mx-1">Tutor</span>
            </label>
            <label class="flex items-center mx-2">
                <input
                    v-model="user.scope"
                    class="rounded-lg"
                    type="radio"
                    value="student"
                    name="roles"
                />
                <span class="mx-1">Student</span>
            </label>
        </fieldset>
        <RouterLink
            to="/Profile"
            class="text-center bg-blue-600 hover:shadow-lg focus:shadow-lg hover:brightness-110 rounded-lg w-50 text-xl text-white p-2"
            @click="addUser"
        >
            Add Account
        </RouterLink>
    </form>
</template>
<!-- Definetly need to make sure they can't make a user with the same username -->

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
    fname: string
    lname: string
    username: string
    password: string
    scope: string
}

interface Tutor {
    id: string
    fname: string
    lname: string
    subject: string
    availability: string
}

const users = ref({} as User[])
const user = ref({} as User)
const tutor = ref({} as Tutor)
const authenticated = ref({} as User)
let token = ''

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
    user.value.fname = user.value.fname
        .split(' ')
        .map((l: string) => l[0].toUpperCase() + l.substring(1))
        .join(' ')
    user.value.lname = user.value.lname
        .split(' ')
        .map((l: string) => l[0].toUpperCase() + l.substring(1))
        .join(' ')
    user.value.id = nanoid()
    console.log('posting to /api/v1/users')
    console.log('value of user' + JSON.stringify(user.value.scope))
    const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user.value)
    })
    await response.json()
    // users.value.push(data)
    console.log('finished posting to /api/v1/users', users.value)

    tutor.value.id = user.value.id
    tutor.value.fname = user.value.fname
    tutor.value.lname = user.value.lname
    if (user.value && user.value.scope == 'tutor') {
        console.log('posting to /api/v1/tutors')
        const response = await fetch('/api/v1/tutors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tutor.value)
        })
        await response.json()
        console.log('finished posting to /api/v1/tutors', tutor.value)
    }
}
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
    fetchUsers()
})
</script>
