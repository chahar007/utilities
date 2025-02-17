import classes from './HomeCarousel.module.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeCarousel = ({slides}) => {
  const [slidesCount, setSlidesCount] = useState(2);
  const navigate = useNavigate();

  useEffect(() => {

    const newWidth = window.innerWidth;
    if(newWidth <= 768) {
      setSlidesCount(1);
    } else {
      setSlidesCount(2);
    }

    const handleResize = () => {
      const newWidth = window.innerWidth;
      if(newWidth <= 768) {
        setSlidesCount(1);
      } else {
        setSlidesCount(2);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [])

  const hanldeNavigation = (slug) => {
    navigate(`/game-detail/${slug}`);
  }

  return (
    <div className={classes.carouselContainer}>
      <Swiper
        slidesPerView={slidesCount}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className={classes.mySwiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={classes.slide} onClick={() => hanldeNavigation(slide?.slug)} >
            <div
              className={classes.card}
              style={{ backgroundImage: `url(${slide.bannerImage})` }}
            >
              <div className={classes.overlay}>
                <h2 className={classes.title}>{slide.title}</h2>
                <p className={classes.description}>{slide.description.slice(0, 100)}...</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCarousel;
