import { IMAGES } from "../constent/theme";
import Lottie from "react-lottie-player";
import lottieJson from "../assets/json/coming-soon.json";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import { FormEvent, useRef, useState } from "react";

const ComingSoon = () => {
  const [input, setInput] = useState<string>("");
  const form = useRef<HTMLFormElement | null>(null);
  const heartRef = useRef<HTMLSpanElement | null>(null);
  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    setInput("");
    if (form.current) {
      emailjs
        .sendForm(
          "emailId",
          "template_0byuv32",
          form.current,
          "qUDIPykc776NYHv4m"
        )
        .then(
          () => {
            toast.success("Enviado correctamente!");
          },
          (error) => {
            toast.error(error.text);
          }
        );
    }
  };
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={true} />
      <div className="page-content bg-white">
        <div className="coming-wrapper overflow-hidden">
          <div className="container">
            <img
              className="bg-img dz-move"
              src={IMAGES.background_pic17}
              alt="/"
            />
            <div className="row">
              <div className="col-lg-8 m-auto">
                <div className="inner-content text-center">
                  <div className="logo-header">
                    <Link to="/" className="logo anim-logo">
                      <img src={IMAGES.logo} alt="/" />
                    </Link>
                  </div>
                  <h3 className="coming-head">¡PRONTO LLEGAMOS!</h3>
                  <p className="coming-para">
                    Mantente atento a algo increíble
                  </p>
                  <Lottie
                    className="coming-media"
                    loop
                    animationData={lottieJson}
                    play
                  />
                </div>
                <div className="middle-content">
                  <h5 className="font-weight-400 m-b20">
                    Suscríbete a nuestra lista para recibir las últimas
                    novedades
                  </h5>
                  <form
                    className="dzSubscribe m-b15"
                    ref={form}
                    onSubmit={sendEmail}
                  >
                    <div className="dzSubscribeMsg text-white"></div>
                    <div className="input-group">
                      <input
                        name="dzEmail"
                        required
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                        }}
                        type="text"
                        className="form-control bg-grey"
                        placeholder="Ingresa tu correo"
                      />
                      <div className="input-group-addon">
                        <button
                          name="submit"
                          value="submit"
                          type="submit"
                          className="btn btn-primary btn-hover-2"
                        >
                          <span>Enviar Solicitud</span>
                          <i className="fa-solid fa-paper-plane"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="dz-social-icon text-center">
                    <ul>
                      <li>
                        <Link
                          target="_blank"
                          className="text-dark"
                          to="https://www.facebook.com/"
                        >
                          <i className="fab fa-facebook-f"></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          className="text-dark"
                          to="https://twitter.com/"
                        >
                          <i className="fab fa-twitter"></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          className="text-dark"
                          to="https://www.youtube.com/"
                        >
                          <i className="fa-brands fa-youtube"></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          className="text-dark"
                          to="https://www.instagram.com/"
                        >
                          <i className="fab fa-instagram"></i>
                        </Link>
                      </li>
                      <li>
                        <Link
                          target="_blank"
                          className="text-dark"
                          to="https://www.linkedin.com/"
                        >
                          <i className="fa-brands fa-linkedin-in"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="coming-footer text-center">
                  <p>
                    © 2023{" "}
                    <span
                      className="heart"
                      ref={heartRef}
                      onClick={() => {
                        heartRef.current?.classList.toggle("heart-blast");
                      }}
                    ></span>{" "}
                    por{" "}
                    <Link to="https://dexignzone.com/" target="_blank">
                      DexignZone
                    </Link>{" "}
                    | 2023 Todos los derechos reservados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
