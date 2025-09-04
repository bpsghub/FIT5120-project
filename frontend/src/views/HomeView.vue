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
</style>
