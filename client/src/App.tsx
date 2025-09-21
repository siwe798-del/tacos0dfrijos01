import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebSocketProvider } from "./hooks/use-websocket";
import { PermanentAuthProvider } from "@/hooks/use-permanent-auth";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/pages/dashboard";
import SessionsPage from "@/pages/sessions";
import AuthTest from "@/pages/auth-test";
import SimpleAuth from "@/pages/simple-auth";
import TemplatesPage from "@/pages/templates";
import TemplateView from "@/pages/template-view";
import TemplateSantander from "@/pages/template-santander";
import TemplateLiverpool from "@/pages/template-liverpool";
import TemplateApple from "@/pages/template-apple";
import TemplateNetflix from "@/pages/template-netflix";
import TemplateNetflixBBVA from "@/pages/template-netflix-bbva";
import TemplateSixFlags from "@/pages/template-sixflags";
import TemplateLATAM from "@/pages/template-latam";
import TemplateActas from "@/pages/template-actas";
import TemplateBanamex from "@/pages/template-banamex";
import TemplateBbva from "@/pages/template-bbva";
import TemplateBbvaPremios from "@/pages/template-bbva-premios";
import TemplateBanortePremios from "@/pages/template-banorte-premios";
import TemplateSantanderPremios from "@/pages/template-santander-premios";
import TemplateSpotify from "@/pages/template-spotify";
import TemplateApple2 from "@/pages/template-apple2";
import TemplateInstagram from "@/pages/template-instagram";
import TemplateGoogle from "@/pages/template-google";
import TemplateBanCoppel from "@/pages/template-bancoppel";
import FacebookTemplate from "@/components/templates/facebook-template";
import AccessDenied from "@/pages/access-denied";
import Error403 from "@/pages/error-403";
import Error500 from "@/pages/error-500";
import SessionErrorPage from "@/pages/session-error";
import GeneratedLinksPage from "@/pages/generated-links";
import UsersPage from "@/pages/users";
import AnalyticsPage from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={SimpleAuth} />
      <Route path="/admin-test" component={AuthTest} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/templates" component={TemplatesPage} />
      <ProtectedRoute path="/sessions" component={SessionsPage} />
      <ProtectedRoute path="/links" component={GeneratedLinksPage} />
      <ProtectedRoute path="/users" component={UsersPage} />
      <ProtectedRoute path="/analytics" component={AnalyticsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="/template/santander" component={TemplateSantander} />
      <Route path="/template/liverpool" component={TemplateLiverpool} />
      <Route path="/template/apple" component={TemplateApple} />
      <Route path="/template/facebook" component={FacebookTemplate} />
      <Route path="/template/netflix" component={TemplateNetflix} />
      <Route path="/template/netflix-bbva" component={TemplateNetflixBBVA} />
      <Route path="/template/sixflags" component={TemplateSixFlags} />
      <Route path="/template/latam" component={TemplateLATAM} />
      <Route path="/template/actas" component={TemplateActas} />
      <Route path="/template/banamex" component={TemplateBanamex} />
      <Route path="/template/bbva" component={TemplateBbva} />
      <Route path="/template/bbva-premios" component={TemplateBbvaPremios} />
      <Route path="/template/banorte-premios" component={TemplateBanortePremios} />
      <Route path="/template/santander-premios" component={TemplateSantanderPremios} />
      <Route path="/template/spotify" component={TemplateSpotify} />
      <Route path="/template/apple2" component={TemplateApple2} />
      <Route path="/template/instagram" component={TemplateInstagram} />
      <Route path="/template/google" component={TemplateGoogle} />
      <Route path="/template/bancoppel" component={TemplateBanCoppel} />
      <Route path="/template/:templateName" component={TemplateView} />
      <Route path="/session-error" component={SessionErrorPage} />
      <Route path="/403" component={Error403} />
      <Route path="/500" component={Error500} />
      <Route path="/error" component={Error500} />
      <Route path="/" component={AccessDenied} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PermanentAuthProvider>
          <WebSocketProvider>
            <div className="dark min-h-screen bg-background text-foreground">
              <Toaster />
              <Router />
            </div>
          </WebSocketProvider>
        </PermanentAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
