<template>
    <header class="social-norms-banner">
        <div class="banner-background">
            <div class="gradient-overlay"></div>
            <div class="animated-shapes">
                <div v-for="n in 20" :key="n" class="shape" :style="shapeStyle(n)" />
            </div>
        </div>

        <div class="banner-content" data-aos="fade-up" data-aos-duration="1000">
            <div class="icon-wrapper" data-aos="zoom-in" data-aos-delay="200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="banner-icon">
                    <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    <path
                        d="M15.08 7.05c.84 1.18.84 2.71 0 3.89.32.13.66.21 1.02.21 1.93 0 3.5-1.57 3.5-3.5S18.03 4.15 16.1 4.15c-.36 0-.7.08-1.02.21.84 1.18.84 2.71 0 3.89zM20.5 18v-2c0-1.45-.81-2.72-2.06-3.42C19.39 13.15 20.5 14.21 20.5 16v2h2z" />
                </svg>
            </div>

            <h1 class="banner-title" data-aos="fade-down" data-aos-delay="400">
                {{ title }}
            </h1>

            <p v-if="subtitle" class="banner-subtitle" data-aos="fade-up" data-aos-delay="600">
                {{ subtitle }}
            </p>

            <div class="decorative-line" data-aos="zoom-in" data-aos-delay="800">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </header>
</template>

<script setup>
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
})

function shapeStyle() {
    const size = 40 + Math.random() * 80
    const left = Math.random() * 100
    const top = Math.random() * 100
    const delay = Math.random() * 5
    const duration = 8 + Math.random() * 12

    return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
    }
}
</script>

<style scoped>
.social-norms-banner {
    position: relative;
    width: 100%;
    min-height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.banner-background {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.9) 0%,
            rgba(118, 75, 162, 0.9) 50%,
            rgba(237, 87, 183, 0.8) 100%);
    z-index: 2;
}

.animated-shapes {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.shape {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float-shapes 20s ease-in-out infinite;
    backdrop-filter: blur(2px);
}

@keyframes float-shapes {

    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0.3;
    }

    25% {
        transform: translate(20px, -30px) rotate(90deg);
        opacity: 0.6;
    }

    50% {
        transform: translate(-20px, -60px) rotate(180deg);
        opacity: 0.4;
    }

    75% {
        transform: translate(30px, -30px) rotate(270deg);
        opacity: 0.7;
    }
}

.banner-content {
    position: relative;
    z-index: 3;
    text-align: center;
    padding: 40px 20px;
    max-width: 900px;
}

.icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    animation: pulse-icon 3s ease-in-out infinite;
}

@keyframes pulse-icon {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    50% {
        transform: scale(1.05);
        box-shadow: 0 12px 48px rgba(255, 255, 255, 0.3);
    }
}

.banner-icon {
    width: 60px;
    height: 60px;
    color: #fff;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.banner-title {
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-size: 3.5rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 16px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
    line-height: 1.2;
}

.banner-subtitle {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 400;
    margin-bottom: 24px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    line-height: 1.6;
}

.decorative-line {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
}

.decorative-line span {
    display: block;
    height: 3px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.decorative-line span:nth-child(1),
.decorative-line span:nth-child(3) {
    width: 40px;
    animation: expand-line 2s ease-in-out infinite;
}

.decorative-line span:nth-child(2) {
    width: 80px;
    animation: expand-line 2s ease-in-out infinite 0.3s;
}

@keyframes expand-line {

    0%,
    100% {
        transform: scaleX(1);
        opacity: 1;
    }

    50% {
        transform: scaleX(1.3);
        opacity: 0.7;
    }
}

@media (max-width: 768px) {
    .social-norms-banner {
        min-height: 300px;
    }

    .banner-title {
        font-size: 2.5rem;
    }

    .banner-subtitle {
        font-size: 1.2rem;
    }

    .icon-wrapper {
        width: 80px;
        height: 80px;
    }

    .banner-icon {
        width: 48px;
        height: 48px;
    }
}

@media (max-width: 480px) {
    .banner-title {
        font-size: 2rem;
    }

    .banner-subtitle {
        font-size: 1rem;
    }

    .icon-wrapper {
        width: 70px;
        height: 70px;
    }

    .banner-icon {
        width: 40px;
        height: 40px;
    }
}
</style>
