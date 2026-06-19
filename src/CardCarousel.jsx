import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules'

export function CardCarousel({
  images,
  autoplayDelay = 2000,
  showPagination = true,
  showNavigation = true,
}) {
  const css = `
    .sol-carousel .swiper { width: 100%; padding-bottom: 48px; --swiper-theme-color: #ffffff; }
    .sol-carousel .swiper-slide { width: 320px; background-position: center; background-size: cover; }
    .sol-carousel .swiper-slide img {
      display: block; width: 100%; border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 30px 70px -34px rgba(0,0,0,0.85);
    }
    .sol-carousel .swiper-3d .swiper-slide-shadow-left,
    .sol-carousel .swiper-3d .swiper-slide-shadow-right { background-image: none; }
    .sol-carousel .swiper-pagination-bullet { background: rgba(255,255,255,0.35); opacity: 1; }
    .sol-carousel .swiper-pagination-bullet-active { background: #ffffff; }
    .sol-carousel .swiper-button-next, .sol-carousel .swiper-button-prev { color: #ffffff; }
    .sol-carousel .swiper-button-next::after, .sol-carousel .swiper-button-prev::after { font-size: 22px; }
  `
  return (
    <div className="sol-carousel">
      <style>{css}</style>
      <Swiper
        spaceBetween={50}
        autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5 }}
        pagination={showPagination}
        navigation={showNavigation}
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="size-full rounded-3xl">
              <img src={image.src} className="size-full rounded-xl" alt={image.alt} loading="lazy" />
            </div>
          </SwiperSlide>
        ))}
        {images.map((image, index) => (
          <SwiperSlide key={`b${index}`}>
            <div className="size-full rounded-3xl">
              <img src={image.src} className="size-full rounded-xl" alt={image.alt} loading="lazy" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
