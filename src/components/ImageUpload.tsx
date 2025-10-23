export const ImageUpload = ({
  label,
  image,
  onChange,
  onRemove,
}: {
  label: string;
  image: File | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) => (
  <div className="mt-4">
    {label && (
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
    )}
    <div className="relative w-40 h-40 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
      {image ? (
        <>
          <img
            src={typeof image === "string" ? image : URL.createObjectURL(image)}
            alt={`${label} Preview`}
            className="w-full h-full object-cover rounded-md"
          />
          {typeof image === "object" && (
            <button
              type="button"
              className="w-6 h-6 flex justify-center items-center absolute top-1 right-1 z-10 bg-white p-1 rounded-full text-red-500 hover:text-red-700 shadow"
              onClick={onRemove}
            >
              ✕
            </button>
          )}
        </>
      ) : (
        <span className="text-gray-400 text-sm">Click to upload</span>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-0"
      />
    </div>
  </div>
);
