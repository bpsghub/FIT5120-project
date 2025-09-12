<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo" @click="$router.push('/')">
      </div>
      <div class="navbar-menu">
        <button @click="$router.push('/')" class="nav-btn">Homepage</button>
        <button @click="$router.push('/FindFacility_Event')" class="nav-btn">Find Facilities/Events</button>
        <button @click="$router.push('/learnenglish')" class="nav-btn">Learning English</button>
      </div>
    </div>
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a73e8;
  cursor: pointer;
}

.navbar-menu {
  display: flex;
  gap: 20px;
}

.nav-btn {
  padding: 8px 16px;
  background-color: #f0f2f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.nav-btn:hover {
  background-color: #e1e4e8;
  color: #1a73e8;
}
</style>
