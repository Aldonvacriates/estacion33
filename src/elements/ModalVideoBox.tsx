import { useState } from "react";
import ModalVideo from "react-modal-video";
import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";

const ModalVideoBox = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ModalVideo
        channel="youtube"
        youtube={{ mute: 0, autoplay: 1 }}
        isOpen={open}
        videoId="XJb1G9iRoL4"
        onClose={() => setOpen(false)}
      />
      <section className="content-inner pb-0">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="title">Te Invitamos a Visitar Nuestro Restaurante</h2>
            <p className="about-p">
              Lorem Ipsum es simplemente texto de relleno de la industria de la
              imprenta y la tipografia. Lorem Ipsum ha sido el texto de relleno
              estandar de la industria desde los anos 1500, cuando un impresor
              desconocido tomo una galera de tipos y la mezclo para hacer un
              libro de muestras.
            </p>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="about-media dz-media rounded-md">
                <img src={IMAGES.background_pic11} alt="/" />
                <Link
                  className="video video-btn popup-youtube"
                  to={"#"}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  <i className="fa-solid fa-play"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ModalVideoBox;
