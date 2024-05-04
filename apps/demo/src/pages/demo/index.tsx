import Navbar from "@/components/Navbar";
import Pages from "./Pages";
import Referrals from "./Referrals";

export default function index() {
  return (
    <>
      <Navbar />

      <div className="flex flex-col gap-10 max-w-[1280px] m-auto mt-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <img
              src="https://icons.duckduckgo.com/ip3/umami.is.ico"
              alt="website icon"
              className="h-[20px] w-[20px]"
            />
            <span className="text-xl font-medium">worri.com</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>8 current visitors</span>
          </div>
        </div>
        <div className="flex justify-between gap-4 overflow-auto">
          <div className="flex flex-col gap-4 whitespace-nowrap">
            <h2 className="text-3xl font-bold">4.74k</h2>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-muted-foreground">Views</span>
              <span className="px-[5px] text-[0.8rem] font-bold text-green-700 bg-green-200 rounded">
                +1.41k
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 whitespace-nowrap">
            <h2 className="text-3xl font-bold">1.34k</h2>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-muted-foreground">
                Visits
              </span>
              <span className="px-[5px] text-[0.8rem] font-bold text-green-700 bg-green-200 rounded">
                +1.41k
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 whitespace-nowrap">
            <h2 className="text-3xl font-bold">1.74k</h2>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-muted-foreground">
                Visitors
              </span>
              <span className="px-[5px] text-[0.8rem] font-bold text-green-700 bg-green-200 rounded">
                +1.41k
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 whitespace-nowrap">
            <h2 className="text-3xl font-bold">4.74k</h2>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-muted-foreground">
                Bounce Rate
              </span>
              <span className="px-[5px] text-[0.8rem] font-bold text-green-700 bg-green-200 rounded">
                +1.41k
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 whitespace-nowrap">
            <h2 className="text-3xl font-bold">4.74k</h2>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-muted-foreground">
                Average visit time
              </span>
              <span className="px-[5px] text-[0.8rem] font-bold text-green-700 bg-green-200 rounded">
                +1.41k
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex border-t border-b">
            <Pages />
            <Referrals />
          </div>
        </div>
      </div>
    </>
  );
}
