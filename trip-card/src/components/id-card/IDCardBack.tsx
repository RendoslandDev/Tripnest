interface Props {
  card: { cardId: string }
  nin?: string
}

export default function IDCardBack({ card, nin }: Props) {
  // Simple QR placeholder using CSS (the real QR ships on the PDF from the backend)
  return (
    <div
      id="id-card-back"
      className="w-[340px] h-[210px] rounded-xl overflow-hidden relative bg-white border border-slate-200"
    >
      {/* Top bar */}
      <div className="h-8 bg-[#0F1C3F]" />

      {/* Content */}
      <div className="flex items-center px-5 py-3 gap-4">
        {/* QR code placeholder */}
        <div className="flex-shrink-0">
          <div
            className="w-24 h-24 border-2 border-slate-300 rounded"
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='40' height='40' x='5' y='5' fill='none' stroke='%23000' stroke-width='8'/%3E%3Crect width='20' height='20' x='15' y='15' fill='%23000'/%3E%3Crect width='40' height='40' x='55' y='5' fill='none' stroke='%23000' stroke-width='8'/%3E%3Crect width='20' height='20' x='65' y='15' fill='%23000'/%3E%3Crect width='40' height='40' x='5' y='55' fill='none' stroke='%23000' stroke-width='8'/%3E%3Crect width='20' height='20' x='15' y='65' fill='%23000'/%3E%3Crect x='55' y='55' width='8' height='8' fill='%23000'/%3E%3Crect x='68' y='55' width='8' height='8' fill='%23000'/%3E%3Crect x='81' y='55' width='8' height='8' fill='%23000'/%3E%3Crect x='55' y='68' width='8' height='8' fill='%23000'/%3E%3Crect x='81' y='68' width='8' height='8' fill='%23000'/%3E%3Crect x='55' y='81' width='8' height='8' fill='%23000'/%3E%3Crect x='68' y='81' width='8' height='8' fill='%23000'/%3E%3Crect x='81' y='81' width='8' height='8' fill='%23000'/%3E%3C/svg%3E") center/contain no-repeat`,
            }}
          />
          {/* Barcode */}
          <div className="mt-1 h-6 w-24" style={{
            background: `repeating-linear-gradient(to right, #000 0px, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 5px, #fff 5px, #fff 7px)`
          }} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800">TRIPNEST ID</p>
          <div className="mt-2 space-y-1">
            <div>
              <p className="text-[9px] text-slate-400 uppercase">Card ID</p>
              <p className="text-xs font-bold font-mono text-slate-800">{card.cardId}</p>
            </div>
            {nin && (
              <div>
                <p className="text-[9px] text-slate-400 uppercase">National ID Number</p>
                <p className="text-xs font-bold font-mono text-slate-800">{nin}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 border-t border-slate-100 text-center">
        <p className="text-[9px] text-slate-500">
          If found, please contact TripNest Office <strong>+233 24 123 4567</strong>
        </p>
      </div>
    </div>
  )
}
