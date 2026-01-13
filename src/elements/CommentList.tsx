import { Link } from "react-router-dom";
import { IMAGES } from "../constent/theme";
import { useRef } from "react";

const CommentList = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  return (
    <>
      <div className="clear" id="comment-list">
        <div className="comments-area" id="comments">
          <h4 className="comments-title">Comentarios (03)</h4>
          <div className="clearfix">
            <ul className="comment-list">
              <li className="comment">
                <div className="comment-body">
                  <div className="comment-author vcard">
                    <img
                      className="avatar photo"
                      src={IMAGES.testimonial_mini_pic1}
                      alt="/"
                    />
                    <cite className="fn">Monsur Rahman Lito</cite>
                  </div>
                  <p className="font-14 mb-0">
                    Lorem Ipsum es simplemente texto de relleno de la industria
                    de la imprenta y la tipografia. Lorem Ipsum ha sido el
                    texto de relleno estandar de la industria desde los anos
                    1500, cuando un impresor desconocido tomo una galera de
                    tipos y la mezclo para hacer un libro de muestras.
                  </p>
                  <div className="reply">
                    <Link to={"#"} className="comment-reply-link">
                      Responder
                    </Link>
                  </div>
                </div>
                <ol className="children">
                  <li className="comment odd parent">
                    <div className="comment-body">
                      <div className="comment-author vcard">
                        <img
                          className="avatar photo"
                          src={IMAGES.testimonial_mini_pic2}
                          alt="/"
                        />
                        <cite className="fn">Jake Johnson</cite>
                      </div>
                      <p className="font-14 mb-0">
                        Lorem Ipsum es simplemente texto de relleno de la
                        industria de la imprenta y la tipografia. Lorem Ipsum
                        ha sido el texto de relleno estandar de la industria
                        desde los anos 1500, cuando un impresor desconocido
                        tomo una galera de tipos y la mezclo para hacer un
                        libro de muestras.
                      </p>
                      <div className="reply">
                        <Link to={"#"} className="comment-reply-link">
                          Responder
                        </Link>
                      </div>
                    </div>
                  </li>
                </ol>
              </li>
              <li className="comment">
                <div className="comment-body">
                  <div className="comment-author vcard">
                    <img
                      className="avatar photo"
                      src={IMAGES.testimonial_mini_pic3}
                      alt="/"
                    />
                    <cite className="fn">John Doe</cite>
                  </div>
                  <p className="font-14 mb-0">
                    Lorem Ipsum es simplemente texto de relleno de la industria
                    de la imprenta y la tipografia. Lorem Ipsum ha sido el
                    texto de relleno estandar de la industria desde los anos
                    1500, cuando un impresor desconocido tomo una galera de
                    tipos y la mezclo para hacer un libro de muestras.
                  </p>
                  <div className="reply">
                    <Link to={"#"} className="comment-reply-link">
                      Responder
                    </Link>
                  </div>
                </div>
              </li>
            </ul>
            <div className="comment-respond style-1" id="respond">
              <h4 className="comment-reply-title" id="reply-title">
                Buenos Comentarios
                <small>
                  <Link to={"#"} id="cancel-comment-reply-link" rel="nofollow">
                    Cancelar respuesta
                  </Link>
                </small>
              </h4>
              <form
                className="comment-form"
                id="commentform"
                method="post"
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <p className="comment-form-author">
                  <label htmlFor="author">
                    Nombre <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="dzName"
                    placeholder="Autor"
                    id="author"
                  />
                </p>
                <p className="comment-form-email">
                  <label htmlFor="email">
                    Correo <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Correo"
                    name="dzEmail"
                    id="email"
                  />
                </p>
                <p className="comment-form-comment">
                  <label htmlFor="comment">Comentario</label>
                  <textarea
                    rows={8}
                    name="comment"
                    placeholder="Escribe tu comentario aqui"
                    id="comment"
                  ></textarea>
                </p>
                <p className="form-submit">
                  <button
                    type="reset"
                    className="btn btn-primary btn-hover-1"
                    id="submit"
                    onReset={() => {
                      formRef.current?.reset();
                    }}
                  >
                    <span>Enviar Ahora</span>
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentList;
