<template>
    <form
        class="container mx-auto max-w-prose flex flex-col my-50 items-center p-2 min-h-screen gap-4"
    >
        <div>
            <div class="text-5xl gap-2 text-center">Sign-up</div>
            <label for="date" class="text-3xl flex mt-2">Date</label>
            <input
                id="date"
                v-model="date.date"
                class="rounded-lg"
                type="date"
                name="date"
                required
            />
            <label for="time" class="text-3xl flex mt-2">Time</label>
            <input
                id="time"
                v-model="date.time"
                class="rounded-lg"
                type="time"
                name="time"
                required
            />
            <label for="subject" class="text-3xl flex mt-2">Subject</label>
            <input
                id="subject"
                v-model="date.subject"
                class="rounded-lg"
                type="text"
                name="subject"
                required
            />
            <label for="notes" class="text-3xl flex mt-2">Notes</label>
            <textarea
                id="notes"
                v-model="date.notes"
                class="rounded-lg"
                type="text"
                name="notes"
                required
            >
            </textarea>
            <RouterLink
                to="/"
                class="mt-2 flex text-center justify-center bg-blue-600 hover:shadow-lg focus:shadow-lg hover:brightness-110 rounded-lg w-50 text-xl text-white p-2"
                @click="submitSchedule"
                >Submit</RouterLink
            >
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
    time: string
    tutor: string
    student: string
    subject: string
    notes: string
    completed: boolean
    confirmed: boolean
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
    date.value.tutor = tutor.value.id
    date.value.student = authenticated.value.id
    date.value.completed = false
    date.value.confirmed = false
    console.log('posting to /api/v1/dates')
    const response = await fetch('/api/v1/dates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(date.value)
    })
    await response.json()
    console.log('finished posting to /api/v1/dates', date.value)
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
