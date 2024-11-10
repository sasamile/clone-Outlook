"use client";
import Image from "next/image";
import { emailsData } from "./EmailRoute";
import { useNewMailStore } from "@/hooks/new-mail-state";
import NewEmail from "./new-email";

interface EmailDetailProps {
  email: (typeof emailsData)[0] | null;
  onClose: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onClose }) => {
  const isNewMail = useNewMailStore((state) => state.isNewMail);
  if (isNewMail) {
    return <NewEmail />;
  }

  return (
    <>
      {!email ? (
        <div className=" text-gray-500 flex flex-col justify-center items-center h-[80vh]">
          <Image src={"/icons/dark.svg"} alt="dark" width={250} height={300} />
          <h3 className="text-white font-bold">
            Seleccionar un elemento para leerlo
          </h3>
          <p>No hay nada seleccionado</p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{email.subject}</h3>
              <button onClick={onClose} className="text-gray-500">
                ✕
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-400">
                De: {email.from.name} ({email.from.email})
              </p>
              <p className="text-sm text-gray-400">
                Fecha: {email.date ? new Date(email.date).toLocaleString() : ""}
              </p>
            </div>
            <p className="text-gray-50">{email.body}</p>
          </div>
        </div>
      )}
    </>
  );
};
