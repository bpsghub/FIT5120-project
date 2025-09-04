<template>
  <div class="button-w">
    <a :href="href" :class="btnClasses()">
      <slot>Default button</slot>
    </a>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  bgColor: {
    type: String,
    default: 'white',
  },
  hover: {
    type: Boolean,
    default: false,
  },
  href: {
    type: String,
    default: '#',
  },
})

const btnClasses = () => ({
  btn: true,
  'white-black-bg': props.bgColor === 'white',
  'black-white-bg': props.bgColor === 'black',
  'white-green-bg': props.bgColor === 'white-green',
  hover: props.hover,
})
</script>

<style scoped>
.button-w .btn {
  padding: 10px 20px;
  color: black;
  border: 0px solid black;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: white;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

/* White background button styles */
.button-w .btn.white-black-bg {
  background-color: white;
  color: black;
}

/* Black background button styles */
.button-w .btn.black-white-bg {
  background-color: black;
  color: white;
}

/* White-green background button styles */
.button-w .btn.white-green-bg {
  background-color: white;
  color: #4f9c24;
}

/* Hover effects - only applied when hover prop is true */
.button-w .btn.hover.white-black-bg:hover {
  background-color: black;
  color: white;
}

.button-w .btn.hover.black-white-bg:hover {
  background-color: white;
  color: black;
}

.button-w .btn.hover.white-green-bg:hover {
  background-color: #4f9c24;
  color: white;
}
</style>
