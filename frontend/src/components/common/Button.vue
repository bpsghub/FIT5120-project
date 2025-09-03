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
  padding: 12px 24px;
  color: black;
  border: 0px solid black;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  background-color: white;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
  white-space: nowrap;
}

/* Responsive design improvements */
@media (min-width: 768px) {
  .button-w .btn {
    padding: 14px 28px;
    font-size: 1.1rem;
    min-width: 150px;
  }
}

@media (min-width: 1024px) {
  .button-w .btn {
    padding: 16px 32px;
    font-size: 1.125rem;
    min-width: 180px;
  }
}

@media (max-width: 767px) {
  .button-w .btn {
    padding: 10px 20px;
    font-size: 0.95rem;
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .button-w .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: 90px;
    width: 100%;
    max-width: 200px;
  }
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
  transform: translateY(-2px);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 8px 20px;
}

.button-w .btn.hover.black-white-bg:hover {
  background-color: white;
  color: black;
  transform: translateY(-2px);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 8px 20px;
}

.button-w .btn.hover.white-green-bg:hover {
  background-color: #4f9c24;
  color: white;
  transform: translateY(-2px);
  box-shadow: rgba(79, 156, 36, 0.4) 0px 8px 20px;
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .button-w .btn.hover:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  .button-w .btn {
    min-height: 44px; /* Minimum touch target size */
  }
}

/* Focus state for accessibility */
.button-w .btn:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
