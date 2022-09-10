import React, { useState } from "react";
import { FileInput, Spinner } from "flowbite-react";
import axios from "axios";
import { diffWords } from "diff";
import { CompareResponse } from "./types/api";
import Endpoints from "./api/endpoints";
import { Transition } from "@headlessui/react";

const apiUrl = "http://192.168.1.74:3001";

type State = "Initial" | "PdfSubmitted" | "ScanSubmitting" | "ScanSubmitted";

function App() {
  const [state, setState] = useState<State>("Initial");
  const [original, setOriginal] = useState<File>();
  const [scan, setScan] = useState<File>();

  const [message, setMessage] = useState<CompareResponse>();

  const onOriginalInput = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e?.currentTarget?.files?.[0];
    if (file) {
      setOriginal(file);
      setState("PdfSubmitted");
    }
  };

  const onScanInput = (e: React.FormEvent<HTMLInputElement>) => {
    const file = e?.currentTarget?.files?.[0];
    if (file) {
      setScan(file);
      setState("ScanSubmitting");

      if (original) {
        submitData(original, file);
      }
    }
  };

  const submitData = (original: File, scan: File) => {
    const data = new FormData();
    data.append("original", original);
    data.append("copy", scan);

    axios
      .post<CompareResponse>(apiUrl + Endpoints.compare, data)
      .then((resp) => {
        setMessage({ ...resp.data });
        setState("ScanSubmitted");
      })
      .catch((error) => alert(error));
  };

  return (
    <div className="h-screen flex flex-col">
      <main className="px-4 py-10 bg-gray-900 flex flex-col items-center justify-center flex-grow">
        <div className="h-full flex flex-col gap-4 flex-grow items-center justify-center py-4">
          <Transition
            show={state === "Initial"}
            enter="transition duration-500"
            enterFrom="opacity-0 translate-y-[200%]"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-[200%]"
            className="absolute"
          >
            <div>
              <label
                htmlFor="pdf"
                className="text-white font-bold text-2xl mb-4 block "
              >
                Vyberte vstupní PDF soubor
              </label>

              <FileInput
                id="pdf"
                name="pdf"
                accept="image/*"
                onInput={onOriginalInput}
              />
            </div>
          </Transition>
          <Transition
            show={state === "PdfSubmitted"}
            enter="transition duration-500"
            enterFrom="opacity-0 translate-y-[200%]"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-[200%]"
            className="absolute"
          >
            <div>
              <label
                htmlFor="image"
                className="text-white font-bold text-2xl mb-4 block"
              >
                Vyberte obrázek k porovnání
              </label>

              <FileInput
                id="image"
                name="image"
                accept="image/*"
                onInput={onScanInput}
              />
            </div>
          </Transition>

          <Transition
            show={state === "ScanSubmitting"}
            enter="transition duration-500"
            enterFrom="opacity-0 translate-y-[200%]"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-500"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-[200%]"
            className="absolute"
          >
            <div className="flex flex-col items-center space-y-4">
              <p className="text-white text-center font-bold text-2xl mb-4">
                Nahrávám obrázek k porovnání
              </p>
              <Spinner aria-label="Nahrávám vstupní PDF soubor" size={"xl"} />
            </div>
          </Transition>

          <Transition
            show={state === "ScanSubmitted"}
            enter="transition delay-500 duration-500"
            enterFrom="opacity-0 "
            enterTo="opacity-100 "
            leave="transition duration-500"
            leaveFrom="opacity-100 "
            leaveTo="opacity-0"
          >
            <div className="flex flex-col items-center h-full">
              <p className="text-white font-bold text-2xl mb-4">
                Porovnání obrázků dokončeno 
              </p>
              <div className="space-y-4 max-w-7xl mx-auto w-full">
                {message?.diffs.length === 0 && (
                  <div className="bg-green-600 shadow-lg shadow-green-700/20 overflow-hidden rounded-lg px-6 py-5 space-y-2">
                    <h3 className="text-lg leading-6 font-medium text-gray-100 flex space-x-4 items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                        />
                      </svg>

                      <span>Nenalezen žádný rozdíl</span>
                    </h3>
                    <p className="pl-10 text-gray-200 text-sm">
                      Všechno v pořádku, v dokumentech nebyl nalezen žádný
                      rozdíl.
                    </p>
                  </div>
                )}
                {message?.diffs
                  .map((diff) => ({
                    ...diff,
                    changes: diffWords(diff.original, diff.copy),
                  }))
                  .map((line) => (
                    <div className="bg-gray-800 shadow-lg shadow-red-700/20 overflow-hidden rounded-t-lg">
                      <div className="px-4 py-5 sm:px-6 bg-red-700">
                        <h3 className="text-lg leading-6 font-medium text-gray-100 flex space-x-4 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                          </svg>
                          <span>Nalezen rozdíl!</span>
                        </h3>
                      </div>
                      <div className="border rounded-b-lg border-red-700 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-700">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-400">
                              Řádek
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                              {line.lineNumber}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-400">
                              Rozdíl
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {line.changes.map((d) => (
                                <span
                                  className={
                                    d.added
                                      ? "text-green-400 mx-1"
                                      : d.removed
                                      ? "text-red-500 mx-1 line-through"
                                      : "text-gray-300"
                                  }
                                >
                                  {d.value}
                                </span>
                              ))}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-400">
                              Původní text
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                              {line.original}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-400">
                              Nový text
                            </dt>
                            <dd className="mt-1 text-sm text-gray-200 sm:mt-0 sm:col-span-2">
                              {line.copy}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  ))}

                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-gray-800 shadow-lg shadow-black/20 overflow-hidden rounded-lg border border-gray-600">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-600 ">
                      <h3 className="text-lg leading-6 font-medium text-gray-100">
                        Původní text
                      </h3>
                    </div>
                    <table className="px-4 py-5 text-gray-200 text-sm leading-relaxed w-full">
                      <tbody>
                        {message?.originalContent.split("\n").map((l, i) => (
                          <tr>
                            <th className="p-1 bg-black/10 font-medium text-gray-500 border-b border-gray-700/50">
                              {i + 1}
                            </th>
                            <td className="py-1 px-2 border-b border-gray-700/50">
                              {l}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-800 shadow-lg shadow-black/20 overflow-hidden rounded-lg border border-gray-600">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-600 ">
                      <h3 className="text-lg leading-6 font-medium text-gray-100">
                        Nový text
                      </h3>
                    </div>
                    <table className="px-4 py-5 text-gray-200 text-sm leading-relaxed w-full">
                      <tbody>
                        {message?.copyContent.split("\n").map((l, i) => (
                          <tr>
                            <th className="p-1 bg-black/10 font-medium text-gray-500 border-b border-gray-700/50">
                              {i + 1}
                            </th>
                            <td className="py-1 px-2 border-b border-gray-700/50">
                              {l}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="w-full">
                  <button
                    className="block bg-blue-500 text-white font-medium px-8 py-3 rounded-lg w-full disabled:bg-blue-900 disabled:text-gray-600 shadow-lg shadow-blue-500/20"
                    onClick={() => {
                      setState("Initial");
                    }}
                  >
                    Udělat další porovnání
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </main>
    </div>
  );
}

export default App;
