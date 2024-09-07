import Swiper from "swiper"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

import { getBanners, onBannerView, onBannerClick } from "./api"
import { getDetails, createBanner } from "./utils"

import "./style/style.css"

export async function init(config) {
    const { containerId, spaceId, skinId } = config

    const container = document.getElementById(containerId)

    if (container) {
        const details = getDetails()
        const { banners } = await getBanners(spaceId)

        if (!banners.length) return

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute("data-id")
                        onBannerView(id, spaceId, skinId, details)
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.5 }
        )

        if (banners.length > 1) {
            const swiper = document.createElement("div")
            swiper.className = "swiper"
            const swiperWrapper = document.createElement("div")
            swiperWrapper.className = "swiper-wrapper"

            const slides = banners.map((banner) => {
                const swiperSlide = document.createElement("div")
                swiperSlide.className = "swiper-slide"
                swiperSlide.setAttribute("data-id", banner._id)
                swiperSlide.addEventListener("click", () =>
                    onBannerClick(banner._id, spaceId, skinId, details)
                )
                const bannerHtml = createBanner(banner)
                swiperSlide.appendChild(bannerHtml)
                swiperWrapper.appendChild(swiperSlide)
                return swiperSlide
            })

            swiper.appendChild(swiperWrapper)
            container.appendChild(swiper)

            const effect = config.transition
            const loop = config.infiniteLoop === "yes"
            const delay = +config.transitionSpeed * 1000
            const pauseOnMouseEnter = config.pauseOnHover === "yes"
            const hasAutoplay = config.autoplay === "yes"
            const hasPagination = config.navigation.includes("dots")
            const hasNavigation = config.navigation.includes("arrows")
            const modules = []
            hasAutoplay && modules.push(Autoplay)
            hasPagination && modules.push(Pagination)
            hasNavigation && modules.push(Navigation)
            effect === "fade" && modules.push(EffectFade)

            if (hasNavigation) {
                const prevBtn = document.createElement("div")
                prevBtn.className = "swiper-button-prev"
                const nextBtn = document.createElement("div")
                nextBtn.className = "swiper-button-next"

                swiper.appendChild(prevBtn)
                swiper.appendChild(nextBtn)
            }

            new Swiper(".swiper", {
                modules,
                effect,
                loop,
                autoplay: {
                    delay,
                    pauseOnMouseEnter,
                },
                pagination: {
                    clickable: true,
                    el: ".swiper-pagination",
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            })
            slides.forEach((slide) => observer.observe(slide))
        } else {
            const bannerHtml = createBanner(banners[0])
            bannerHtml.addEventListener("click", () =>
                onBannerClick(banners[0]._id, spaceId, skinId, details)
            )

            observer.observe(bannerHtml)
            container.appendChild(bannerHtml)
        }
    }
}
