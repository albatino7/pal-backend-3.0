import React from "react";
import {
  Link,
  Sparkles,
  Copy,
  Trash2,
  Hash,
  ExternalLink,
  Code,
} from "lucide-react";
import { useContext } from "react";
import { MyStore } from "../context/MyStore";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Urlcard = ({ gettAllUrl }) => {
  const { allUrlData } = useContext(MyStore);
  const [inputValue, setInputValue] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(null);
  console.log(currentUrl);

  const creatNewUrl = async () => {
    const resonse = await axios.post("http://localhost:5173/api/url/genrate", {
      url: inputValue,
    });

    const orignalurl = resonse.data.finalResult.orignalUrl;
    const shortCode = resonse.data.finalResult.shortCode;

    setCurrentUrl({
      orignalurl: orignalurl,
      shortCode: shortCode,
    });

    console.log(orignalurl, shortCode);
    setInputValue("");
    gettAllUrl();
  };

  const handleDelete = async (id) => {
    const response = await axios.delete(
      `http://localhost:5173/api/url/delete/${id}`,
    );
    // console.log(response);
    gettAllUrl();
  };

  useEffect(() => {}, []);
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <Link size={30} />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Shorten Your URL
          </h1>

          <p className="mt-3 text-slate-500">
            Create short, simple and shareable links in seconds.
          </p>
        </div>

        {/* URL Generator */}
        <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200 sm:p-7">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600" />

            <h2 className="text-xl font-semibold text-slate-800">
              Create Short URL
            </h2>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            {/* Original URL */}
            <div className="relative flex-1">
              <Link
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
                type="text"
                placeholder="Enter your long URL..."
                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Generate */}
            <button
              onClick={() => creatNewUrl()}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-95"
            >
              <Sparkles size={18} />
              Generate
            </button>
          </div>
        </div>

        {/* Current Generated URL */}
        <div className="mt-7 rounded-2xl bg-slate-900 p-5 text-white shadow-lg sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <ExternalLink size={18} className="text-slate-400" />

            <p className="text-sm text-slate-400">Current Generated URL</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-blue-400">
                {`http://localhost:3000/${currentUrl?.shortCode}`}
              </p>

              <p className="mt-1 truncate text-sm text-slate-400">
                {currentUrl?.orignalurl}
              </p>
            </div>

            <button className="flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 font-medium text-slate-900 transition hover:bg-slate-200">
              <Copy size={17} />
              Copy
            </button>
          </div>
        </div>

        {/* All Generated URLs */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link size={22} className="text-blue-600" />

              <h2 className="text-2xl font-bold text-slate-900">
                All Generated URLs
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {/* URL Item */}
            {allUrlData.map((elem) => {
              return (
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link size={16} className="text-blue-600" />

                        <p className="text-sm text-slate-400">Short URL</p>
                      </div>

                      <p className="mt-1 truncate font-semibold text-blue-600">
                        {`http://localhost:3000/${elem.shortCode}`}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <Hash size={14} className="text-slate-400" />

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {elem.shortCode}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        <Code copy={16} />
                        {elem.shortCode}
                      </button>

                      <button
                        onClick={() => handleDelete(elem.shortCode)}
                        className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Urlcard;
