export default function FileUpload({ disabled }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-semibold mb-3">File Upload</h3>

      <input
        type="file"
        disabled={disabled}
        className="block w-full text-sm disabled:opacity-50"
      />

      {disabled && (
        <p className="text-xs text-red-500 mt-2">
          Payment required to upload files.
        </p>
      )}
    </div>
  );
}
