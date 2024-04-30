<template>
    <div v-if="authenticated.id">
        <div
            v-if="!ClockedIn"
            class="container mx-auto max-w-prose flex flex-col my-50 items-center p-2 min-h-screen gap-4"
        >
            <div class="text-6xl">Clock-in</div>
            <label for="subject" class="text-3xl flex">Subject</label>
            <input
                id="subject"
                v-model="clock.subject"
                required
                class="rounded-lg"
                type="text"
                name="subject"
            />
            <label for="notes" class="text-3xl flex">Notes</label>
            <textarea
                id="notes"
                v-model="clock.notes"
                class="rounded-lg"
                type="textarea"
                name="notes"
            ></textarea>
            <button
                class="bg-blue-600 hover:shadow-lg focus:shadow-lg hover:brightness-110 rounded-lg w-50 text-xl text-white p-2"
                @click="submitClockin"
            >
                Clock-in
            </button>
        </div>
        <div
            v-else
            class="container mx-auto max-w-prose flex flex-col my-50 items-center p-2 min-h-screen gap-4"
        >
            <button
                class="bg-blue-600 hover:shadow-lg focus:shadow-lg hover:brightness-110 rounded-lg w-100 text-6xl text-white p-2"
                @click="clockOut"
            >
                Clock-Out
            </button>
        </div>
    </div>
    <div
        v-else
        class="container mx-auto max-w-prose flex flex-col my-50 items-center p-2 min-h-screen gap-4"
    >
        SIGN-IN!!!
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { nanoid } from 'nanoid'

interface User {
    id: string
    fname: string
    lname: string
    username: string
    password: string
    scope: string
}

let clock = ref({} as Clock)
const authenticated = ref({} as User)
let token = ''
let ClockedIn = clock.value.clockIn

interface Clock {
    id: string
    date: string
    outdate: string
    fname: string
    lname: string
    subject: string
    notes: string
    clockIn: boolean
}

const clockOut = async () => {
    clock.value.outdate = new Date().toISOString()
    console.log(clock.value)
    console.log('submitting clock-out')
    ClockedIn = false
    clock.value.clockIn = false
    const response = await fetch(`/api/v1/clock/${clock.value.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clock.value)
    })
    await response.json()
}

const submitClockin = async () => {
    clock.value.fname = authenticated.value.fname
    clock.value.lname = authenticated.value.lname
    clock.value.id = nanoid()
    sessionStorage.setItem(
        `clockInID-${authenticated.value.id}`,
        clock.value.id
    )
    clock.value.clockIn = true
    ClockedIn = true
    clock.value.date = new Date().toISOString()
    console.log(clock.value)
    console.log('submitting clock-in')
    const response = await fetch('/api/v1/clock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clock.value)
    })
    await response.json()
}

onMounted(async () => {
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
    console.log('Clock-in')
    const cl = sessionStorage.getItem(`clockInID-${authenticated.value.id}`)
    clock.value = await (
        await fetch(`/api/v1/clock/${cl}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    ).json()
    ClockedIn = clock.value.clockIn
})
</script>
