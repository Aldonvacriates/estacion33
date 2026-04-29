// Microsoft Clarity: heatmaps + session recordings. Free, no event cap,
// owned by Microsoft. Renders nothing if the project ID isn't configured,
// so dev builds and unconfigured environments stay silent.
//
// To activate:
//   1. Sign in at https://clarity.microsoft.com with any Microsoft account.
//   2. Create a new project for estacion33.com.
//   3. From "Setup" copy the Project ID — the short string in the snippet
//      that looks like `clarity("set", "PROJECT_ID", ...)` or appears in
//      the page URL: https://clarity.microsoft.com/projects/view/<id>
//   4. In Vercel → Project → Settings → Environment Variables add:
//        NEXT_PUBLIC_CLARITY_PROJECT_ID = <that id>
//      Apply to Production.
//   5. Redeploy. Recordings start appearing in Clarity within minutes; the
//      heatmap page needs ~30 min of traffic to render.
//
// Note on privacy: Clarity records DOM mutations + clicks, not keystrokes
// or input contents (it auto-masks form fields). Already covered in the
// Aviso de Privacidad as an encargado that processes data on Estación 33's
// behalf for usage analysis.

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function ClarityScript() {
  if (!PROJECT_ID) return null;
  // Clarity ships a small loader script that injects their main bundle.
  // We render it as a server-side <script> with the official snippet body.
  const snippet = `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${PROJECT_ID}");
  `;
  return <script dangerouslySetInnerHTML={{ __html: snippet }} />;
}
