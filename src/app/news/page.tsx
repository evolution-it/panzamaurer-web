import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import newsData from "@/data/news.json";

export const metadata = {
  title: "News | Panza Maurer",
};

function parseDate(dateStr: string): number {
  return new Date(dateStr).getTime();
}

const posts = [...newsData.articles]
  .sort((a, b) => parseDate(b.date) - parseDate(a.date))
  .slice(0, 6);

export default function NewsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full pt-[109px]">
        <PageHero
          title="News"
          subtitle="Recent Firm News & Events"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "News" },
          ]}
        />

        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-12 lg:px-28">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const image =
                  post.listing_images.length > 0
                    ? `/images/news/${post.listing_images[0]}`
                    : null;
                return (
                  <Link
                    key={post.slug}
                    href={`/news/${post.slug}`}
                    className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md"
                  >
                    {image && (
                      <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
                        <Image
                          src={image}
                          alt={post.title}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <p className="text-sm font-medium text-gray-400">{post.date}</p>
                      <h3 className="font-[family-name:var(--font-hanken)] text-lg font-semibold leading-snug text-gray-950">
                        {post.title}
                      </h3>
                      <p className="flex-1 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                      <span className="mt-2 text-sm font-semibold text-primary-red transition-colors group-hover:text-red-800">
                        Read More →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
