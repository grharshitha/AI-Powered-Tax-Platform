import React from "react";
import { AppProvider, useApp } from "./lib/context";
import { GlobalStyle } from "./components/ui";
import Layout from "./components/Layout";
import Dashboard from "./screens/Dashboard";
import ReturnReview from "./screens/returns/ReturnReview";
import Documents from "./screens/Documents";
import Collaboration from "./screens/Collaboration";
import Tasks from "./screens/Tasks";
import Settings from "./screens/Settings";

function Screens() {
  const { screen } = useApp();
  switch (screen) {
    case "dashboard":
      return <Dashboard />;
    case "returns":
      return <ReturnReview />;
    case "documents":
      return <Documents />;
    case "collaboration":
      return <Collaboration />;
    case "tasks":
      return <Tasks />;
    case "settings":
      return <Settings />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <GlobalStyle />
      <Layout>
        <Screens />
      </Layout>
    </AppProvider>
  );
}
