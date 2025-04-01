// UploadModal.tsx
import LoadingReport from "../documentViews/loadingReport";

export default function UploadModal({
    onClose,
    onUpload,
    isLoading,
  }: {
    onClose: () => void;
    onUpload: (file: File) => void;
    isLoading: boolean;
  }) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded shadow-md w-[400px] text-center">
          {isLoading ? (
            <LoadingReport />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-4">Sube tu archivo</h2>
              <input
                type="file"
                accept="audio/*,video/*,.txt"
                onChange={handleFileChange}
              />
              <div className="mt-6 flex justify-between">
                <button onClick={onClose} className="px-4 py-2 border rounded">
                  Cancelar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }