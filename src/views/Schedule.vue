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
    </form>
</template>
<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'
import { ref, onMounted } from 'vue'
import { nanoid } from 'nanoid'
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
    tutor: Tutor
    student: User
    subject: string
    notes: string
    completed: boolean
}

const date = ref({} as Date)
const tutor = ref({} as Tutor)
const authenticated = ref({} as User)
let token = ''

//I just need to submit the schedule and have the tutor check
//it off, and then in the home page have the student see it.
//Then the tutor should be able to see the same thing
//Last thing I was working on was having the tutor value for
//the database be either the tutor's name or id
//I think id would be easier but the front end would need
//to look at the back end to find the tutor's name

const submitSchedule = async () => {
    date.value.id = nanoid()
    date.value.tutor = tutor.value.fname
    const response = await fetch('/api/v1/date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(date.value)
    })
    await response.json()
}

onMounted(async () => {
    const tutorString = sessionStorage.getItem('tutor')
    if (tutorString) {
        tutor.value = JSON.parse(tutorString)
    }
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
})
</script>
