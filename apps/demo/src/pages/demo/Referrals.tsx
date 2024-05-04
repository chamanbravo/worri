const referrersAnalytics = [
  {
    domain: "none",
    views: 1024,
    percentage: 42,
    favicon: undefined,
  },
  {
    domain: "docs.com",
    views: 450,
    percentage: 16,
    favicon: "https://icons.duckduckgo.com/ip3/google.com.ico",
  },
  {
    domain: "/pricing",
    views: 268,
    percentage: 10,
    favicon: "https://icons.duckduckgo.com/ip3/google.com.ico",
  },
  {
    domain: "/pricing/docs",
    views: 268,
    percentage: 5,
    favicon: "https://icons.duckduckgo.com/ip3/google.com.ico",
  },
  {
    domain: "/features",
    views: 268,
    percentage: 4,
    favicon: "https://icons.duckduckgo.com/ip3/google.com.ico",
  },
];

export default function Referrals() {
  return (
    <div className="flex flex-col w-full gap-4 py-6 pl-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Referrers</h3>
        <h3>Views</h3>
      </div>
      <div className="flex flex-col gap-2">
        {referrersAnalytics.map((page, i) => {
          return (
            <div
              className="flex items-center justify-between px-2 rounded hover:bg-gray-500/15 group"
              key={i}
            >
              <div className="flex items-center gap-3">
                {page.favicon && (
                  <img src={page.favicon} className="w-4 h-4" alt="favicon" />
                )}
                <span className="text-muted-foreground">{page.domain}</span>
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
