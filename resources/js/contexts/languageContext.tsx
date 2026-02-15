import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Translations = Record<string, string>;

interface LanguageContextType {
    __: (text: string) => string;
    locale: string;
    loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
    locale?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, locale = 'nl' }) => {
    const [translations, setTranslations] = useState<Translations>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log('refetch triggered');
        const fetchTranslations = async () => {
            try {
                const response = await fetch(`/locales/${locale}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to load: ${response.statusText}`);
                }

                const data: Translations = await response.json();
                setTranslations(data || {});
            } catch (error) {
                console.error('Failed to load translations:', error);
                setTranslations({});
            } finally {
                setLoading(false);
            }
        };

        fetchTranslations();
    }, [locale]);

    const __ = (text: string): string => {
        const translated = translations[text];
        return typeof translated === 'string' ? translated : text;
    };

    return <LanguageContext.Provider value={{ __, locale, loading }}> {children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
