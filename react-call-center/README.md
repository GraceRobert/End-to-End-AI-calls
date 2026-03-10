# React Call Center Application

A modern, responsive call center management application built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Real-time KPIs and performance charts
- **Call Logs & Transcripts**: Searchable call history with AI transcript assistant
- **Performance Metrics**: Detailed analytics and error tracking
- **Settings**: Configurable call center preferences and integrations
- **Call Transcripts**: Detailed call analysis with audio playback
- **Responsive Design**: Mobile-first approach with modern UI/UX

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:

   ```bash
   cd react-call-center
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard with KPIs and charts
│   ├── CallLogs.tsx    # Call logs and AI assistant
│   ├── PerformanceMetrics.tsx  # Performance analytics
│   ├── Settings.tsx    # Configuration settings
│   └── CallTranscript.tsx      # Call transcript viewer
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Key Components

### Layout Component

- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- Search functionality in header
- User profile section

### Dashboard

- KPI cards with trend indicators
- Interactive charts using Recharts
- Responsive grid layout

### Call Logs

- Searchable data table
- AI transcript assistant
- Action buttons for each call

### Performance Metrics

- Time-series charts
- Error rate tracking
- Error type breakdown

### Settings

- Form-based configuration
- Organized in logical sections
- Save functionality

### Call Transcript

- Chat-like transcript display
- Call details sidebar
- Audio playback controls

## Styling

The application uses Tailwind CSS for styling with custom component classes:

- `.btn-primary`: Primary action buttons
- `.btn-secondary`: Secondary action buttons
- `.card`: Card containers with shadows
- `.input-field`: Form input styling

## Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Collapsible sidebar for mobile
- Touch-friendly interactions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
