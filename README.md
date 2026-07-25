# Project Structure

```
src/
├── App.tsx                         # Entry point that replaces the default template
├── lib/
│   ├── mockData.ts                 # Mock data, fixtures, and TypeScript type definitions
│   └── context.tsx                 # Global application state (navigation, user role, UI context)
├── components/
│   ├── ui.tsx                      # Shared UI components, design tokens, cards, buttons, badges
│   ├── Sidebar.tsx                 # Sidebar navigation, role switcher, personal return toggle
│   ├── Topbar.tsx                  # Breadcrumbs, global search, notifications
│   ├── CommandPalette.tsx          # Global ⌘K search across returns, documents, messages, and tasks
│   └── Layout.tsx                  # Main application shell combining sidebar and topbar
├── screens/
│   ├── Dashboard.tsx               # Dashboard with role-specific widgets and summaries
│   ├── Documents.tsx               # Searchable and filterable document library (214 mock records)
│   ├── Collaboration.tsx           # Threaded conversations with internal/client visibility
│   ├── Tasks.tsx                   # Task management for clients, CPAs, and administrators
│   ├── Settings.tsx                # Application settings, role switching, and personal return mode
│   └── returns/
│       ├── ReturnReview.tsx        # Tax return review workspace with multiple review tabs
│       ├── Traceability.tsx        # Visual document traceability with highlighted source regions
│       ├── AIInsights.tsx          # AI confidence scores, reasoning, and correction actions
│       └── StatusTimeline.tsx      # Reusable tax return status timeline component
```

## Directory Overview

### `App.tsx`
The application's main entry point. It initializes the layout, routing logic, and global context, replacing the default React template.

### `lib/`
Contains shared application utilities.

- **mockData.ts** – Provides all mock datasets, fixture records, and shared TypeScript interfaces.
- **context.tsx** – Implements React Context for global state management, including navigation, user roles, and application-wide settings.

### `components/`
Contains reusable UI building blocks used throughout the application.

- **ui.tsx** – Shared design system components such as cards, buttons, badges, and common styling primitives.
- **Sidebar.tsx** – Primary navigation menu with role switching and Personal Return mode toggle.
- **Topbar.tsx** – Displays breadcrumbs, search entry point, and notification controls.
- **CommandPalette.tsx** – Keyboard-accessible global search (`⌘K` / `Ctrl+K`) for navigating returns, documents, conversations, and tasks.
- **Layout.tsx** – Wraps pages with the common application shell, including sidebar and top navigation.

### `screens/`
Contains the primary application pages.

- **Dashboard.tsx** – Displays role-specific dashboards, statistics, task queues, and onboarding information.
- **Documents.tsx** – Searchable and filterable document repository containing 214 mock document records.
- **Collaboration.tsx** – Threaded communication interface supporting both internal and client-visible discussions.
- **Tasks.tsx** – Task management interface with client checklists and staff assignment views.
- **Settings.tsx** – Configuration page for role switching, Personal Return mode, and application information.

### `screens/returns/`
Specialized views supporting the tax return review workflow.

- **ReturnReview.tsx** – Central review interface with Status, Traceability, and AI Review tabs.
- **Traceability.tsx** – Displays document-to-return traceability with highlighted supporting evidence.
- **AIInsights.tsx** – Presents AI-generated confidence scores, explanations, and correction workflows.
- **StatusTimeline.tsx** – Reusable timeline component visualizing the progress of a tax return through review stages.
