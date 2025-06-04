declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
      scrollY?: number;
      [key: string]: unknown;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      compress?: boolean;
      [key: string]: unknown;
    };
    pagebreak?: {
      mode?: string | string[];
      [key: string]: unknown;
    };
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance;
    from(element: HTMLElement): Html2PdfInstance;
    save(): Promise<void>;
    output(type?: string): Promise<string | Blob>;
    outputPdf(type?: string): Promise<string | Blob>;
    then(onFulfilled?: () => void, onRejected?: (error: Error) => void): Promise<void>;
  }

  function html2pdf(): Html2PdfInstance;

  export default html2pdf;
}