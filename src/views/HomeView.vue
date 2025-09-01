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
        <Button class="button pe-5" bg-color="black" :hover="true" :href="'/FacilityEvent'"
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
  background-position: center;
  background-repeat: no-repeat;
  min-height: 60vh;
  display: flex;
  align-items: center;
  padding: 40px 0;
}

h2.banner_title {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: clamp(2.5rem, 8vw, 5rem);
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
}

.banner .right_content p {
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 1.5rem;
}

.banner_button {
  margin-top: 2rem;
  gap: 1rem;
}

.banner_button .button :deep(.btn) {
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.banner_button .button :deep(.btn):hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.body_image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

/* Mobile responsive improvements */
@media (max-width: 768px) {
  .banner {
    min-height: 50vh;
    padding: 20px 0;
  }

  .banner .container {
    padding: 0 15px;
  }

  .banner .row {
    text-align: center;
  }

  .banner_button {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .banner_button .button {
    width: 100%;
    max-width: 280px;
  }

  .banner_button .button :deep(.btn) {
    width: 100%;
    margin: 0;
  }
}

@media (max-width: 576px) {
  .banner {
    min-height: 40vh;
    padding: 10px 0;
  }

  .banner .container {
    padding: 0 15px;
  }

  .banner_button {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    padding-top: 1.5rem;
  }

  .banner_button .button {
    width: 100%;
    max-width: 280px;
  }

  .banner_button .button :deep(.btn) {
    width: 100%;
    margin: 0;
    padding: 14px 16px;
    font-size: 0.95rem;
    white-space: normal;
    text-align: center;
    line-height: 1.3;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2.banner_title {
    font-size: clamp(2rem, 6vw, 3rem);
    margin-bottom: 0.8rem;
  }

  .banner .right_content p {
    font-size: clamp(0.85rem, 2vw, 1rem);
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .banner {
    min-height: 45vh;
    padding: 15px 0;
  }

  .banner .container {
    padding: 0 10px;
  }

  h2.banner_title {
    margin-bottom: 0.8rem;
  }

  .banner .right_content p {
    margin-bottom: 1rem;
  }

  .banner_button {
    margin-top: 1.5rem;
  }

  .body_image {
    max-height: 250px;
  }
}

/* Better container responsiveness */
@media (min-width: 1200px) {
  .banner {
    min-height: 70vh;
  }
}
</style>
