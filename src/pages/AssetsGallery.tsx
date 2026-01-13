import { useEffect } from "react";
import { IMAGES } from "../constent/theme";

const AssetsGallery = () => {
  useEffect(() => {
    document.body.setAttribute("data-color", "color_1");
  }, []);

  const items = Object.entries(IMAGES)
    .map(([key, value]) => {
      const src = String(value);
      const isVideo = /\.(mp4|webm|ogg)(\?|#|$)/i.test(src);
      return { key, src, isVideo };
    })
    .sort((a, b) => a.key.localeCompare(b.key));

  return (
    <div className="page-content bg-white">
      <section className="content-inner">
        <div className="container">
          <div className="section-head text-center">
            <h2 className="title wow flipInX">Galeria de Recursos</h2>
            <p>Cada recurso importado en theme.tsx se muestra aqui.</p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "16px",
            }}
          >
            {items.map(({ key, src, isVideo }) => (
              <div
                key={key}
                style={{
                  border: "1px solid #e9e9e9",
                  borderRadius: "10px",
                  background: "#fff",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    background: "#f6f6f6",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {isVideo ? (
                    <video
                      src={src}
                      muted
                      loop
                      autoPlay
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={src}
                      alt={key}
                      loading="lazy"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.4",
                    color: "#333",
                    wordBreak: "break-word",
                    textAlign: "center",
                  }}
                >
                  {key}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssetsGallery;
