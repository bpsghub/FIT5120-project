<script setup>
import Button from '@/components/Button.vue'
</script>

<template>
  <section class="banner d-flex align-items-center justify-content-center">
    <div class="container">
      <div class="row align-items-center">
        <div class="left_content col-12 col-md-6">
          <h2 class="banner_title">Ankang Life</h2>
        </div>
        <div class="right_content col-12 col-md-6">
          <p class="text-white">
            The meaning of 安康 (ān kāng) in English is well-being, health, or welfare. It describes
            a state of being healthy and happy, encompassing both physical and mental health.
          </p>
        </div>
      </div>
      <div class="banner_button d-flex justify-content-center pt-3 pb-5">
        <Button class="button pe-5" bg-color="black" :hover="true" :href="'/FindFacility_Event'"
          >Find Facility / Event</Button
        >
        <Button class="button" :hover="true" bg-color="white" :href="'/learnenglish'"
          >Learn English</Button
        >
      </div>
    </div>
  </section>
  <section class="body">
    <img
      src="https://thumbs.dreamstime.com/b/smiling-senior-couple-jogging-park-smiling-senior-couple-jogging-park-smiling-senior-active-couple-walking-jogging-130227194.jpg"
      alt=""
      class="body_image"
    />
  </section>
</template>

<style scoped>
.banner {
  background-image: url('https://img.freepik.com/free-photo/vivid-blurred-colorful-wallpaper-background_58702-3803.jpg');
  background-size: cover;
  background-position: bottom left;
  background-repeat: no-repeat;
  min-height: 50vh; /* Add some height to see the background */
}

h2.banner_title {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 5rem;
  color: white;
}

.banner_button .button :deep(.btn) {
  font-size: 1.5rem;
  padding: 20px 40px;
  min-width: 100px;
}

.body_image {
  width: 100vw; /* Full viewport width */
  height: auto;
  object-fit: cover; /* Maintain aspect ratio while covering the area */
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin: 0 0 20px 0;
}

.hero-content p {
  font-size: 1.2rem;
  margin: 0 0 30px 0;
}

.primary-btn {
  background-color: #1a73e8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.primary-btn:hover {
  background-color: #0d66d0;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 60px 20px;
}

.feature-card {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 3rem;
  margin: 0 0 20px 0;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin: 0 0 15px 0;
  color: #333;
}

.feature-card p {
  color: #666;
  margin: 0;
  line-height: 1.6;
}
</style>
