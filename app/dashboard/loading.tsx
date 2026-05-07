export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <header className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-[#111111] rounded"></div>
            <div className="h-4 w-64 bg-[#111111] rounded"></div>
          </div>
          <div className="h-10 w-24 bg-[#111111] rounded"></div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-[#111111] border border-[#262626] rounded-lg"></div>
          ))}
        </div>

        <div className="h-[400px] bg-[#111111] border border-[#262626] rounded-lg"></div>
      </div>
    </div>
  );
}
