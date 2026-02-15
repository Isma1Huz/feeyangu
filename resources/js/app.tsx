import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import { initializeTheme } from './hooks/use-appearance';
// import { LanguageProvider } from './contexts/languageContext';
import { ToastProvider } from './components/ui/toast';

const appName = import.meta.env.VITE_APP_NAME || 'myFunus';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx')
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        const locale =
            (props.initialPage.props.locale as string | undefined) ?? 'nl';

        root.render(
            // <LanguageProvider locale={locale}>
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>
            // </LanguageProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});

// Initialize light/dark mode on load
initializeTheme();
