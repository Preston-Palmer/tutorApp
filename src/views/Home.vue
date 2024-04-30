<template>
    <div class="mt-10">
        <div
            v-if="
                authenticated.scope && authenticated.scope.toString() == 'tutor'
            "
        >
            <div class="text-4xl">Scheduled Appointments</div>
            <ul class="flex">
                <li v-for="user in users" :key="user.id" class="flex">
                    {{ user.fname }} {{ user.lname }}
                </li>
            </ul>
        </div>
        <div
            v-else-if="
                authenticated.scope &&
                authenticated.scope.toString() == 'student'
            "
            class="text-2xl"
        >
            <div class="text-2xl">Scheduled Appointments</div>
        </div>
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
const students = ref({} as User[])
const users = ref({} as User[])
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
    students.value = users.value.filter(
        (user: User) => user.scope === 'student'
    )
}

onMounted(async () => {
    token = sessionStorage.getItem('token') || ''
    if (!token) {
        return
    }
    const td = (await jwtDecode(token)) as User
    authenticated.value = {
        id: td.id,
        fname: td.fname,
        lname: td.lname,
        username: td.username,
        password: '',
        scope: td.scope
    }
    await fetchUsers()
})
</script>
