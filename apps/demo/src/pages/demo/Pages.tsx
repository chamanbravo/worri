import { ExternalLink } from "lucide-react";

const pagesAnalytics = [
  {
    page: "/",
    views: 1024,
    percentage: 42,
  },
  {
    page: "/docs",
    views: 450,
    percentage: 16,
  },
  {
    page: "/pricing",
    views: 268,
    percentage: 10,
  },
  {
    page: "/pricing/docs",
    views: 268,
    percentage: 5,
  },
  {
    page: "/features",
    views: 268,
    percentage: 4,
  },
];

export default function Pages() {
  return (
    <div className="flex flex-col w-full gap-4 py-6 pr-6 border-r">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Pages</h3>
        <h3>Views</h3>
      </div>
      <div className="flex flex-col gap-2">
        {pagesAnalytics.map((page, i) => {
          return (
            <div
              className="flex items-center justify-between px-2 rounded hover:bg-gray-500/15 group"
              key={i}
            >
              <div className="flex items-center gap-12">
                <span className="text-muted-foreground">{page.page}</span>
                <ExternalLink
                  size={15}
                  className="hidden cursor-pointer text-muted-foreground hover:text-blue-400 group-hover:block"
                />
              </div>

              <div className="flex items-center gap-2">
                <span>{page.views}</span>
                <div className="relative w-12 h-full">
                  <div
                    className={`absolute h-full bg-[#445165] -z-10 border-l border-blue-300`}
                    style={{ width: page.percentage + "%" }}
                  />
                  <span className="px-2 text-center text-muted-foreground">
                    {page.percentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
