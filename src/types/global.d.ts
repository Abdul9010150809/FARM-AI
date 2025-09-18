// This declares the types for the entire project.

declare global {
  interface Window {
    // This function is called by the Google Translate script.
    googleTranslateElementInit?: () => void;

    // This defines the 'google' object on the window.
    google: {
      translate: {
        // This is the constructor for the TranslateElement.
        TranslateElement: {
          new (options: {
            pageLanguage: string,
            includedLanguages: string,
            autoDisplay: boolean,
            layout: any
          }, elementId: string): any;

          // This is the missing property that caused the second error.
          InlineLayout: {
            SIMPLE: any;
          };
        };
      };
      // This part is for Google Sign-In, which you use in App.tsx.
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// Adding this empty export makes the file a module.
export {};