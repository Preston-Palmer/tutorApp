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
                to="/Clockin"
                class="bg-gray-400 hover:bg-gray-500 text-3xl content-center text-center"
                >Clock-In</RouterLink
            >
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
