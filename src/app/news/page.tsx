export const revalidate = 300

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";
import { getDraftModeClient } from "@/sanity/draftMode";
import { urlFor } from "@/sanity/image";
import { LATEST_NEWS_QUERY } from "@/sanity/queries/news";
import type { SanityImageSource } from "@sanity/image-url";

export const metadata = {
  title: "News | Panza Maurer",
};

type NewsCard = {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  excerpt: string;
  categories: string[];
  listingImages?: SanityImageSource | null;
};

export default async function NewsPage() {
  const { sanityClient, cacheTags } = await getDraftModeClient();

  const posts: NewsCard[] = await sanityClient.fetch(
    LATEST_NEWS_QUERY,
    {},
    cacheTags(["news"]),
  );

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main id="main-content" className="w-full pt-[109px]">
        <PageHero title="News" subtitle="Recent Firm News & Events" />

        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-12 lg:px-28">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const listingImg = post.listingImages
                  ? urlFor(post.listingImages).width(600).height(400).url()
                  : null;
                return (
                  <Link
                    key={post._id}
                    href={`/news/${post.slug.current}`}
                    className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md"
                  >
                    {listingImg && (
                      <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
                        <Image
                          src={listingImg}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <time
                        dateTime={post.date}
                        className="text-sm font-medium text-gray-400"
                      >
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <h3 className="font-[family-name:var(--font-hanken)] text-lg font-semibold leading-snug text-gray-950">
                        {post.title}
                      </h3>
                      <p className="flex-1 text-sm leading-6 text-gray-600">
                        {post.excerpt}
                      </p>
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
        <Link
          href="/news/archive"
          className="group inline-flex items-center gap-3 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-red"
        >
          News Archive
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors group-hover:border-primary-red group-hover:text-primary-red"
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
              focusable="false"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </span>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
