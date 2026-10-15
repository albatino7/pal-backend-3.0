import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "qrcode";
import { closeQrModal } from "../../ui/slices/uiSlice";
import Modal from "../../ui/components/Modal";
import { Download, Copy, Check } from "lucide-react";
import useClipboard from "../hooks/useClipboard";

export const UrlQrModal = () => {
  const dispatch = useDispatch();
  const qrState = useSelector((state) => state.ui.qrModal);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const { copy, isCopied } = useClipboard();

  useEffect(() => {
    let isCancelled = false;

    if (qrState.isOpen && qrState.shortUrl) {
      QRCode.toDataURL(qrState.shortUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => {
          if (!isCancelled) {
            setQrDataUrl(url);
          }
        })
        .catch((err) => console.error("QR Code generation error:", err));
    }

    return () => {
      isCancelled = true;
    };
  }, [qrState.isOpen, qrState.shortUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `snaplink-${qrState.shortCode || "qr"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal
      isOpen={qrState.isOpen}
      onClose={() => dispatch(closeQrModal())}
      title="Link QR Code"
    >
      <div className="flex flex-col items-center text-center">
        {/* QR Code Canvas/Image */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${qrState.shortUrl}`}
              className="h-44 w-44 sm:h-56 sm:w-56 object-contain"
            />
          ) : (
            <div className="flex h-44 w-44 sm:h-56 sm:w-56 items-center justify-center text-xs text-slate-400">
              Generating QR Code...
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-4 w-full text-left min-w-0">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Short URL
          </p>
          <p className="mt-0.5 truncate font-mono text-xs sm:text-sm font-semibold text-blue-600">
            {qrState.shortUrl}
          </p>
          {qrState.originalUrl && (
            <p className="mt-1 truncate text-[11px] text-slate-500">
              Target: {qrState.originalUrl}
            </p>
          )}
        </div>

        {/* Action buttons: Responsive 2-column or flex */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 w-full">
          <button
            onClick={() => copy(qrState.shortUrl, "Short URL")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 active:scale-98"
          >
            {isCopied(qrState.shortUrl) ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-98"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UrlQrModal;
