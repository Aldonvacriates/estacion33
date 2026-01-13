import { Swiper, SwiperSlide } from "swiper/react";
import { Home2TestimonialArr } from "../elements/JsonData";
import { Autoplay, Navigation } from "swiper/modules";

const Home2Testimonial = () => {
  return (
    <Swiper
      className="swiper testimonial-two-swiper swiper-btn-lr swiper-single swiper-visible"
      speed={1500}
      loop={true}
      modules={[Navigation, Autoplay]}
      autoplay={{
        delay: 1500,
      }}
      navigation={{
        prevEl: ".testimonial-2-button-prev",
        nextEl: ".testimonial-2-button-next",
      }}
    >
      {Home2TestimonialArr.map(({ img, name, position }, ind) => (
        <SwiperSlide className="swiper-slide" key={ind}>
          <div className="testimonial-2">
            <div className="dz-media">
              <img src={img} alt="/" />
            </div>
            <div className="testimonial-detail">
              <div className="testimonial-text wow fadeInUp">
                <p>
                  Hay muchas variaciones de pasajes de Lorem Ipsum disponibles,
                  pero la mayoria han sufrido alteraciones de alguna forma, por
                  humor insertado o palabras aleatorias que no parecen ni un
                  poco creibles. Si vas a usar un pasaje de Lorem Ipsum,
                  necesitas asegurarte de que no haya nada vergonzoso escondido
                  en medio del texto.
                </p>
              </div>
              <div className="testimonial-info wow fadeInUp">
                <h5 className="testimonial-name">{name}</h5>
                <span className="testimonial-position">{position}</span>
              </div>
              <i className="flaticon-right-quote quote"></i>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <div className="pagination">
        <div className="testimonial-2-button-prev btn-prev rounded-xl btn-hover-2">
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className="testimonial-2-button-next btn-next rounded-xl btn-hover-2">
          <i className="fa-solid fa-arrow-right"></i>
        </div>
      </div>
    </Swiper>
  );
};

export default Home2Testimonial;
