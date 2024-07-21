import Swiper from "swiper"
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

import { getBanners, onBannerView, onBannerClick } from "./api"
import { getDetails } from "./utils"
import slider from "./html/slider.html"
// import "./style/style.css"

export async function init(config) {
    const { containerId, spaceId, skinId } = config

    const container = document.getElementById(containerId)

    if (container) {
        const details = getDetails()
        const banners = await getBanners(spaceId)

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
            container.innerHTML = slider
            const swiperWrapper = document.getElementById("bs-slider-wrapper")

            const slides = banners.map((banner) => {
                const swiperSlide = document.createElement("div")
                swiperSlide.className = "swiper-slide"
                swiperSlide.setAttribute("data-id", banner.id)
                swiperSlide.addEventListener("click", () =>
                    onBannerClick(banner.id, spaceId, skinId, details)
                )
                const imgSlide = document.createElement("img")
                imgSlide.src = `http://betdemo.s3.eu-central-1.amazonaws.com/${banner.preview}`
                swiperSlide.appendChild(imgSlide)
                swiperWrapper.appendChild(swiperSlide)

                return swiperSlide
            })

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
            const banner = banners[0]
            const image = new Image()
            image.src = `http://betdemo.s3.eu-central-1.amazonaws.com/${banner.preview}`
            image.setAttribute("data-id", banner.id)
            image.addEventListener("click", () =>
                onBannerClick(banner.id, spaceId, skinId, details)
            )
            observer.observe(image)
            container.innerHTML = image
        }
    }
}
