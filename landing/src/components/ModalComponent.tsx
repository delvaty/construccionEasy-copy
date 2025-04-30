import { useState, useEffect, ReactNode } from "react";
interface ModalProps {
    title: string;
    subtitle: string;
    dark?: boolean;
    open: boolean;
    setOpen: (value: boolean) => void;
    children?: ReactNode;
    footer?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, subtitle, dark = false, open, setOpen, children, footer }) => {
    const [show, setShow] = useState(false);
    const [animation, setAnimation] = useState("close-animation");

    useEffect(() => {
        if (open) {
            setShow(true);
            setAnimation("open-animation");
        } else {
            setAnimation("close-animation");
            setTimeout(() => {
                setShow(false);
            }, 250);
        }
    }, [open]);

    return (
        <div className={`fixed inset-0 justify-center items-center bg-[#0000005b] z-[1500] ${show ? "flex" : "hidden"} ${dark ? "dark" : ""}`}>
            <div className={`flex flex-col bg-[#ffffff] rounded-xl min-w-[300px] shadow-lg shadow-[#00000054] z-[10001] max-w-[90vw] ${animation}`}>
                <div className="flex items-center justify-between gap-4 p-4 border-b border-b-gray-800">
                    <div>
                        <p className="text-gray-900 text-xl">{title}</p>
                        <p className="text-gray-700">{subtitle}</p>
                    </div>
                    <div>
                        <button onClick={() => setOpen(false)}
                            className="text-black opacity-60 hover:opacity-100 transition-all bg-transparent border-none focus:border-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-x-lg" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    {children}
                </div>
                <div className="border-t border-t-gray-800 p-4">
                    {footer}
                </div>
            </div>
        </div>
    );
};

export default Modal;
