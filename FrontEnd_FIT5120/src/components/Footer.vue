<template>
  <footer class="footer bg-dark text-light py-5">
    <div class="container">
      <!-- Main Footer Content -->
      <div class="row g-4">
        <!-- Company Info -->
        <div class="col-lg-4 col-md-6 col-12">
          <h3 class="footer-title mb-3">Ankang Life</h3>
          <p class="footer-description mb-4">
            Empowering older adults to confidently navigate life in Australia with comprehensive English learning,
            cultural guidance, and practical support for daily activities.
          </p>
          <div class="social-links">
            <a href="#" class="social-link me-3" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-link me-3" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link me-3" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <!-- Learning Resources -->
        <div class="col-lg-2 col-md-6 col-6">
          <h4 class="footer-subtitle mb-3">Learning</h4>
          <ul class="list-unstyled footer-links">
            <li class="mb-2"><router-link to="/learnenglish" class="footer-link">Learn English</router-link></li>
            <li class="mb-2"><router-link to="/socialnorms" class="footer-link">Social Norms</router-link></li>
            <li class="mb-2"><router-link to="/socialnorms/meetingpeople" class="footer-link">Meeting
                People</router-link></li>
            <li class="mb-2"><router-link to="/socialnorms/eatingout" class="footer-link">Dining Etiquette</router-link>
            </li>
            <li class="mb-2"><router-link to="/chatbot" class="footer-link">AI Chatbot</router-link></li>
          </ul>
        </div>

        <!-- Navigate Life -->
        <div class="col-lg-2 col-md-6 col-6">
          <h4 class="footer-subtitle mb-3">Navigate Life</h4>
          <ul class="list-unstyled footer-links">
            <li class="mb-2"><router-link to="/publicTransportation" class="footer-link">Public Transport</router-link>
            </li>
            <li class="mb-2"><router-link to="/grocceriesShopping" class="footer-link">Groceries Shopping</router-link>
            </li>
            <li class="mb-2"><router-link to="/medicalAttention" class="footer-link">Medical Attention</router-link>
            </li>
            <li class="mb-2"><router-link to="/mykicardlearning" class="footer-link">Myki Card Guide</router-link></li>
            <li class="mb-2"><router-link to="/safety" class="footer-link">Safety Tips</router-link></li>
          </ul>
        </div>

        <!-- Services -->
        <div class="col-lg-2 col-md-6 col-6">
          <h4 class="footer-subtitle mb-3">Services</h4>
          <ul class="list-unstyled footer-links">
            <li class="mb-2"><router-link to="/facilities" class="footer-link">Find Facilities</router-link></li>
            <li class="mb-2"><router-link to="/buslearning" class="footer-link">Bus Guide</router-link></li>
            <li class="mb-2"><router-link to="/trainlearning" class="footer-link">Train Guide</router-link></li>
            <li class="mb-2"><router-link to="/tramlearning" class="footer-link">Tram Guide</router-link></li>
            <li class="mb-2"><router-link to="/navigatelife" class="footer-link">Community Events</router-link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-lg-2 col-md-6 col-12">
          <h4 class="footer-subtitle mb-3">Contact</h4>
          <div class="contact-info">
            <div class="contact-item mb-2 d-flex align-items-center">
              <i class="fas fa-envelope me-2"></i>
              <small>support@ankanglife.com</small>
            </div>
            <div class="contact-item mb-2 d-flex align-items-center">
              <i class="fas fa-phone me-2"></i>
              <small>+61 3 9123 4567</small>
            </div>
            <div class="contact-item mb-2 d-flex align-items-center">
              <i class="fas fa-map-marker-alt me-2"></i>
              <small>Melbourne, Victoria, Australia</small>
            </div>
            <div class="contact-item d-flex align-items-center">
              <i class="fas fa-clock me-2"></i>
              <small>Mon-Fri: 9AM-5PM AEST</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <hr class="my-4">
      <div class="row align-items-center">
        <div class="col-md-6 col-12 text-center text-md-start">
          <p class="mb-0">&copy; 2025 Ankang Life. All rights reserved. Supporting older adults in Australia.</p>
        </div>
        <div class="col-md-6 col-12 text-center text-md-end mt-3 mt-md-0">
          <div class="footer-bottom-links">
            <router-link to="/about" class="footer-bottom-link me-3">Privacy Policy</router-link>
            <router-link to="/about" class="footer-bottom-link me-3">Terms of Service</router-link>
            <router-link to="/about" class="footer-bottom-link me-3">Accessibility</router-link>
            <router-link to="/about" class="footer-bottom-link">Help Center</router-link>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-top: 3px solid #be36ec;
  margin-top: auto;
}

.footer-title {
  color: #be36ec;
  font-weight: 700;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.footer-subtitle {
  color: #facf46;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-link {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: block;
  padding: 0.25rem 0;
}

.footer-link:hover {
  color: #be36ec;
  text-decoration: none;
  transform: translateX(5px);
}

.social-links {
  margin-top: 1.5rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(190, 54, 236, 0.2);
  color: #be36ec;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.social-link:hover {
  background: #be36ec;
  color: white;
  transform: translateY(-3px);
}

.contact-info {
  color: #bdc3c7;
}

.contact-item {
  font-size: 0.9rem;
  line-height: 1.4;
}

.contact-item i {
  color: #be36ec;
  width: 16px;
  flex-shrink: 0;
}

.footer-bottom-link {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.footer-bottom-link:hover {
  color: #facf46;
  text-decoration: none;
}

/* Mobile Responsive */
@media (max-width: 767.98px) {
  .footer-title {
    font-size: 1.5rem;
    text-align: center;
  }

  .footer-subtitle {
    font-size: 1rem;
    text-align: center;
    margin-top: 2rem;
  }

  .footer-description {
    text-align: center;
    margin-bottom: 2rem;
  }

  .social-links {
    text-align: center;
    margin-bottom: 2rem;
  }

  .footer-links {
    text-align: center;
  }

  .contact-info {
    text-align: center;
  }

  .contact-item {
    justify-content: center;
    margin-bottom: 0.5rem;
  }
}

/* Tablet Responsive */
@media (min-width: 768px) and (max-width: 991.98px) {
  .footer-title {
    font-size: 1.6rem;
  }

  .footer-subtitle {
    font-size: 1.05rem;
  }
}

/* Large screen adjustments */
@media (min-width: 1200px) {
  .footer {
    padding: 4rem 0 2rem;
  }

  .footer-title {
    font-size: 2rem;
  }
}
</style>
