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
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  display: inline-block;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
}

.button-w .btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.button-w .btn:hover::before {
  left: 100%;
}

/* White background button styles */
.button-w .btn.white-black-bg {
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  border-color: rgba(44, 62, 80, 0.2);
}

/* Black background button styles */
.button-w .btn.black-white-bg {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
}

/* White-green background button styles */
.button-w .btn.white-green-bg {
  background: rgba(255, 255, 255, 0.95);
  color: #28a745;
  border-color: rgba(40, 167, 69, 0.3);
}

/* Hover effects - only applied when hover prop is true */
.button-w .btn.hover.white-black-bg:hover {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(44, 62, 80, 0.4);
  border-color: transparent;
}

.button-w .btn.hover.black-white-bg:hover {
  background: rgba(255, 255, 255, 0.95);
  color: #2c3e50;
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(255, 255, 255, 0.4);
  border-color: rgba(44, 62, 80, 0.2);
}

.button-w .btn.hover.white-green-bg:hover {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(40, 167, 69, 0.4);
  border-color: transparent;
}

/* Active state */
.button-w .btn:active {
  transform: translateY(-1px);
}

/* Focus state for accessibility */
.button-w .btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .button-w .btn {
    padding: 12px 24px;
    font-size: 14px;
  }
}
</style>
