import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useEffect } from "react";


interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}
const modalRoot = document.getElementById("modal-root") as HTMLElement;

export function Modal({children, onClose}:ModalProps) {
  
 useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  if (!modalRoot) return null;
  return createPortal (
<div
  className={css.backdrop}
  role="dialog"
  aria-modal="true"
  onClick={handleBackdropClick}
>
  <div className={css.modal}>
    {children}
  </div>
</div>,
modalRoot

  )
  
}
