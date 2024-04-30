<template>
    <div class="mt-10">
        <div
            v-if="
                authenticated.scope && authenticated.scope.toString() == 'tutor'
            "
        >
            <div class="ml-5 text-4xl mt-4">Scheduled Appointments</div>
            <ul class="grid grid-cols-3 gap-2">
                <li
                    v-for="date in tutorDates"
                    :key="date.id"
                    class="ml-2 bg-gray-400 text-gray-800 text-3xl overflow-auto tracking-wider h-80 p-3 rounded-lg shadow-lg justify-between w-full"
                >
                    <div class="text-center rounded-lg bg-gray-500">
                        Student: {{ getStudentNameById(date.student) }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Tutor: {{ getTutorNameById(date.tutor) }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Date: {{ date.date }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Time: {{ date.time }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Subject: {{ date.subject }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Notes: {{ date.notes }}
                    </div>
                    <button
                        v-if="!date.confirmed"
                        class="text-center bg-blue-600 hover:shadow-lg focus:shadow-lg hover:brightness-110 rounded-lg w-50 text-xl text-white p-2 w-full mt-2"
                        @click="verifyDate(date)"
                    >
                        Verify
                    </button>
                    <div
                        v-else
                        class="text-center text-white rounded-lg bg-gray-800 mt-2"
                    >
                        Confirmed
                    </div>
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
                    v-for="date in studentDates"
                    :key="date.id"
                    class="ml-2 bg-gray-400 text-gray-800 text-3xl overflow-auto tracking-wider h-80 p-3 rounded-lg shadow-lg justify-between w-full"
                >
                    <div class="text-center rounded-lg bg-gray-500">
                        Tutor: {{ getTutorNameById(date.tutor) }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Student: {{ getStudentNameById(date.student) }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Date: {{ date.date }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Time: {{ date.time }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Subject: {{ date.subject }}
                    </div>
                    <div class="text-center rounded-lg bg-gray-500 mt-2">
                        Notes: {{ date.notes }}
                    </div>
                    <div
                        v-if="date.confirmed"
                        class="text-center text-white rounded-lg bg-gray-800 mt-2"
                    >
                        Confirmed
                    </div>
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

interface Date {
    id: string
    date: string
    time: string
    tutor: string
    student: string
    subject: string
    notes: string
    completed: boolean
    confirmed: boolean
}

const students = ref({} as User[])
const tutors = ref({} as Tutor[])
const users = ref({} as User[])
const tutorDates = ref({} as Date[])
const studentDates = ref({} as Date[])
const authenticated = ref({} as User)
let token = ''

const verifyDate = async (date: Date) => {
    date.confirmed = true
    console.log('date confirmed for', date.id)
    const response = await fetch(`/api/v1/dates/${date.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(date)
    })
    await response.json()
}

const getStudentNameById = (id: string) => {
    const student = students.value.find((student) => student.id === id)
    return student ? `${student.fname} ${student.lname}` : 'Unknown Student'
}

const getTutorNameById = (id: string) => {
    const tutor = tutors.value.find((tutor) => tutor.id === id)
    return tutor ? `${tutor.fname} ${tutor.lname}` : 'Unknown Tutor'
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
const fetchStudentDates = async () => {
    console.log('fetching Student Dates')
    const response = await fetch('/api/v1/dates', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log('assigned Student Dates')
    studentDates.value = await response.json()
    studentDates.value = studentDates.value.filter(
        (date: Date) => date.student == authenticated.value.id
    )
    console.log('fetched Student Dates', studentDates.value)
}

const fetchTutorDates = async () => {
    console.log('fetching Tutor Dates')
    const response = await fetch('/api/v1/dates', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    console.log('assigned Tutor Dates')
    tutorDates.value = await response.json()
    tutorDates.value = tutorDates.value.filter(
        (date: Date) => date.tutor == authenticated.value.id
    )
    console.log('fetched Tutor Dates', tutorDates.value)
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
    await fetchStudentDates()
    await fetchTutorDates()
})
</script>
