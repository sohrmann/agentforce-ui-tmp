'use client';
import { ChatProvider } from "@/hooks/ChatProvider";
import { clientEnv } from "@/config/client-env";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ChatProvider welcomeMessage={clientEnv.NEXT_PUBLIC_APP_INTRO_MESSAGE}>
      {children}
    </ChatProvider>
  );
} 