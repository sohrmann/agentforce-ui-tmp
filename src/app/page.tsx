"use client";
import SimpleHeader from "@/components/SimpleHeader";
import { clientEnv } from "@/config/client-env";
import ChatBubble from "@/chat/ChatBubble";
import AgentforceLogo from "@/components/AgentforceLogo";
import HerokuIcon from "@/components/HerokuIcon";
import BackgroundPattern from "@/components/BackgroundPattern";
import Feature from "@/components/Feature";
import { useChat } from "@/chat/ChatContext";

export default function HomePage() {
  const { openChat } = useChat();
  return (
    <div className="min-h-screen w-full md:h-screen md:overflow-hidden">
      {/* Full-Width Wavy Background */}
      <BackgroundPattern />

      {/* Content Container - Flexible height for mobile scrolling */}
      <div className="relative z-10 min-h-full md:h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <SimpleHeader />
        </div>

        {/* Main Content - Flexible layout for mobile */}
        <div className="flex-1 flex flex-col md:min-h-0">
          {/* Hero Section - Responsive spacing */}
          <div className="flex-1 flex items-center justify-center sm:px-4 py-8 md:py-0">
            <div className="max-w-6xl mx-auto text-center">
              {/* CTA Card */}
              <div className="max-w-6xl md:max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 md:p-10 border border-white/20">
                  <div className="mb-6 md:mb-4">
                    {/* Logos with Enhanced Glow Effect */}
                    <div className="flex justify-center items-center gap-3 mb-6 md:mb-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-white backdrop-blur-lg rounded-xl flex items-center justify-center shadow-xl border border-white/20">
                          <HerokuIcon width={40} height={40} alt="Heroku" />
                        </div>
                        <div className="absolute -inset-1 bg-white/10 rounded-xl blur-sm"></div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-herokuMain/20 to-salesforceMain/20 rounded-full blur-md"></div>
                      </div>

                      <div className="text-xl text-white/60">+</div>

                      <div className="relative">
                        <div className="w-14 h-14 bg-white backdrop-blur-lg rounded-xl flex items-center justify-center shadow-xl border border-white/20">
                          <AgentforceLogo size="large" alt="AI Assistant" />
                        </div>
                        <div className="absolute -inset-1 bg-white/10 rounded-xl blur-sm"></div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-herokuMain/20 to-salesforceMain/20 rounded-full blur-md"></div>
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                      <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent filter drop-shadow-lg">
                        {clientEnv.NEXT_PUBLIC_APP_TITLE}
                      </span>
                    </h1>
                  </div>
                  <button
                    onClick={openChat}
                    className="group w-2/3 mx-auto bg-herokuMain/70 hover:bg-herokuMain/80 text-white font-semibold py-3 md:py-2 px-6 md:px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Open Chat
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* Features Section */}
                  <div className="mt-6 md:mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-3">
                      <Feature
                        icon="🎯"
                        title="Your UI, Your Rules"
                        description="Tailor your agent interface to your development needs"
                        gradientFrom="from-purple-400"
                        gradientTo="to-purple-600"
                      />

                      <Feature
                        icon="💬"
                        title="Production Ready"
                        description="Vibe coding meets best practices on Heroku"
                        gradientFrom="from-emerald-400"
                        gradientTo="to-emerald-600"
                      />

                      <Feature
                        icon="⚡"
                        title="Flexible & Secure"
                        description="Heroku's flexibility with a Salesforce foundation"
                        gradientFrom="from-blue-400"
                        gradientTo="to-blue-600"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-white/70 flex items-center justify-center gap-1 mt-4 md:mt-3">
                    <span>Powered by</span>
                    <span className="font-semibold text-white">
                      <a
                        href="https://www.heroku.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-200 transition-colors"
                      >
                        Heroku
                      </a>
                      {" & "}
                      <a
                        href="https://www.salesforce.com/products/agentforce/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-200 transition-colors"
                      >
                        Agentforce
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remove the old Features Section */}
        </div>
      </div>

      {/* Chat Bubble */}
      <ChatBubble welcomeMessage={clientEnv.NEXT_PUBLIC_APP_INTRO_MESSAGE} />
    </div>
  );
}
