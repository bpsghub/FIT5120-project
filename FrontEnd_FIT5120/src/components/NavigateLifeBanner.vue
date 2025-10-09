<template>
    <header class="navigate-banner">
        <div class="wave-background">
            <svg class="wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="rgba(255,255,255,0.1)" fill-opacity="1"
                    d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    class="wave-path wave-1" />
                <path fill="rgba(255,255,255,0.1)" fill-opacity="1"
                    d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    class="wave-path wave-2" />
            </svg>
        </div>

        <div class="floating-icons">
            <div v-for="n in 8" :key="n" class="float-icon" :style="iconStyle(n)">
                <component :is="getIcon(n)" />
            </div>
        </div>

        <div class="banner-content">
            <div class="compass-icon" data-aos="rotate-in" data-aos-duration="1200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
            </div>

            <h1 class="title" data-aos="fade-down" data-aos-delay="300">
                {{ title }}
            </h1>

            <p v-if="subtitle" class="subtitle" data-aos="fade-up" data-aos-delay="500">
                {{ subtitle }}
            </p>

            <div class="navigation-dots" data-aos="zoom-in" data-aos-delay="700">
                <span v-for="n in 5" :key="n" :style="{ animationDelay: `${n * 0.1}s` }"></span>
            </div>
        </div>
    </header>
</template>

<script setup>
import { h } from 'vue'

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' }
})

function iconStyle(n) {
    const positions = [
        { left: '10%', top: '20%' },
        { left: '85%', top: '15%' },
        { left: '15%', top: '70%' },
        { left: '80%', top: '65%' },
        { left: '50%', top: '10%' },
        { left: '25%', top: '45%' },
        { left: '70%', top: '40%' },
        { left: '45%', top: '80%' }
    ]

    return {
        ...positions[n - 1],
        animationDelay: `${n * 0.2}s`,
        animationDuration: `${3 + Math.random() * 2}s`
    }
}

function getIcon(n) {
    const icons = [
        // Bus icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z' })
        ]),
        // Train icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z' })
        ]),
        // Map icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z' })
        ]),
        // Shopping cart icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' })
        ]),
        // Medical icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z' })
        ]),
        // Location icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' })
        ]),
        // Tram icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06zm-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-4.5H7V9h10v5z' })
        ]),
        // Directions icon
        () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z' })
        ])
    ]
    return icons[(n - 1) % icons.length]
}
</script>

<style scoped>
.navigate-banner {
    position: relative;
    width: 100%;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
}

.wave-background {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
}

.wave-svg {
    position: absolute;
    bottom: -5px;
    width: 100%;
    height: 100%;
}

.wave-path {
    animation: wave-animation 15s ease-in-out infinite;
}

.wave-1 {
    animation-delay: 0s;
}

.wave-2 {
    animation-delay: -5s;
}

@keyframes wave-animation {

    0%,
    100% {
        transform: translateX(0) translateY(0);
    }

    50% {
        transform: translateX(-25px) translateY(-10px);
    }
}

.floating-icons {
    position: absolute;
    inset: 0;
    z-index: 2;
}

.float-icon {
    position: absolute;
    width: 50px;
    height: 50px;
    color: rgba(255, 255, 255, 0.4);
    animation: float-up-down 4s ease-in-out infinite;
}

.float-icon svg {
    width: 100%;
    height: 100%;
}

@keyframes float-up-down {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.4;
    }

    50% {
        transform: translateY(-20px) rotate(10deg);
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

.compass-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    margin-bottom: 28px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    animation: spin-compass 8s linear infinite;
}

@keyframes spin-compass {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.compass-icon svg {
    width: 70px;
    height: 70px;
    color: #fff;
    animation: pulse-scale 2s ease-in-out infinite;
}

@keyframes pulse-scale {

    0%,
    100% {
        transform: scale(1) rotate(-360deg);
    }

    50% {
        transform: scale(1.1) rotate(-180deg);
    }
}

.title {
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-size: 3.8rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 20px;
    text-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    letter-spacing: 1.2px;
}

.subtitle {
    font-size: 1.6rem;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 400;
    margin-bottom: 28px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    line-height: 1.6;
}

.navigation-dots {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 28px;
}

.navigation-dots span {
    display: block;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.4);
    animation: dot-bounce 1.5s ease-in-out infinite;
}

@keyframes dot-bounce {

    0%,
    100% {
        transform: translateY(0);
        opacity: 1;
    }

    50% {
        transform: translateY(-10px);
        opacity: 0.6;
    }
}

@media (max-width: 768px) {
    .navigate-banner {
        min-height: 320px;
    }

    .title {
        font-size: 2.8rem;
    }

    .subtitle {
        font-size: 1.3rem;
    }

    .compass-icon {
        width: 90px;
        height: 90px;
    }

    .compass-icon svg {
        width: 55px;
        height: 55px;
    }

    .float-icon {
        width: 40px;
        height: 40px;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 2.2rem;
    }

    .subtitle {
        font-size: 1.1rem;
    }

    .compass-icon {
        width: 75px;
        height: 75px;
    }

    .compass-icon svg {
        width: 45px;
        height: 45px;
    }
}
</style>
