import { IMAGES } from "../constent/theme";
import  SelectPicker  from "rsuite/SelectPicker";

const data = [
  "Numero de Personas",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
].map((item) => ({ label: item, value: item }));

const Home3BookTable = () => {
  return (
    <div
      className="container contact-area bg-parallax"
      style={{
        backgroundImage: `url(${IMAGES.images_background_pic13})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="row align-items-center">
        <div className="col-lg-8 col-md-12 m-b30">
          <div className="contact-head">
            <h4 className="title text-white wow fadeInUp">Reservar Mesa</h4>
            <p className="text-white opacity-75 wow fadeInUp">
              Lorem Ipsum tiene una distribucion mas o menos normal
              <br /> de letras, haciendo que parezca texto legible.
            </p>
          </div>
          <form action="#">
            <div className="row">
              <div className="col-lg-6 col-md-6 m-b30 m-xl-b50 wow fadeInUp">
                <div className="input-group input-line">
                  <div className="input-group-prepand">
                    <i className="flaticon-user"></i>
                  </div>
                  <input
                    name="dzFirstName"
                    required
                    type="text"
                    className="form-control"
                    placeholder="Tu Nombre"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 m-b30 wow fadeInUp">
                <div className="input-group input-line">
                  <div className="input-group-prepand">
                    <i className="flaticon-phone-call"></i>
                  </div>
                  <input
                    name="dzPhoneNumber"
                    required
                    type="text"
                    className="form-control dz-number"
                    placeholder="Numero de Telefono"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 m-b30 wow fadeInUp">
                <div className="input-group input-line">
                  <div className="input-group-prepand">
                    <i className="flaticon-two-people"></i>
                  </div>
                  <SelectPicker
                    className="form-select default-select select-option-rsuite"
                    defaultValue={"Numero de Personas"}
                    data={data}
                    searchable={false}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 m-b30 wow fadeInUp">
                <div className="input-group input-line">
                  <div className="input-group-prepand">
                    <i className="flaticon-email-1"></i>
                  </div>
                  <input
                    name="dzEmail"
                    required
                    type="text"
                    className="form-control"
                    placeholder="Tu Correo"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 m-b30 wow fadeInUp">
                <div className="input-group input-line">
                  <div className="input-group-prepand">
                    <i className="flaticon-clock"></i>
                  </div>
                  <input
                    required
                    type="text"
                    className="form-control"
                    id="timePickerOnly"
                    placeholder="Hora"
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6 m-b30 wow fadeInUp">
                <div className="input-group input-line">
                  <div className="input-group-prepand">
                    <i className="flaticon-calendar-date"></i>
                  </div>
                  <input
                    required
                    type="text"
                    className="form-control"
                    id="datePickerOnly"
                    placeholder="Fecha"
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12 ">
                <button
                  type="reset"
                  className="btn btn-md btn-primary btn-hover-3 mt-3"
                >
                  <span className="btn-text" data-text="Reservar Mesa">
                    Reservar Mesa
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-lg-4 col-md-12">
          <div className="widget widget_working bg-primary wow fadeInUp">
            <div className="head">
              <h5 className="title text-white">Informacion de Contacto</h5>
              <p className="text-white opacity-75">
                Lorem Ipsum es texto de relleno de la industria de impresion.
              </p>
            </div>
            <ul>
              <li>
                <i className="flaticon-placeholder"></i>
                <p>
                  1247/Plot No. 39, 15th Phase, Colony, Kkatpally, Hyderabad
                </p>
              </li>
              <li>
                <i className="flaticon-telephone"></i>
                <p>
                  +91 987-654-3210
                  <br />
                  +91 123-456-7890
                </p>
              </li>
              <li>
                <i className="flaticon-email-1"></i>
                <p>
                  info@example.com
                  <br />
                  info@example.com
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home3BookTable;
