import LeadCaptureForm from '@/components/LeadCaptureForm';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col lg:flex-row min-h-screen bg-[#0A0A0A]">
      {/* Left side: Hero / Branding */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-16 md:py-24 lg:border-r border-[#262626]">
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <div className="inline-block px-3 py-1 mb-6 text-[10px] md:text-xs font-medium tracking-wider uppercase border border-[#262626] rounded-full text-muted-foreground">
            Premium Real Estate
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAFAFA] mb-6 leading-tight">
            Exclusive Properties. <br className="hidden sm:block" />
            <span className="text-[#A3A3A3]">Unmatched Service.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-md mx-auto lg:mx-0">
            Register your interest to receive priority access to off-market listings and personalized property recommendations.
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-[#A3A3A3]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Accepting new clients
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Lead Capture Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 bg-[#111111]">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-[#FAFAFA] mb-2">Request Access</h2>
            <p className="text-muted-foreground text-sm">Please fill out the form below and our team will be in touch.</p>
          </div>
          <LeadCaptureForm />
        </div>
      </div>
    </main>
  );
}
