import { IMAGES } from "../constent/theme";
import CommonBanner from "../elements/CommonBanner";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import { useState } from "react";

const options = [
  { value: "Åland Islands", label: "Islas Aland" },
  { value: "Afghanistan", label: "Afganistan" },
  { value: "Albania", label: "Albania" },
  { value: "Algeria", label: "Argelia" },
  { value: "Andorra", label: "Andorra" },
  { value: "Angola", label: "Angola" },
  { value: "Anguilla", label: "Anguila" },
  { value: "Antarctica", label: "Antartida" },
  { value: "Antigua and Barbuda", label: "Antigua y Barbuda" },
  { value: "Argentina", label: "Argentina" },
  { value: "Armenia", label: "Armenia" },
  { value: "Aruba", label: "Aruba" },
  { value: "Australia", label: "Australia" },
];

interface OptionParams {
  isFocused: boolean;
  isSelected: boolean;
}

const colourStyles = {
  option: (styles: any, { isFocused, isSelected }: OptionParams) => {
    return {
      ...styles,
      backgroundColor: isSelected
        ? "var(--primary)"
        : isFocused
        ? "#f2f2f4"
        : null,
      color: isSelected ? "#fff" : "#333333",
    };
  },
};

const ShopCheckout = () => {
  const [open, setOpen] = useState(false);
  const [colleps, setColleps] = useState(false);
  return (
    <div className="page-content bg-white">
      <CommonBanner
        img={IMAGES.images_bnr3}
        title="Finalizar Compra"
        subtitle="Finalizar Compra"
      />

      <section className="content-inner">
        <div className="container">
          <form className="shop-form">
            <div className="row">
              <div className="col-lg-6">
                <div className="widget">
                  <h4 className="widget-title">Direccion de Facturacion y Envio</h4>
                  <FormGroup />

                  <Button
                    style={{ border: "none" }}
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                    className="btn btn-gray btnhover mb-3"
                  >
                    Crear una cuenta <i className="fa fa-angle-down m-l10"></i>
                  </Button>
                  <Collapse in={open}>
                    <div id="example-collapse-text">
                      <p>
                        Crea una cuenta ingresando la informacion abajo. Si ya
                        eres cliente, inicia sesion en la parte superior.
                      </p>
                      <div className="form-group">
                        <input
                          name="Password"
                          type="password"
                          className="form-control"
                          placeholder="Contrasena"
                        />
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>

              <div className="col-lg-6">
                <div>
                  <Button
                    style={{ border: "none" }}
                    onClick={() => setColleps(!colleps)}
                    aria-controls="example-collapse-text"
                    aria-expanded={colleps}
                    className="btn btn-gray btnhover mb-3"
                  >
                    Enviar a una direccion diferente{" "}
                    <i className="fa fa-angle-down m-l10"></i>
                  </Button>
                  <Collapse in={colleps}>
                    <div id="example-collapse-text">
                      <p>
                        Si ya compraste con nosotros, ingresa tus datos abajo.
                        Si eres un cliente nuevo, continua con la seccion de
                        Facturacion y Envio.
                      </p>

                      <FormGroup />
                      <p>
                        Crea una cuenta ingresando la informacion abajo. Si ya
                        eres cliente, inicia sesion en la parte superior.
                      </p>
                    </div>
                  </Collapse>
                </div>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Notas sobre tu pedido, por ejemplo indicaciones para entrega"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
          <MenuList />
        </div>
      </section>
    </div>
  );
};

export default ShopCheckout;

