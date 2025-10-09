<template>
    <header class="transport-banner">
        <div class="animated-background">
            <div class="road-lines">
                <div v-for="n in 6" :key="n" class="road-line" :style="roadLineStyle(n)" />
            </div>

            <div class="transport-icons">
                <div class="moving-bus" :style="{ animationDelay: '0s' }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
                    </svg>
                </div>

                <div class="moving-tram" :style="{ animationDelay: '2s' }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06zm-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-4.5H7V9h10v5z" />
                    </svg>
                </div>

                <div class="moving-train" :style="{ animationDelay: '4s' }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z" />
                    </svg>
                </div>
            </div>

            <div class="gradient-overlay"></div>
        </div>

        <div class="banner-content">
            <div class="main-icon" data-aos="zoom-in" data-aos-duration="1000">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
            </div>

            <h1 class="title" data-aos="fade-right" data-aos-delay="300">
                {{ title }}
            </h1>

            <p v-if="subtitle" class="subtitle" data-aos="fade-left" data-aos-delay="500">
                {{ subtitle }}
            </p>

            <div class="transport-badges" data-aos="fade-up" data-aos-delay="700">
                <div class="badge" v-for="(transport, idx) in transports" :key="idx"
                    :style="{ animationDelay: `${idx * 0.15}s` }">
                    <component :is="transport.icon" />
                    <span>{{ transport.name }}</span>
                </div>
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

function roadLineStyle(n) {
    return {
        left: `${(n - 1) * 20}%`,
        animationDelay: `${n * 0.3}s`
    }
}

const transports = [
    {
        name: 'Bus',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z' })
        ])
    },
    {
        name: 'Train',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4s-8 .5-8 4v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z' })
        ])
    },
    {
        name: 'Tram',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M19 16.94V8.5c0-2.79-2.61-3.4-6.01-3.49l.76-1.51H17V2H7v1.5h4.75l-.76 1.52C7.86 5.11 5 5.73 5 8.5v8.44c0 1.45 1.19 2.66 2.59 2.97L6 21.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 20h-.08c1.69 0 2.58-1.37 2.58-3.06zm-7 1.56c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5-4.5H7V9h10v5z' })
        ])
    },
    {
        name: 'Myki',
        icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
            h('path', { d: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' })
        ])
    }
]
</script>

<style scoped>
.transport-banner {
    position: relative;
    width: 100%;
    min-height: 420px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 60%, #f093fb 100%);
}

.animated-background {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.road-lines {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.road-line {
    position: absolute;
    width: 4px;
    height: 60px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    top: -60px;
    animation: road-move 3s linear infinite;
}

@keyframes road-move {
    0% {
        top: -60px;
        opacity: 0;
    }

    10% {
        opacity: 1;
    }

    90% {
        opacity: 1;
    }

    100% {
        top: 100%;
        opacity: 0;
    }
}

.transport-icons {
    position: absolute;
    inset: 0;
    z-index: 2;
}

.moving-bus,
.moving-tram,
.moving-train {
    position: absolute;
    width: 80px;
    height: 80px;
    color: rgba(255, 255, 255, 0.2);
    animation: move-vehicle 8s ease-in-out infinite;
}

.moving-bus {
    top: 15%;
    left: -80px;
}

.moving-tram {
    top: 45%;
    left: -80px;
}

.moving-train {
    top: 75%;
    left: -80px;
}

.moving-bus svg,
.moving-tram svg,
.moving-train svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

@keyframes move-vehicle {
    0% {
        left: -80px;
        transform: translateX(0);
    }

    50% {
        transform: translateX(10px) scale(1.1);
    }

    100% {
        left: 100%;
        transform: translateX(0);
    }
}

.gradient-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.15) 100%);
    z-index: 3;
}

.banner-content {
    position: relative;
    z-index: 4;
    text-align: center;
    padding: 40px 20px;
    max-width: 1000px;
}

.main-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 110px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    margin-bottom: 24px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    animation: icon-pulse 3s ease-in-out infinite;
}

@keyframes icon-pulse {

    0%,
    100% {
        transform: scale(1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    50% {
        transform: scale(1.08);
        box-shadow: 0 12px 48px rgba(255, 255, 255, 0.4);
    }
}

.main-icon svg {
    width: 65px;
    height: 65px;
    color: #fff;
}

.title {
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-size: 3.6rem;
    font-weight: 800;
    color: #fff;
    margin-bottom: 18px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
}

.subtitle {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 400;
    margin-bottom: 32px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    line-height: 1.6;
}

.transport-badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;
}

.badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    animation: badge-float 2s ease-in-out infinite;
}

.badge:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

@keyframes badge-float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}

.badge svg {
    width: 40px;
    height: 40px;
    color: #fff;
}

.badge span {
    font-size: 0.95rem;
    font-weight: 600;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

@media (max-width: 768px) {
    .transport-banner {
        min-height: 350px;
    }

    .title {
        font-size: 2.6rem;
    }

    .subtitle {
        font-size: 1.2rem;
    }

    .main-icon {
        width: 85px;
        height: 85px;
    }

    .main-icon svg {
        width: 50px;
        height: 50px;
    }

    .moving-bus,
    .moving-tram,
    .moving-train {
        width: 60px;
        height: 60px;
    }

    .badge {
        padding: 12px 18px;
    }

    .badge svg {
        width: 32px;
        height: 32px;
    }

    .badge span {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1rem;
    }

    .main-icon {
        width: 70px;
        height: 70px;
    }

    .main-icon svg {
        width: 42px;
        height: 42px;
    }

    .transport-badges {
        gap: 12px;
    }

    .badge {
        padding: 10px 14px;
    }

    .badge svg {
        width: 28px;
        height: 28px;
    }

    .badge span {
        font-size: 0.75rem;
    }
}
</style>
