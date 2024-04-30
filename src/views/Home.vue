<template>
    <div class="mt-10">
        <div
            v-if="
                authenticated.scope && authenticated.scope.toString() == 'tutor'
            "
        >
            <div class="ml-5 text-4xl">Students</div>
            <ul class="grid grid-cols-1">
                <li
                    v-for="student in students"
                    :key="student.id"
                    class="ml-2 bg-gray-400 mt-2 flex text-2xl rounded-lg max-w-prose"
                >
                    {{ student.fname }} {{ student.lname }}
                </li>
            </ul>
            <div class="ml-5 text-4xl">Scheduled Appointments</div>
            <ul class="grid grid-cols-1">
                <li
                    v-for="student in students"
                    :key="student.id"
                    class="ml-2 bg-gray-400 mt-2 flex text-2xl rounded-lg max-w-prose"
                >
                    {{ student.fname }} {{ student.lname }}
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
            <div class="ml-5 text-4xl">Tutors</div>
            <ul class="grid grid-cols-3 gap-2">
                <li
                    v-for="tutor in tutors"
                    :key="tutor.id"
                    class="ml-2 bg-blue-400 text-gray-800 text-3xl overflow-auto tracking-wider h-80 p-4 rounded-lg shadow-lg justify-between w-full"
                >
                    <div class="bg-blue-300 rounded-lg text-center">
                        Name: {{ tutor.fname }} {{ tutor.lname }}
                    </div>
                    <div class="bg-blue-300 rounded-lg mt-2 text-center">
                        Subject: {{ tutor.subject }}
                    </div>
                    <div class="bg-blue-300 rounded-lg mt-2 text-center">
                        Availability: {{ tutor.availability }}
                    </div>
                    <RouterLink
                        to="/Schedule"
                        class="flex mt-26 bg-gray-300 rounded-lg text-center w-full text-4xl hover:bg-gray-400 hover:shadow-lg focus:shadow-lg hover:brightness-110 p-2"
                        @click="schedule(tutor)"
                    >
                        Schedule
                    </RouterLink>
                </li>
            </ul>
            <div class="ml-5 text-4xl mt-4">Scheduled Appointments</div>
            <ul class="grid grid-cols-3 gap-2">
                <li
                    v-for="tutor in tutors"
                    :key="tutor.id"
                    class="ml-2 bg-gray-400 text-gray-800 text-3xl overflow-auto tracking-wider h-80 p-3 rounded-lg shadow-lg justify-between w-full"
                >
                    {{ tutor.fname }} {{ tutor.lname }}
                </li>
            </ul>
        </div>
    </div>
</template>
<!-- Basically we only would see what the student scheduled
                then they would reject or accept. -->

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

interface Tutor {
    id: string
    fname: string
    lname: string
    subject: string
    availability: string
}

const students = ref({} as User[])
const tutors = ref({} as Tutor[])
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
    students.value = users.value.filter((user: User) => user.scope == 'student')
}
const fetchTutors = async () => {
    console.log('fetching tutors')
    const response = await fetch('/api/v1/tutors', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log('assigned tutors')
    tutors.value = await response.json()
    console.log('fetched tutors', tutors.value)
}

const schedule = async (tutor: Tutor) => {
    console.log('scheduling tutor')
    sessionStorage.setItem('tutor', JSON.stringify(tutor))
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
    await fetchTutors()
})
</script>
