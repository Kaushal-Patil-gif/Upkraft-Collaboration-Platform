export default function ChatBox({ disabled }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h3 className="font-semibold mb-3">Project Chat</h3>

      <div className="h-40 border rounded mb-3 p-2 text-sm text-slate-500">
        {disabled
          ? "Complete payment to unlock chat."
          : "Chat messages will appear here."}
      </div>

      <input
        type="text"
        disabled={disabled}
        placeholder={
          disabled ? "Chat locked" : "Type your message..."
        }
        className="w-full border rounded px-3 py-2 disabled:bg-slate-100"
      />
    </div>
  );
}
