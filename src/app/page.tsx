import { redirect } from "next/navigation";

// The portfolio is a pure static site (HTML/CSS/JS) living in /public/portfolio.
// The root route simply redirects there so it renders in the preview.
// To deploy standalone, upload the contents of /public/portfolio to Cloudflare Pages.
export default function Home() {
  redirect("/portfolio/index.html");
}