export function FormGroup() {
  return (
    <>
      <div className="form-group m-b20">
        <Select
          className="form-select default-select"
          classNamePrefix="select"
          defaultValue={options[0]}
          isClearable={false}
          options={options}
          styles={colourStyles}
        />
      </div>
      <div className="row">
        <div className="form-group col-md-6 m-b20">
          <input
            name="dzFirstName"
            required
            type="text"
            className="form-control"
            placeholder="Nombre"
          />
        </div>
        <div className="form-group col-md-6 m-b20">
          <input
            name="dzLastName"
            required
            type="text"
            className="form-control"
            placeholder="Apellido"
          />
        </div>
      </div>
      <div className="form-group m-b20">
        <input
          name="dzOther[CompanyType]"
          required
          type="text"
          className="form-control"
          placeholder="Nombre de la Empresa"
        />
      </div>
      <div className="form-group m-b20">
        <input
          name="dzOther[Address]"
          required
          type="text"
          className="form-control"
          placeholder="Direccion"
        />
      </div>
      <div className="row">
        <div className="form-group col-md-6 m-b20">
          <input
            name="dzOther[Other]"
            required
            type="text"
            className="form-control"
            placeholder="Apartamento, suite, unidad, etc."
          />
        </div>
        <div className="form-group col-md-6 m-b20">
          <input
            name="dzOther[Town/City]"
            required
            type="text"
            className="form-control"
            placeholder="Ciudad"
          />
        </div>
      </div>
      <div className="row">
        <div className="form-group col-md-6 m-b20">
          <input
            name="dzOther[State/County]"
            required
            type="text"
            className="form-control"
            placeholder="Estado / Provincia"
          />
        </div>
        <div className="form-group col-md-6 m-b20">
          <input
            name="Postcode/Zip"
            required
            type="text"
            className="form-control"
            placeholder="Codigo Postal"
          />
        </div>
      </div>
      <div className="row">
        <div className="form-group col-md-6 m-b20">
          <input
            name="dzEmail"
            required
            type="email"
            className="form-control"
            placeholder="Correo"
          />
        </div>
        <div className="form-group col-md-6 m-b20">
          <input
            name="dzPhoneNumber"
            required
            type="text"
            className="form-control dz-number"
            placeholder="Telefono"
          />
        </div>
      </div>
    </>
  );
}

const opetion2 = [
  { value: "Tipo de Tarjeta", label: "Tipo de Tarjeta" },
  { value: "Otra opcion", label: "Otra opcion" },
  { value: "Una opcion", label: "Una opcion" },
  { value: "Papa", label: "Papa" },
];
export function MenuList() {
  return (
    <>
      <div className="dz-divider bg-gray-dark icon-center my-5">
        <i className="fa fa-circle bg-white text-primary"></i>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="widget">
            <h4 className="widget-title">Tu Pedido</h4>
            <table className="table-bordered check-tbl">
              <thead className="text-center">
                <tr>
                  <th>IMAGEN</th>
                  <th>NOMBRE DEL PRODUCTO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="product-item-img">
                    <img src={IMAGES.gallery_small_pic4} alt="/" />
                  </td>
                  <td className="product-item-name">Producto 4</td>
                  <td className="product-price">$36.00</td>
                </tr>
                <tr>
                  <td className="product-item-img">
                    <img src={IMAGES.gallery_small_pic3} alt="/" />
                  </td>
                  <td className="product-item-name">Producto 3</td>
                  <td className="product-price">$25.00</td>
                </tr>
                <tr>
                  <td className="product-item-img">
                    <img src={IMAGES.gallery_small_pic2} alt="/" />
                  </td>
                  <td className="product-item-name">Producto 2</td>
                  <td className="product-price">$22.00</td>
                </tr>
                <tr>
                  <td className="product-item-img">
                    <img src={IMAGES.gallery_small_pic1} alt="/" />
                  </td>
                  <td className="product-item-name">Producto 1</td>
                  <td className="product-price">$28.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-6">
          <form className="shop-form widget">
            <h4 className="widget-title">Total del Pedido</h4>
            <table className="table-bordered check-tbl mb-4">
              <tbody>
                <tr>
                  <td>Subtotal</td>
                  <td className="product-price">$125.96</td>
                </tr>
                <tr>
                  <td>Envio</td>
                  <td>Envio Gratis</td>
                </tr>
                <tr>
                  <td>Cupon</td>
                  <td className="product-price">$28.00</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td className="product-price-total">$506.00</td>
                </tr>
              </tbody>
            </table>
            <h4 className="widget-title">Metodo de Pago</h4>
            <div className="form-group m-b20">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre en la Tarjeta"
              />
            </div>
            <div className="form-group m-b20">
              <Select
                className="form-select default-select"
                classNamePrefix="select"
                defaultValue={opetion2[0]}
                isClearable={false}
                options={opetion2}
                styles={colourStyles}
              />
            </div>
            <div className="form-group m-b20">
              <input
                name="dzOther[CreditCardNumber]"
                type="text"
                className="form-control"
                placeholder="Numero de Tarjeta"
              />
            </div>
            <div className="form-group m-b20">
              <input
                name="dzOther[CardVerificationNumber]"
                type="text"
                className="form-control"
                placeholder="Codigo de Verificacion"
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-gray btn-hover-2"
                type="submit"
                value="submit"
                name="submit"
              >
                Realizar Pedido Ahora{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
