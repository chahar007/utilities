import classes from './HomeCarousel.module.scss';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import required modules
import { Pagination, Navigation } from 'swiper/modules';

const HomeCarousel = () => {
  const slides = [
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
      title: 'Counter-Strike: Global Offensive',
      description: 'Join the ultimate tactical shooter with competitive gameplay and intense action.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg',
      title: 'The Witcher 3: Wild Hunt',
      description: 'Step into the shoes of Geralt of Rivia and explore a vast, breathtaking fantasy world.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg',
      title: 'Red Dead Redemption 2',
      description: 'Experience life in the Wild West in this epic story of outlaws and survival.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/812140/header.jpg',
      title: 'Assassin’s Creed Odyssey',
      description: 'Forge your own epic journey through Ancient Greece as a legendary hero.',
    },
    {
      image: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
      title: 'Grand Theft Auto V',
      description: 'Dive into the world of crime, heists, and thrilling adventures in Los Santos.',
    },
  ];

  return (
    <div className={classes.carouselContainer}>
      <Swiper
        slidesPerView={2}
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
          <SwiperSlide key={index} className={classes.slide}>
            <div
              className={classes.card}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={classes.overlay}>
                <h2 className={classes.title}>{slide.title}</h2>
                <p className={classes.description}>{slide.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCarousel;
